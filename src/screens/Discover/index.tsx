import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { usePodcastSearch, forceRefreshSearch, useTrendingPodcasts } from '../../hooks/usePodcastSearch';

export default function DiscoverScreen({ navigation }: any) {
  const [searchInput, setSearchInput] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [lastSearchTime, setLastSearchTime] = useState(0);
  
  const queryClient = useQueryClient();

  // If there's an active query, use search hook, otherwise show trending
  const { data: searchData, isLoading: isSearchLoading } = usePodcastSearch(activeQuery);
  const { data: trendingData, isLoading: isTrendingLoading, refetch: refetchTrending } = useTrendingPodcasts();

  const handleSearch = async () => {
    if (!searchInput.trim()) return;
    
    const now = Date.now();
    const isConsecutive = searchInput === activeQuery && (now - lastSearchTime) < 3000; // if same search within 3s
    
    if (isConsecutive) {
      // Bypass cache
      setRefreshing(true);
      await forceRefreshSearch(searchInput, queryClient);
      setRefreshing(false);
    } else {
      setActiveQuery(searchInput);
    }
    
    setLastSearchTime(now);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (activeQuery) {
      await forceRefreshSearch(activeQuery, queryClient);
    } else {
      // Force refresh trending (could implement similar force bypass for trending)
      await refetchTrending(); 
    }
    setRefreshing(false);
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('PodcastDetails', { podcastId: item.id, title: item.title })}
    >
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardAuthor} numberOfLines={1}>{item.author}</Text>
      </View>
    </TouchableOpacity>
  );

  const data = activeQuery ? searchData?.feeds : trendingData?.feeds;
  const isLoading = activeQuery ? isSearchLoading : isTrendingLoading;

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Podcast ara... (Örn: Teknoloji)"
          value={searchInput}
          onChangeText={setSearchInput}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>Ara</Text>
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={data || []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={<Text style={styles.emptyText}>Sonuç bulunamadı.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  searchContainer: { flexDirection: 'row', padding: 16, backgroundColor: '#fff' },
  input: { flex: 1, height: 40, borderColor: '#ddd', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, backgroundColor: '#fafafa' },
  searchBtn: { marginLeft: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: '#007AFF', paddingHorizontal: 16, borderRadius: 8 },
  searchBtnText: { color: '#fff', fontWeight: '600' },
  list: { padding: 16 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  cardAuthor: { fontSize: 14, color: '#666' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#666' }
});
