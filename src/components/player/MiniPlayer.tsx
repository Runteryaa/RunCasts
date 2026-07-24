import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import TrackPlayer, { State, usePlaybackState } from 'react-native-track-player';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useNavigation } from '@react-navigation/native';

export default function MiniPlayer() {
  const { currentPodcast, isMiniPlayerVisible } = usePlayerStore();
  const navigation = useNavigation<any>();
  const playbackState = usePlaybackState();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // In v4, usePlaybackState returns an object with state or just the state enum depending on version. 
    // Usually it's `playbackState.state` in v4 if it's an object, or just `playbackState`
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

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => navigation.navigate('Player')}
    >
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{currentPodcast.title}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>Şu an oynatılıyor</Text>
      </View>
      <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
        <Text style={styles.playText}>{isPlaying ? '||' : '▶'}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 50, // Tabs'in hemen üstünde durması için (Tab yüksekliğine göre ayarlanabilir)
    left: 0,
    right: 0,
    backgroundColor: '#333',
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#444'
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 12,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12
  },
  playText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16
  }
});
