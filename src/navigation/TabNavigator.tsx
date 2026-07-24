import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DiscoverScreen from '../screens/Discover';
import PublishersScreen from '../screens/Publishers';

export type TabParamList = {
  Discover: undefined;
  Publishers: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen name="Discover" component={DiscoverScreen} options={{ title: 'Keşfet' }} />
      <Tab.Screen name="Publishers" component={PublishersScreen} options={{ title: 'Yayıncılar' }} />
    </Tab.Navigator>
  );
}
