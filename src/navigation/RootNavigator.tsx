import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import PodcastDetailsScreen from '../screens/PodcastDetails';
import PlayerScreen from '../screens/Player';
import MiniPlayer from '../components/player/MiniPlayer';

export type RootStackParamList = {
  MainTabs: undefined;
  PodcastDetails: { podcastId: string; title: string };
  Player: undefined;
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
          name="Player" 
          component={PlayerScreen} 
          options={{ presentation: 'modal', headerShown: false }} 
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
