import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feed from '../screen/home/Feed';
import Statistics from '../screen/home/Statistics';
import Discover from '../screen/home/Discover';
import MyProfile from '../screen/home/MyProfile';
import AppHeader from '../components/atoms/view/AppHeader';

const Tab = createBottomTabNavigator();

export default function Home() {
  return (
    <Tab.Navigator screenOptions={{ tabBarStyle: { position: 'absolute' } }}>
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          header: () => <AppHeader />,
        }}
      />
      <Tab.Screen name="Statistics" component={Statistics} />
      <Tab.Screen name="Discover" component={Discover} />
      <Tab.Screen name="MyProfile" component={MyProfile} />
    </Tab.Navigator>
  );
}