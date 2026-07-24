import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import TrackPlayer, { State, usePlaybackState, useProgress } from 'react-native-track-player';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { Play, Pause, X } from 'lucide-react-native';

export default function MiniPlayer() {
  const { currentPodcast, isMiniPlayerVisible, setMiniPlayerVisible } = usePlayerStore();
  const navigation = useNavigation<any>();
  const playbackState = usePlaybackState();
  const [isPlaying, setIsPlaying] = useState(false);
  const { position, duration } = useProgress();

  useEffect(() => {
    const stateVal = typeof playbackState === 'object' && playbackState !== null && 'state' in playbackState 
      ? (playbackState as any).state 
      : playbackState;
      
    setIsPlaying(stateVal === State.Playing);
  }, [playbackState]);

  if (!isMiniPlayerVisible || !currentPodcast) return null;

  const togglePlayback = async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const closePlayer = async () => {
    await TrackPlayer.stop();
    setMiniPlayerVisible(false);
  };

  const progressPercent = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <View 
      style={styles.container}
    >
      <TouchableOpacity 
        style={styles.touchableArea}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('Player')} // Full player screen (to be designed next)
      >
        <BlurView intensity={80} tint="light" style={styles.blurContainer}>
          {/* Progress Bar Top */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>

          <View style={styles.content}>
            {/* Left: Close Btn */}
            <TouchableOpacity style={styles.iconBtn} onPress={closePlayer}>
              <X color="#6B7280" size={20} />
            </TouchableOpacity>

            {/* Center: Info */}
            <View style={styles.info}>
              <Text style={styles.title} numberOfLines={1}>{currentPodcast.title}</Text>
              <Text style={styles.subtitle} numberOfLines={1}>Şu an oynatılıyor</Text>
            </View>

            {/* Right: Play/Pause Btn */}
            <TouchableOpacity style={styles.playBtn} onPress={togglePlayback}>
              {isPlaying ? (
                <Pause color="#111827" fill="#111827" size={24} />
              ) : (
                <Play color="#111827" fill="#111827" size={24} />
              )}
            </TouchableOpacity>
          </View>
        </BlurView>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60, // Above the bottom tab navigator
    left: 12,
    right: 12,
    zIndex: 999,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  touchableArea: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  blurContainer: {
    padding: 12,
  },
  progressBarBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    padding: 8,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  title: {
    color: '#111827',
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 2,
  },
  subtitle: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '500',
  },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
