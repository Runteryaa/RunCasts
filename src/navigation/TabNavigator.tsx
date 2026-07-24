import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Compass, Users, User, Heart } from 'lucide-react-native';
import DiscoverScreen from '../screens/Discover';
import PublishersScreen from '../screens/Publishers';

export type TabParamList = {
  Discover: undefined;
  Publishers: undefined;
  Favorites: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          height: 65,
          paddingBottom: 15,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        }
      }}
    >
      <Tab.Screen 
        name="Discover" 
        component={DiscoverScreen} 
        options={{ 
          title: 'Keşfet',
          tabBarIcon: ({ color, size }) => <Compass color={color} size={size || 24} />
        }} 
      />
      <Tab.Screen 
        name="Publishers" 
        component={PublishersScreen} 
        options={{ 
          title: 'Yayıncılar',
          tabBarIcon: ({ color, size }) => <Users color={color} size={size || 24} />
        }} 
      />
      <Tab.Screen 
        name="Favorites" 
        component={DiscoverScreen} // Temporary placeholder
        options={{ 
          title: 'Favoriler',
          tabBarIcon: ({ color, size }) => <Heart color={color} size={size || 24} />
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={DiscoverScreen} // Temporary placeholder
        options={{ 
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <User color={color} size={size || 24} />
        }} 
      />
    </Tab.Navigator>
  );
}
