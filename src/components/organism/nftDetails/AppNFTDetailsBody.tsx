import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import React, { ComponentType } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AppTopTabBar from 'enevti-app/components/atoms/view/AppTopTabBar';
import { useTheme } from 'react-native-paper';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { useTranslation } from 'react-i18next';
import { HEADER_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppHeader';
import useDimension from 'enevti-app/utils/hook/useDimension';
import { BackgroundColorContext } from 'enevti-app/context';
import { TOP_TABBAR_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppTopTabBar';

export const NFT_DETAILS_TOP_TABBAR_HEIGHT_PERCENTAGE = TOP_TABBAR_HEIGHT_PERCENTAGE;

const Tab = createMaterialTopTabNavigator();

interface AppNFTDetailsBodyProps {
  collectionHeaderHeight: number;
  animatedTabBarStyle: StyleProp<ViewStyle>;
  activityScreen: ComponentType<any>;
  summaryScreen: ComponentType<any>;
  style?: StyleProp<ViewStyle>;
}

export default function AppNFTDetailsBody({
  collectionHeaderHeight,
  animatedTabBarStyle,
  activityScreen,
  summaryScreen,
  style,
}: AppNFTDetailsBodyProps) {
  const { t } = useTranslation();
  const { hp } = useDimension();
  const theme = useTheme();
  const backgroundColor = React.useContext(BackgroundColorContext);
  const styles = React.useMemo(() => makeStyles(), []);
  const headerHeight = hp(HEADER_HEIGHT_PERCENTAGE);

  return (
    <View style={[styles.profileBody, style]}>
      <Tab.Navigator
        tabBar={props => (
          <AppTopTabBar
            {...props}
            safeBackgroundBarHeight={headerHeight * 2}
            tabStyle={[styles.tabBarContainer, { top: collectionHeaderHeight }, animatedTabBarStyle]}
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
            tabBarLabel: ({ color }) => <AppTextBody4 style={{ color: color }}>{t('nftDetails:summary')}</AppTextBody4>,
          }}
          name={t('nftDetails:summary')}
          component={summaryScreen}
        />
        <Tab.Screen
          options={{
            tabBarLabel: ({ color }) => (
              <AppTextBody4 style={{ color: color }}>{t('nftDetails:activity')}</AppTextBody4>
            ),
          }}
          name={t('nftDetails:activity')}
          component={activityScreen}
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
      zIndex: 3,
    },
    profileBody: {
      flex: 1,
      zIndex: -1,
    },
  });
