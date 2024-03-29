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

const Tab = createMaterialTopTabNavigator();

interface AppCollectionBodyProps {
  collectionHeaderHeight: number;
  animatedTabBarStyle: StyleProp<ViewStyle>;
  mintedItemsScreen: ComponentType<any>;
  momentScreen: ComponentType<any>;
  activityScreen: ComponentType<any>;
  style?: StyleProp<ViewStyle>;
}

export default function AppCollectionBody({
  collectionHeaderHeight,
  animatedTabBarStyle,
  mintedItemsScreen,
  momentScreen,
  activityScreen,
  style,
}: AppCollectionBodyProps) {
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
            tabBarLabel: ({ color }) => (
              <AppTextBody4 style={{ color: color }}>{t('collection:mintedItems')}</AppTextBody4>
            ),
          }}
          name={t('collection:mintedItems')}
          component={mintedItemsScreen}
        />
        <Tab.Screen
          options={{
            tabBarLabel: ({ color }) => <AppTextBody4 style={{ color: color }}>{t('collection:moment')}</AppTextBody4>,
          }}
          name={t('collection:moment')}
          component={momentScreen}
        />
        <Tab.Screen
          options={{
            tabBarLabel: ({ color }) => (
              <AppTextBody4 style={{ color: color }}>{t('collection:activity')}</AppTextBody4>
            ),
          }}
          name={t('collection:activity')}
          component={activityScreen}
        />
      </Tab.Navigator>
    </View>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
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
