import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrackPlayer, useOnPlaybackStateChange, useOnPlaybackProgressChange } from 'react-native-nitro-player';
import { usePlayerStore } from '../../store/usePlayerStore';

const { width } = Dimensions.get('window');

export default function PlayerScreen({ navigation }: any) {
  const { currentPodcast, setPlayerTabActive } = usePlayerStore();
  const { state: playbackState } = useOnPlaybackStateChange();
  const { position, totalDuration } = useOnPlaybackProgressChange();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setPlayerTabActive(true);
      return () => {
        setPlayerTabActive(false);
      };
    }, [])
  );

  useEffect(() => {
    setIsPlaying(playbackState === 'playing');
    setIsBuffering(playbackState === 'buffering');
  }, [playbackState]);

  const togglePlayback = async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const skipForward = async () => {
    await TrackPlayer.seek(position + 15);
  };

  const skipBackward = async () => {
    await TrackPlayer.seek(Math.max(0, position - 15));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Şu An Çalınan</Text>
      </View>
      
      <View style={styles.artworkPlaceholder}>
        <Text style={styles.artworkText}>Podcast Resmi</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>{currentPodcast?.title || 'Bilinmeyen Podcast'}</Text>
        <Text style={styles.author}>RunCasts</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: totalDuration > 0 ? `${(position / totalDuration) * 100}%` : '0%' }]} />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(totalDuration)}</Text>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity onPress={skipBackward} style={styles.secondaryButton}>
          <Text style={styles.secondaryText}>-15s</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={togglePlayback} style={styles.playButton}>
          {isBuffering ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.playText}>{isPlaying ? '||' : '▶'}</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity onPress={skipForward} style={styles.secondaryButton}>
          <Text style={styles.secondaryText}>+15s</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { padding: 16, alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  artworkPlaceholder: { width: width - 64, height: width - 64, backgroundColor: '#333', alignSelf: 'center', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  artworkText: { color: '#666', fontSize: 18 },
  infoContainer: { padding: 32, alignItems: 'center' },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  author: { color: '#aaa', fontSize: 16 },
  progressContainer: { paddingHorizontal: 32, marginTop: 20 },
  progressBarBg: { height: 6, backgroundColor: '#333', borderRadius: 3 },
  progressBarFill: { height: 6, backgroundColor: '#1DB954', borderRadius: 3 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  timeText: { color: '#888', fontSize: 12 },
  controlsContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 40, gap: 40 },
  playButton: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#1DB954', justifyContent: 'center', alignItems: 'center' },
  playText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  secondaryButton: { padding: 16 },
  secondaryText: { color: '#fff', fontSize: 16 }
});
