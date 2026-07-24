import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useDownloadProgress } from 'react-native-nitro-player';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export function useDownloadNotifications() {
  const { progressList, isDownloading } = useDownloadProgress({ activeOnly: false });
  const activeDownload = progressList.find(p => p.state === 'downloading' || p.state === 'pending');
  const recentlyCompleted = progressList.find(p => p.state === 'completed');
  
  const lastProgressStr = useRef('');
  
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    };
    requestPermissions();
  }, []);

  useEffect(() => {
    if (activeDownload) {
      const percentage = Math.round(activeDownload.progress * 100);
      const title = 'Bölüm İndiriliyor';
      const body = `%${percentage} tamamlandı...`;
      
      if (lastProgressStr.current !== body) {
        lastProgressStr.current = body;
        
        Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            autoDismiss: false,
            sticky: true,
          },
          trigger: null, // trigger immediately
          identifier: 'download_progress', // updating same identifier replaces previous
        });
      }
    }
  }, [activeDownload?.progress, activeDownload?.state]);

  useEffect(() => {
    if (recentlyCompleted && !isDownloading) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'İndirme Tamamlandı',
          body: 'Bölümü çevrimdışı dinleyebilirsiniz.',
          autoDismiss: true,
          sticky: false,
        },
        trigger: null,
        identifier: 'download_progress', // update one last time, then it auto dismisses
      });
      lastProgressStr.current = '';
    }
  }, [recentlyCompleted?.downloadId, isDownloading]);
}
