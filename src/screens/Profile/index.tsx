import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, StatusBar, ScrollView } from 'react-native';
import { useDownloadedTracks, TrackPlayer, DownloadManager, PlayerQueue } from 'react-native-nitro-player';
import { Play, Trash2, Settings, DownloadCloud } from 'lucide-react-native';
import { usePlayerStore } from '../../store/usePlayerStore';

export default function ProfileScreen({ navigation }: any) {
  const { downloadedTracks } = useDownloadedTracks();
  const setCurrentPodcast = usePlayerStore((state) => state.setCurrentPodcast);
  const setMiniPlayerVisible = usePlayerStore((state) => state.setMiniPlayerVisible);

  const handlePlayDownloaded = async (track: any) => {
    setCurrentPodcast({ id: track.trackId, title: track.originalTrack.title });
    setMiniPlayerVisible(true);
    
    try {
      let playlists = PlayerQueue.getAllPlaylists();
      let pId = PlayerQueue.getCurrentPlaylistId();
      if (!pId && playlists.length > 0) pId = playlists[0].id;
      if (!pId) pId = await PlayerQueue.createPlaylist('Downloads', 'Downloaded Episodes');

      await PlayerQueue.addTrackToPlaylist(pId, track.originalTrack);
      await TrackPlayer.playSong(track.trackId, pId);
    } catch (error) {
      console.log('Error playing downloaded track:', error);
    }
  };

  const renderDownloadItem = ({ item }: any) => {
    return (
      <TouchableOpacity style={styles.downloadCard} activeOpacity={0.7} onPress={() => handlePlayDownloaded(item)}>
        <View style={styles.downloadImageWrapper}>
          <Image source={{ uri: item.originalTrack.artwork || 'https://via.placeholder.com/150' }} style={styles.downloadImage} />
          <View style={styles.playOverlay}>
            <Play color="#fff" fill="#fff" size={20} />
          </View>
        </View>
        <Text style={styles.downloadTitle} numberOfLines={2}>{item.originalTrack.title}</Text>
        <TouchableOpacity style={styles.deleteBtn} onPress={async () => {
           try {
             await DownloadManager.deleteDownloadedTrack(item.trackId);
           } catch(e) {
             console.log('Error deleting', e);
           }
        }}>
           <Trash2 color="#EF4444" size={18} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Settings color="#111827" size={28} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>İndirilen Bölümler</Text>
        <FlatList
          horizontal
          data={downloadedTracks}
          keyExtractor={(item) => item.trackId}
          renderItem={renderDownloadItem}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.downloadsList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <DownloadCloud color="#9CA3AF" size={32} style={{ marginBottom: 8 }} />
              <Text style={styles.emptyText}>Henüz indirilen bir bölüm yok.</Text>
            </View>
          }
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Takip Edilen Podcastler</Text>
        <View style={styles.emptyContainerLarge}>
          <Text style={styles.emptyText}>Henüz takip ettiğiniz podcast yok.</Text>
        </View>
      </View>
    </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  downloadsList: {
    paddingHorizontal: 20,
  },
  downloadCard: {
    width: 140,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    shadowColor: '#000', 
    shadowOpacity: 0.03, 
    shadowRadius: 6, 
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  downloadImageWrapper: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 8,
  },
  downloadImage: { 
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
  downloadTitle: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: '#111827', 
    marginBottom: 8,
  },
  deleteBtn: {
    alignSelf: 'flex-start',
    padding: 4,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f1f1f1',
    borderRadius: 16,
    width: 200,
  },
  emptyContainerLarge: {
    alignItems: 'center',
    padding: 40,
    marginHorizontal: 20,
    backgroundColor: '#f1f1f1',
    borderRadius: 16,
  },
  emptyText: { 
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
  }
});
