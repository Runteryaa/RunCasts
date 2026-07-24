import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import PodcastDetailsScreen from '../screens/PodcastDetails';
import MiniPlayer from '../components/player/MiniPlayer';
import SettingsScreen from '../screens/Settings';

export type RootStackParamList = {
  MainTabs: undefined;
  PodcastDetails: { podcastId: string; title: string; image: string };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <View style={styles.container}>
      <Stack.Navigator>
        <Stack.Screen 
          name="MainTabs" 
          component={TabNavigator} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="PodcastDetails" 
          component={PodcastDetailsScreen} 
          options={({ route }) => ({ title: route.params.title })} 
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ title: 'Ayarlar', presentation: 'card' }} 
        />
      </Stack.Navigator>
      <MiniPlayer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
