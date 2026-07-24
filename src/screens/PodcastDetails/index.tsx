import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { usePodcastDetails } from '../../hooks/usePodcastDetails';
import { usePlayerStore } from '../../store/usePlayerStore';

export default function PodcastDetailsScreen({ route, navigation }: any) {
  const { podcastId, title } = route.params;
  const { data, isLoading } = usePodcastDetails(podcastId);
  const setCurrentPodcast = usePlayerStore((state) => state.setCurrentPodcast);
  const setMiniPlayerVisible = usePlayerStore((state) => state.setMiniPlayerVisible);

  const handlePlayEpisode = async (episode: any) => {
    setCurrentPodcast({ id: episode.id, title: episode.title });
    setMiniPlayerVisible(true);
    
    try {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: episode.id.toString(),
        url: episode.enclosureUrl, // Assuming the API returns audio url in enclosureUrl
        title: episode.title,
        artist: title,
        artwork: episode.image || episode.feedImage,
      });
      await TrackPlayer.play();
    } catch (error) {
      console.log('Error playing episode:', error);
    }
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.episodeCard} onPress={() => handlePlayEpisode(item)}>
      <Image source={{ uri: item.image || item.feedImage }} style={styles.episodeImage} />
      <View style={styles.episodeInfo}>
        <Text style={styles.episodeTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.episodeDate}>{new Date(item.datePublished * 1000).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.items || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>Bölüm bulunamadı.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  episodeCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 12, elevation: 1, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  episodeImage: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#eee' },
  episodeInfo: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  episodeTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  episodeDate: { fontSize: 13, color: '#888' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#666' }
});
