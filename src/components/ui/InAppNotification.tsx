import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useDownloadProgress } from 'react-native-nitro-player';
import Animated, { FadeInUp, FadeOutUp, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { DownloadCloud, CheckCircle2 } from 'lucide-react-native';
import CircularProgress from './CircularProgress';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function InAppNotification() {
  const { progressList, isDownloading } = useDownloadProgress({ activeOnly: false });
  const insets = useSafeAreaInsets();
  const [showComplete, setShowComplete] = useState(false);
  
  // Find the first active download, or the most recently completed one
  const activeDownload = progressList.find(p => p.state === 'downloading' || p.state === 'pending');
  const recentlyCompleted = progressList.find(p => p.state === 'completed');

  useEffect(() => {
    if (recentlyCompleted && !isDownloading) {
      setShowComplete(true);
      const timer = setTimeout(() => {
        setShowComplete(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [recentlyCompleted?.downloadId, isDownloading]);

  if (!isDownloading && !showComplete) return null;

  const currentProgress = activeDownload ? activeDownload.progress : 1;
  const isFinished = !isDownloading && showComplete;

  return (
    <Animated.View 
      entering={FadeInUp.duration(300).springify()}
      exiting={FadeOutUp.duration(300)}
      style={[styles.container, { top: insets.top + 10 }]}
    >
      <View style={styles.notification}>
        <View style={styles.iconContainer}>
          {isFinished ? (
            <CheckCircle2 color="#10B981" size={24} />
          ) : (
            <CircularProgress progress={currentProgress} size={28} color="#F59E0B" />
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {isFinished ? 'İndirme Tamamlandı' : 'Bölüm İndiriliyor'}
          </Text>
          <Text style={styles.subtitle}>
            {isFinished ? 'Dinlemeye hazır' : `%${Math.round(currentProgress * 100)} tamamlandı`}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 9999,
  },
  notification: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    color: '#F9FAFB',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 12,
  }
});
