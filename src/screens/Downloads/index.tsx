import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, StatusBar } from 'react-native';
import { useDownloadedTracks, TrackPlayer, DownloadManager } from 'react-native-nitro-player';
import { Play, DownloadCloud, Trash2 } from 'lucide-react-native';
import { usePlayerStore } from '../../store/usePlayerStore';

export default function DownloadsScreen() {
  const { downloadedTracks } = useDownloadedTracks();
  const setCurrentPodcast = usePlayerStore((state) => state.setCurrentPodcast);
  const setMiniPlayerVisible = usePlayerStore((state) => state.setMiniPlayerVisible);

  const handlePlayDownloaded = async (track: any) => {
    setCurrentPodcast({ id: track.id, title: track.title });
    setMiniPlayerVisible(true);
    
    try {
      await TrackPlayer.playSong(track.id);
    } catch (error) {
      console.log('Error playing downloaded track:', error);
    }
  };

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity style={styles.episodeCard} activeOpacity={0.7} onPress={() => handlePlayDownloaded(item)}>
        <View style={styles.episodeImageWrapper}>
          <Image source={{ uri: item.artwork || 'https://via.placeholder.com/150' }} style={styles.episodeImage} />
          <View style={styles.playOverlay}>
            <Play color="#fff" fill="#fff" size={20} />
          </View>
        </View>
        <View style={styles.episodeInfo}>
          <Text style={styles.episodeTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.episodeArtist} numberOfLines={1}>{item.artist}</Text>
        </View>
        <TouchableOpacity style={styles.deleteBtn} onPress={async () => {
           try {
             await DownloadManager.deleteDownloadedTrack(item.id);
           } catch(e) {
             console.log('Error deleting', e);
           }
        }}>
           <Trash2 color="#EF4444" size={20} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>İndirilenler</Text>
      </View>

      <FlatList
        data={downloadedTracks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <DownloadCloud color="#9CA3AF" size={48} style={{ marginBottom: 16 }} />
            <Text style={styles.emptyText}>Henüz indirilen bir bölüm yok.</Text>
            <Text style={styles.emptySubtext}>İnternet bağlantınız olmadan dinlemek için bölümleri indirebilirsiniz.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
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
    alignItems: 'center',
    shadowColor: '#000', 
    shadowOpacity: 0.03, 
    shadowRadius: 6, 
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  episodeImageWrapper: {
    width: 60,
    height: 60,
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
    marginBottom: 4,
    lineHeight: 20,
  },
  episodeArtist: {
    fontSize: 13,
    color: '#6B7280',
  },
  deleteBtn: {
    padding: 10,
  },
  emptyContainer: {
    paddingTop: 80,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyText: { 
    color: '#374151',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  }
});
