import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feed from '../screen/home/Feed';
import Statistics from '../screen/home/Statistics';
import Discover from '../screen/home/Discover';
import MyProfile from '../screen/home/MyProfile';
import AppHeader from '../components/atoms/view/AppHeader';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  withSpring,
} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { diffClamp } from '../utils/animation';
import AppTabBar from '../components/atoms/view/AppTabBar';
import { hp } from '../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppHeaderAction from '../components/atoms/view/AppHeaderAction';
import { iconMap } from '../components/atoms/icon/AppIconComponent';
import { TouchableRipple, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator();
const TABBAR_HEIGHT_PERCENTAGE = 8;
const HEADER_HEIGHT_PERCENTAGE = 9.5;

export default function Home() {
  let activeTab = 0;
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const headerHeight = hp(HEADER_HEIGHT_PERCENTAGE, insets);
  const tabBarHeight = hp(TABBAR_HEIGHT_PERCENTAGE, insets);
  const tabScrollY = [
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
  ];

  const feedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            tabScrollY[0].value,
            [0, headerHeight + insets.top],
            [0, -(headerHeight + insets.top)],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  });
  const feedAnimatedScrollHandler = useAnimatedScrollHandler({
    onScroll: (event, ctx: { prevY: number; current: number }) => {
      const diff = event.contentOffset.y - ctx.prevY;
      tabScrollY[0].value = diffClamp(
        ctx.current + diff,
        0,
        headerHeight + insets.top,
      );
    },
    onBeginDrag: (event, ctx) => {
      ctx.prevY = event.contentOffset.y;
    },
    onEndDrag: (event, ctx) => {
      if (
        tabScrollY[0].value < (headerHeight + insets.top) / 2 ||
        event.contentOffset.y < headerHeight + insets.top
      ) {
        tabScrollY[0].value = withSpring(0);
        ctx.current = 0;
      } else {
        tabScrollY[0].value = withSpring(headerHeight + insets.top);
        ctx.current = headerHeight + insets.top;
      }
    },
  });

  const tabBarStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            tabScrollY[activeTab].value,
            [0, tabBarHeight + insets.bottom],
            [0, tabBarHeight + insets.bottom],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <Tab.Navigator
      tabBar={props => <AppTabBar {...props} style={tabBarStyle} />}
      screenOptions={{
        tabBarStyle: {
          position: 'absolute',
          height: tabBarHeight + insets.bottom,
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.background,
        },
      }}>
      <Tab.Screen
        name="Feed"
        listeners={{
          tabPress: () => {
            activeTab = 0;
          },
        }}
        options={{
          tabBarLabel: t('home:feed'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name={iconMap.home}
              color={color}
              size={size}
            />
          ),
          tabBarButton: props => (
            <TouchableRipple
              {...props}
              disabled={props.disabled as boolean | undefined}
            />
          ),
          header: () => (
            <AppHeader style={feedStyle} height={headerHeight}>
              <AppHeaderAction
                icon={iconMap.magnify}
                onPress={() => console.log('pressed')}
              />
              <AppHeaderAction
                icon={iconMap.notification}
                onPress={() => console.log('pressed')}
              />
            </AppHeader>
          ),
        }}>
        {props => (
          <Animated.ScrollView
            scrollEventThrottle={16}
            onScroll={feedAnimatedScrollHandler}>
            <Feed navigation={props.navigation} route={props.route as any} />
          </Animated.ScrollView>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Statistics"
        listeners={{
          tabPress: () => {
            activeTab = 1;
          },
        }}
        options={{
          tabBarLabel: t('home:statistics'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name={iconMap.statistics}
              color={color}
              size={size}
            />
          ),
          tabBarButton: props => (
            <TouchableRipple
              {...props}
              disabled={props.disabled as boolean | undefined}
            />
          ),
        }}
        component={Statistics}
      />
      <Tab.Screen
        name="Discover"
        listeners={{
          tabPress: () => {
            activeTab = 2;
          },
        }}
        options={{
          tabBarLabel: t('home:apps'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name={iconMap.discover}
              color={color}
              size={size}
            />
          ),
          tabBarButton: props => (
            <TouchableRipple
              {...props}
              disabled={props.disabled as boolean | undefined}
            />
          ),
        }}
        component={Discover}
      />
      <Tab.Screen
        name="MyProfile"
        listeners={{
          tabPress: () => {
            activeTab = 3;
          },
        }}
        options={{
          tabBarLabel: t('home:profile'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name={iconMap.accountCircle}
              color={color}
              size={size}
            />
          ),
          tabBarButton: props => (
            <TouchableRipple
              {...props}
              disabled={props.disabled as boolean | undefined}
            />
          ),
        }}
        component={MyProfile}
      />
    </Tab.Navigator>
  );
}
