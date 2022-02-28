import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import React, { ComponentType } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp } from '../../../utils/imageRatio';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AppTopTabBar from '../../atoms/view/AppTopTabBar';
import { PROFILE_HEADER_HEIGHT_PERCENTAGE } from './AppProfileHeader';
import { useTheme } from 'react-native-paper';
import AppTextBody4 from '../../atoms/text/AppTextBody4';

const Tab = createMaterialTopTabNavigator();

interface AppProfileBodyProps {
  headerHeight: number;
  animatedTabBarStyle: StyleProp<ViewStyle>;
  ownedNFTScreen: ComponentType<any>;
  onSaleNFTScreen: ComponentType<any>;
  style?: StyleProp<ViewStyle>;
}

export default function AppProfileBody({
  headerHeight,
  animatedTabBarStyle,
  ownedNFTScreen,
  onSaleNFTScreen,
  style,
}: AppProfileBodyProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = makeStyle();

  return (
    <View style={[{ height: hp('100%', insets) }, style]}>
      <Tab.Navigator
        tabBar={props => (
          <AppTopTabBar
            {...props}
            safeBackgroundBarHeight={headerHeight * 2}
            tabStyle={[
              styles.tabBarContainer,
              {
                top:
                  hp(PROFILE_HEADER_HEIGHT_PERCENTAGE, insets) + headerHeight,
              },
              animatedTabBarStyle,
            ]}
          />
        )}
        screenOptions={{
          tabBarStyle: {
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: theme.colors.background,
          },
        }}>
        <Tab.Screen
          options={{
            tabBarLabel: ({ color }) => (
              <AppTextBody4 style={{ color: color }}>Owned (10)</AppTextBody4>
            ),
          }}
          name={'Owned'}
          component={ownedNFTScreen}
        />
        <Tab.Screen
          options={{
            tabBarLabel: ({ color }) => (
              <AppTextBody4 style={{ color: color }}>On Sale (3)</AppTextBody4>
            ),
          }}
          name={'On Sale'}
          component={onSaleNFTScreen}
        />
      </Tab.Navigator>
    </View>
  );
}

const makeStyle = () =>
  StyleSheet.create({
    tabBarContainer: {
      top: 0,
      left: 0,
      right: 0,
      position: 'absolute',
      zIndex: 1,
    },
  });
