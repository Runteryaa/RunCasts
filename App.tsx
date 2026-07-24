import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TrackPlayer } from 'react-native-nitro-player';
import RootNavigator from './src/navigation/RootNavigator';
import { useDownloadNotifications } from './src/hooks/useDownloadNotifications';

const queryClient = new QueryClient();

export default function App() {
  useDownloadNotifications();

  useEffect(() => {
    const setupPlayer = async () => {
      try {
        await TrackPlayer.configure({
          showInNotification: true,
          androidAutoEnabled: true,
          carPlayEnabled: true
        });
      } catch (e) {
        console.log('Player setup failed or already setup', e);
      }
    };
    
    setupPlayer();
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <RootNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
