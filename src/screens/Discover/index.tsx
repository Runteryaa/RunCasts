import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Image, StatusBar } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { usePodcastSearch, forceRefreshSearch, useTrendingPodcasts } from '../../hooks/usePodcastSearch';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Compass, PlayCircle } from 'lucide-react-native';

export default function DiscoverScreen({ navigation }: any) {
  const [searchInput, setSearchInput] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [lastSearchTime, setLastSearchTime] = useState(0);
  
  const queryClient = useQueryClient();

  const { data: searchData, isLoading: isSearchLoading } = usePodcastSearch(activeQuery);
  const { data: trendingData, isLoading: isTrendingLoading, refetch: refetchTrending } = useTrendingPodcasts();

  const handleSearch = async () => {
    if (!searchInput.trim()) return;
    const now = Date.now();
    const isConsecutive = searchInput === activeQuery && (now - lastSearchTime) < 3000;
    
    if (isConsecutive) {
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
      await refetchTrending(); 
    }
    setRefreshing(false);
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('PodcastDetails', { podcastId: item.id, title: item.title })}
    >
      <View style={styles.cardImageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.cardImage} />
        ) : (
          <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.cardImagePlaceholder}>
            <Compass color="#fff" size={32} />
          </LinearGradient>
        )}
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.cardAuthor} numberOfLines={1}>{item.author || 'Bilinmeyen Yazar'}</Text>
        <View style={styles.cardFooter}>
          <PlayCircle color="#007AFF" size={16} />
          <Text style={styles.cardEpisodes}>{item.episodeCount || 0} Bölüm</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const data = activeQuery ? searchData?.feeds : trendingData?.feeds;
  const isLoading = activeQuery ? isSearchLoading : isTrendingLoading;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Keşfet</Text>
        <Text style={styles.headerSubtitle}>En yeni ve popüler podcastleri bul</Text>
        
        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <Search color="#999" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Podcast ara... (Örn: Teknoloji)"
            placeholderTextColor="#999"
            value={searchInput}
            onChangeText={setSearchInput}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchInput.length > 0 && (
            <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
              <Text style={styles.searchBtnText}>Ara</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Content */}
      <View style={styles.contentContainer}>
        {activeQuery === '' && (
          <Text style={styles.sectionTitle}>Trend Olanlar 🔥</Text>
        )}
        {activeQuery !== '' && (
          <Text style={styles.sectionTitle}>Arama Sonuçları 🔍</Text>
        )}

        {isLoading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={data || []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF" />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Compass color="#ccc" size={48} />
                <Text style={styles.emptyText}>Henüz bir şey bulunamadı.</Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA'
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 20,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  searchBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    marginLeft: 8,
  },
  searchBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 20,
    marginTop: 15,
    marginBottom: 10,
  },
  list: { 
    padding: 20,
    paddingTop: 10,
    paddingBottom: 100,
  },
  card: { 
    flexDirection: 'row',
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    marginBottom: 16, 
    padding: 12,
    shadowColor: '#000', 
    shadowOpacity: 0.04, 
    shadowRadius: 8, 
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: { 
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#111827', 
    marginBottom: 4,
    lineHeight: 22,
  },
  cardAuthor: { 
    fontSize: 14, 
    color: '#6B7280',
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardEpisodes: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  emptyText: { 
    marginTop: 16, 
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '500'
  }
});
