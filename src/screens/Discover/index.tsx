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
  
  const queryClient = useQueryClient();

  const { data: searchData, isLoading: isSearchLoading } = usePodcastSearch(activeQuery);
  const { data: localTrending, isLoading: isLocalTrendingLoading, refetch: refetchLocal } = useTrendingPodcasts('tr');
  const { data: globalTrending, isLoading: isGlobalTrendingLoading, refetch: refetchGlobal } = useTrendingPodcasts();
  const { data: recommendedData, isLoading: isRecommendedLoading } = usePodcastSearch('technology');

  const handleSearch = async () => {
    if (!searchInput.trim()) return;
    setActiveQuery(searchInput);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (activeQuery) {
      await forceRefreshSearch(activeQuery, queryClient);
    } else {
      await refetchLocal();
      await refetchGlobal();
    }
    setRefreshing(false);
  };

  const renderHorizontalItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.hCard}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('PodcastDetails', { podcastId: item.id, title: item.title, image: item.image })}
    >
      <View style={styles.hCardImageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.hCardImage} />
        ) : (
          <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.hCardImagePlaceholder}>
            <Compass color="#fff" size={24} />
          </LinearGradient>
        )}
      </View>
      <Text style={styles.hCardTitle} numberOfLines={2}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderVerticalItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.vCard}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('PodcastDetails', { podcastId: item.id, title: item.title, image: item.image })}
    >
      <View style={styles.vCardImageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.vCardImage} />
        ) : (
          <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.vCardImagePlaceholder}>
            <Compass color="#fff" size={32} />
          </LinearGradient>
        )}
      </View>
      <View style={styles.vCardInfo}>
        <Text style={styles.vCardTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.vCardAuthor} numberOfLines={1}>{item.author || 'Bilinmeyen Yazar'}</Text>
        <View style={styles.vCardFooter}>
          <PlayCircle color="#007AFF" size={16} />
          <Text style={styles.vCardEpisodes}>{item.episodeCount || 0} Bölüm</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => {
    if (activeQuery) {
      return (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Arama Sonuçları: {activeQuery}</Text>
        </View>
      );
    }

    return (
      <View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Türkiye'de Popüler 🔥</Text>
        </View>
        {isLocalTrendingLoading ? (
          <ActivityIndicator color="#007AFF" style={{ marginVertical: 20 }} />
        ) : (
          <FlatList
            horizontal
            data={localTrending?.feeds || []}
            keyExtractor={(item) => `tr_${item.id}`}
            renderItem={renderHorizontalItem}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Önerilenler 💡</Text>
        </View>
        {isRecommendedLoading ? (
          <ActivityIndicator color="#007AFF" style={{ marginVertical: 20 }} />
        ) : (
          <FlatList
            horizontal
            data={recommendedData?.feeds?.slice(0, 10) || []}
            keyExtractor={(item) => `rec_${item.id}`}
            renderItem={renderHorizontalItem}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dinlemeye Devam Et 🎧</Text>
        </View>
        <View style={styles.emptyContinueContainer}>
          <Text style={styles.emptyContinueText}>Şu an yarım kalan bir bölüm yok.</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dünyada Trend Olanlar 🌍</Text>
        </View>
      </View>
    );
  };

  const verticalData = activeQuery ? searchData?.feeds : globalTrending?.feeds;
  const isVerticalLoading = activeQuery ? isSearchLoading : isGlobalTrendingLoading;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Keşfet</Text>
        
        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <Search color="#999" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Podcast ara..."
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
      <FlatList
        data={verticalData || []}
        keyExtractor={(item) => `global_${item.id}`}
        renderItem={renderVerticalItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.mainList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF" />
        }
        ListFooterComponent={
          isVerticalLoading ? <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 20 }} /> : null
        }
        ListEmptyComponent={
          !isVerticalLoading ? (
            <View style={styles.emptyContainer}>
              <Compass color="#ccc" size={48} />
              <Text style={styles.emptyText}>Henüz bir şey bulunamadı.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1'
  },
  headerTitle: { fontSize: 32, fontWeight: '800', color: '#111827', marginBottom: 16 },
  searchWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 16, height: 48 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#111827' },
  searchBtn: { backgroundColor: '#007AFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginLeft: 8 },
  searchBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 13 },
  mainList: { paddingBottom: 100 },
  sectionHeader: { paddingHorizontal: 20, marginTop: 24, marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  horizontalList: { paddingHorizontal: 16 },
  hCard: { width: 120, marginHorizontal: 6 },
  hCardImageContainer: { width: 120, height: 120, borderRadius: 16, overflow: 'hidden', backgroundColor: '#F3F4F6', marginBottom: 8 },
  hCardImage: { width: '100%', height: '100%' },
  hCardImagePlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  hCardTitle: { fontSize: 13, fontWeight: '600', color: '#111827', lineHeight: 18 },
  emptyContinueContainer: { marginHorizontal: 20, backgroundColor: '#f1f1f1', padding: 20, borderRadius: 16, alignItems: 'center' },
  emptyContinueText: { color: '#6B7280', fontSize: 14 },
  vCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 20, marginHorizontal: 20, marginBottom: 16, padding: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  vCardImageContainer: { width: 80, height: 80, borderRadius: 14, overflow: 'hidden', backgroundColor: '#F3F4F6' },
  vCardImage: { width: '100%', height: '100%' },
  vCardImagePlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  vCardInfo: { flex: 1, marginLeft: 14, justifyContent: 'center' },
  vCardTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4, lineHeight: 22 },
  vCardAuthor: { fontSize: 14, color: '#6B7280', marginBottom: 8 },
  vCardFooter: { flexDirection: 'row', alignItems: 'center' },
  vCardEpisodes: { fontSize: 12, color: '#007AFF', fontWeight: '600', marginLeft: 4 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 40 },
  emptyText: { marginTop: 16, color: '#9CA3AF', fontSize: 16, fontWeight: '500' }
});
