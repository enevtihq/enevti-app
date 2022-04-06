import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import React, { ComponentType } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp } from 'enevti-app/utils/imageRatio';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AppTopTabBar from 'enevti-app/components/atoms/view/AppTopTabBar';
import { PROFILE_HEADER_HEIGHT_PERCENTAGE } from './AppProfileHeader';
import { useTheme } from 'react-native-paper';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { useTranslation } from 'react-i18next';
import { BackgroundColorContext } from 'enevti-app/context';

const Tab = createMaterialTopTabNavigator();

interface AppProfileBodyProps {
  headerHeight: number;
  animatedTabBarStyle: StyleProp<ViewStyle>;
  ownedNFTScreen: ComponentType<any>;
  onSaleNFTScreen: ComponentType<any>;
  collectionScreen: ComponentType<any>;
  style?: StyleProp<ViewStyle>;
}

export default function AppProfileBody({
  headerHeight,
  animatedTabBarStyle,
  ownedNFTScreen,
  onSaleNFTScreen,
  collectionScreen,
  style,
}: AppProfileBodyProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const backgroundColor = React.useContext(BackgroundColorContext);
  const styles = React.useMemo(() => makeStyles(), []);

  return (
    <View style={[styles.profileBody, style]}>
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
        sceneContainerStyle={{ backgroundColor: backgroundColor }}
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
        <Tab.Screen
          options={{
            tabBarLabel: ({ color }) => (
              <AppTextBody4 style={{ color: color }}>
                {t('profile:collection')} (2)
              </AppTextBody4>
            ),
          }}
          name={t('profile:collection')}
          component={collectionScreen}
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
    profileBody: {
      flex: 1,
      zIndex: -1,
    },
  });
