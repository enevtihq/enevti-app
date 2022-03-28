import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import React, { ComponentType } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp, SafeAreaInsets } from '../../../utils/imageRatio';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AppTopTabBar from '../../atoms/view/AppTopTabBar';
import { useTheme } from 'react-native-paper';
import Color from 'color';
import AppTextBody4 from '../../atoms/text/AppTextBody4';
import { useTranslation } from 'react-i18next';
import { HEADER_HEIGHT_PERCENTAGE } from '../../atoms/view/AppHeader';

const Tab = createMaterialTopTabNavigator();

interface AppCollectionBodyProps {
  collectionHeaderHeight: number;
  animatedTabBarStyle: StyleProp<ViewStyle>;
  mintedItemsScreen: ComponentType<any>;
  activityScreen: ComponentType<any>;
  style?: StyleProp<ViewStyle>;
}

export default function AppCollectionBody({
  collectionHeaderHeight,
  animatedTabBarStyle,
  mintedItemsScreen,
  activityScreen,
  style,
}: AppCollectionBodyProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = React.useMemo(() => makeStyles(insets), [insets]);
  const headerHeight = hp(HEADER_HEIGHT_PERCENTAGE, insets);

  return (
    <View style={[styles.profileBody, style]}>
      <Tab.Navigator
        tabBar={props => (
          <AppTopTabBar
            {...props}
            safeBackgroundBarHeight={headerHeight * 2}
            tabStyle={[
              styles.tabBarContainer,
              { top: collectionHeaderHeight },
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
                {t('collection:mintedItems')}
              </AppTextBody4>
            ),
          }}
          name={t('collection:mintedItems')}
          component={mintedItemsScreen}
        />
        <Tab.Screen
          options={{
            tabBarLabel: ({ color }) => (
              <AppTextBody4 style={{ color: color }}>
                {t('collection:activity')}
              </AppTextBody4>
            ),
          }}
          name={t('collection:activity')}
          component={activityScreen}
        />
      </Tab.Navigator>
    </View>
  );
}

const makeStyles = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    tabBarContainer: {
      top: 0,
      left: 0,
      right: 0,
      position: 'absolute',
      zIndex: 1,
    },
    profileBody: {
      height: hp('100%', insets),
      zIndex: -1,
    },
  });
