import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import React, { ComponentType } from 'react';
import { hp, wp } from 'enevti-app/utils/layout/imageRatio';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AppTopTabBar from 'enevti-app/components/atoms/view/AppTopTabBar';
import { PROFILE_HEADER_HEIGHT_PERCENTAGE } from './AppProfileHeader';
import { useTheme } from 'react-native-paper';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { useTranslation } from 'react-i18next';
import { BackgroundColorContext } from 'enevti-app/context';
import { useSelector } from 'react-redux';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'enevti-app/navigation';
import { RootState } from 'enevti-app/store/state';
import { selectProfileView } from 'enevti-app/store/slices/ui/view/profile';
import { selectMyProfileView } from 'enevti-app/store/slices/ui/view/myProfile';

const Tab = createMaterialTopTabNavigator();

interface AppProfileBodyProps {
  route: RouteProp<RootStackParamList, 'Profile'>;
  headerHeight: number;
  animatedTabBarStyle: StyleProp<ViewStyle>;
  ownedNFTScreen: ComponentType<any>;
  onSaleNFTScreen: ComponentType<any>;
  momentScreen: ComponentType<any>;
  collectionScreen: ComponentType<any>;
  style?: StyleProp<ViewStyle>;
  isMyProfile?: boolean;
}

export default function AppProfileBody({
  route,
  headerHeight,
  animatedTabBarStyle,
  ownedNFTScreen,
  onSaleNFTScreen,
  momentScreen,
  collectionScreen,
  style,
  isMyProfile = false,
}: AppProfileBodyProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const backgroundColor = React.useContext(BackgroundColorContext);
  const styles = React.useMemo(() => makeStyles(), []);

  const profile = useSelector((state: RootState) =>
    isMyProfile ? selectMyProfileView(state) : selectProfileView(state, route.key),
  );

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
                top: hp(PROFILE_HEADER_HEIGHT_PERCENTAGE) + headerHeight,
              },
              animatedTabBarStyle,
            ]}
          />
        )}
        sceneContainerStyle={{ backgroundColor: backgroundColor }}
        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarItemStyle: {
            width: wp(32),
          },
          tabBarStyle: {
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: theme.colors.background,
          },
        }}>
        <Tab.Screen
          options={{
            tabBarLabel: ({ color }) => (
              <AppTextBody4 numberOfLines={1} style={{ color: color }}>
                {t('profile:owned')} ({profile.ownedPagination ? profile.ownedPagination.version : 0})
              </AppTextBody4>
            ),
          }}
          name={t('profile:owned')}
          component={ownedNFTScreen}
        />
        <Tab.Screen
          options={{
            tabBarLabel: ({ color }) => (
              <AppTextBody4 numberOfLines={1} style={{ color: color }}>
                {t('profile:onSale')} ({profile.onSalePagination ? profile.onSalePagination.version : 0})
              </AppTextBody4>
            ),
          }}
          name={t('profile:onSale')}
          component={onSaleNFTScreen}
        />
        <Tab.Screen
          options={{
            tabBarLabel: ({ color }) => (
              <AppTextBody4 numberOfLines={1} style={{ color: color }}>
                {t('profile:moment')} ({profile.momentPagination ? profile.momentPagination.version : 0})
              </AppTextBody4>
            ),
          }}
          name={t('profile:moment')}
          component={momentScreen}
        />
        <Tab.Screen
          options={{
            tabBarLabel: ({ color }) => (
              <AppTextBody4 numberOfLines={1} style={{ color: color }}>
                {t('profile:collection')} ({profile.collectionPagination ? profile.collectionPagination.version : 0})
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
