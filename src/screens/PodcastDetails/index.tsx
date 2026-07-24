import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image, StatusBar, Alert } from 'react-native';
import { TrackPlayer, PlayerQueue, DownloadManager, useDownloadedTracks, useDownloadProgress } from 'react-native-nitro-player';
import { usePodcastDetails } from '../../hooks/usePodcastDetails';
import { usePlayerStore } from '../../store/usePlayerStore';
import { Play, PlayCircle, Clock, Calendar, ArrowLeft, Download, CheckCircle2 } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import CircularProgress from '../../components/ui/CircularProgress';

export default function PodcastDetailsScreen({ route, navigation }: any) {
  const { podcastId, title, image } = route.params;
  const { data, isLoading } = usePodcastDetails(podcastId);
  const setCurrentPodcast = usePlayerStore((state) => state.setCurrentPodcast);
  const setMiniPlayerVisible = usePlayerStore((state) => state.setMiniPlayerVisible);
  const { isTrackDownloaded } = useDownloadedTracks();
  const { getProgress } = useDownloadProgress();

  const handlePlayEpisode = async (episode: any) => {
    setCurrentPodcast({ id: episode.id, title: episode.title });
    setMiniPlayerVisible(true);
    
    try {
      // Nitro Player uses Playlists and Track IDs
      let playlists = PlayerQueue.getAllPlaylists();
      let pId = PlayerQueue.getCurrentPlaylistId();
      if (!pId && playlists.length > 0) pId = playlists[0].id;
      
      if (!pId) {
        pId = await PlayerQueue.createPlaylist('Podcast', 'Podcast Episodes');
      }

      const trackId = episode.id.toString();
      await PlayerQueue.addTrackToPlaylist(pId, {
        id: trackId,
        title: episode.title,
        artist: title,
        album: title,
        duration: Math.round(episode.duration || 0),
        url: episode.enclosureUrl,
        artwork: episode.image || episode.feedImage || image,
      });

      await TrackPlayer.playSong(trackId, pId);
    } catch (error) {
      console.log('Error playing episode:', error);
    }
  };

  const handleDownloadEpisode = async (episode: any) => {
    try {
      const trackId = episode.id.toString();
      await DownloadManager.downloadTrack({
        id: trackId,
        title: episode.title,
        artist: title,
        album: title,
        duration: Math.round(episode.duration || 0),
        url: episode.enclosureUrl,
        artwork: episode.image || episode.feedImage || image,
      });
      // Removed Alert.alert, InAppNotification will handle it!
    } catch (e) {
      console.log('Download Error:', e);
    }
  };

  const renderItem = ({ item }: any) => {
    const pubDate = new Date(item.datePublished * 1000).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
    const duration = Math.round((item.duration || 0) / 60);
    const downloaded = isTrackDownloaded(item.id.toString());
    const progress = getProgress(item.id.toString());
    const isDownloading = progress?.state === 'downloading' || progress?.state === 'pending';

    return (
      <TouchableOpacity style={styles.episodeCard} activeOpacity={0.7} onPress={() => handlePlayEpisode(item)}>
        <View style={styles.episodeImageWrapper}>
          <Image source={{ uri: item.image || item.feedImage || image }} style={styles.episodeImage} />
          <View style={styles.playOverlay}>
            <Play color="#fff" fill="#fff" size={20} />
          </View>
        </View>
        <View style={styles.episodeInfo}>
          <Text style={styles.episodeTitle} numberOfLines={2}>{item.title}</Text>
          
          <View style={styles.episodeMeta}>
            <View style={styles.metaBadge}>
              <Calendar color="#6B7280" size={12} />
              <Text style={styles.metaText}>{pubDate}</Text>
            </View>
            {duration > 0 && (
              <View style={[styles.metaBadge, { marginLeft: 8 }]}>
                <Clock color="#6B7280" size={12} />
                <Text style={styles.metaText}>{duration} dk</Text>
              </View>
            )}
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.downloadBtn} 
          onPress={() => { if(!downloaded && !isDownloading) handleDownloadEpisode(item); }}
        >
          {downloaded ? (
            <CheckCircle2 color="#10B981" size={24} />
          ) : isDownloading ? (
            <CircularProgress progress={progress?.progress || 0} size={24} color="#F59E0B" />
          ) : (
            <Download color="#9CA3AF" size={24} />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Parallax-like Header */}
      <View style={styles.header}>
        <Image source={{ uri: image }} style={styles.headerImageBlur} blurRadius={40} />
        <LinearGradient colors={['rgba(0,0,0,0.4)', '#F8F9FA']} style={styles.headerGradient} />
        
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ArrowLeft color="#fff" size={28} />
          </TouchableOpacity>
          <Image source={{ uri: image }} style={styles.headerArt} />
          <Text style={styles.headerTitle} numberOfLines={2}>{title}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : (
          <FlatList
            data={data?.items || []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Bölüm bulunamadı.</Text>
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
    height: 320,
    width: '100%',
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  headerImageBlur: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backBtn: {
    position: 'absolute',
    top: -150,
    left: -40, // Relative to center
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
  headerArt: {
    width: 160,
    height: 160,
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  list: { 
    padding: 16,
    paddingBottom: 100,
  },
  episodeCard: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    padding: 12, 
    borderRadius: 16, 
    marginBottom: 12, 
    shadowColor: '#000', 
    shadowOpacity: 0.03, 
    shadowRadius: 6, 
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  episodeImageWrapper: {
    width: 70,
    height: 70,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  episodeImage: { 
    width: '100%', 
    height: '100%', 
    backgroundColor: '#eee' 
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  episodeInfo: { 
    flex: 1, 
    marginLeft: 14, 
    justifyContent: 'center' 
  },
  episodeTitle: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: '#111827', 
    marginBottom: 8,
    lineHeight: 20,
  },
  episodeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  metaText: { 
    fontSize: 12, 
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  emptyContainer: {
    paddingTop: 40,
    alignItems: 'center',
  },
  emptyText: { 
    color: '#9CA3AF',
    fontSize: 15,
  },
  downloadBtn: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
