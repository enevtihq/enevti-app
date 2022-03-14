import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import React, { ComponentType } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp } from '../../../utils/imageRatio';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AppTopTabBar from '../../atoms/view/AppTopTabBar';
import { PROFILE_HEADER_HEIGHT_PERCENTAGE } from './AppProfileHeader';
import { useTheme } from 'react-native-paper';
import Color from 'color';
import AppTextBody4 from '../../atoms/text/AppTextBody4';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = makeStyles();

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
        sceneContainerStyle={{
          backgroundColor: Color(theme.colors.background)
            .darken(theme.dark ? 0.1 : 0.02)
            .rgb()
            .toString(),
        }}
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
              <AppTextBody4 style={{ color: color }}>
                {t('profile:owned')} (10)
              </AppTextBody4>
            ),
          }}
          name={t('profile:owned')}
          component={ownedNFTScreen}
        />
        <Tab.Screen
          options={{
            tabBarLabel: ({ color }) => (
              <AppTextBody4 style={{ color: color }}>
                {t('profile:onsale')} (3)
              </AppTextBody4>
            ),
          }}
          name={t('profile:onsale')}
          component={onSaleNFTScreen}
        />
      </Tab.Navigator>
    </View>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    tabBarContainer: {
      top: 0,
      left: 0,
      right: 0,
      position: 'absolute',
      zIndex: 1,
    },
  });
