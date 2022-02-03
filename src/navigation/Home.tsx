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
import { diffClamp } from '../utils/animation';
import AppTabBar from '../components/atoms/view/AppTabBar';

const Tab = createBottomTabNavigator();

export default function Home() {
  let activeTab = 0;
  const tabScrollY = [
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
  ];

  const feedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        tabScrollY[0].value,
        [0, 100],
        [1, 0],
        Extrapolate.CLAMP,
      ),
      transform: [
        {
          translateY: interpolate(
            tabScrollY[0].value,
            [0, 100],
            [0, -100],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  });
  const feedAnimatedScrollHandler = useAnimatedScrollHandler({
    onScroll: (event, ctx: { prevY: number }) => {
      const diff = event.contentOffset.y - ctx.prevY;
      tabScrollY[0].value = diffClamp(tabScrollY[0].value + diff, 0, 100);
    },
    onBeginDrag: (event, ctx) => {
      ctx.prevY = event.contentOffset.y;
    },
    onEndDrag: event => {
      if (tabScrollY[0].value < 100 / 2 || event.contentOffset.y < 100) {
        tabScrollY[0].value = withSpring(0);
      } else {
        tabScrollY[0].value = withSpring(100);
      }
    },
  });

  const tabBarStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        tabScrollY[activeTab].value,
        [0, 100],
        [1, 0],
        Extrapolate.CLAMP,
      ),
      transform: [
        {
          translateY: interpolate(
            tabScrollY[activeTab].value,
            [0, 100],
            [0, 100],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <Tab.Navigator
      tabBar={props => <AppTabBar {...props} style={tabBarStyle} />}
      screenOptions={{ tabBarStyle: { position: 'absolute' } }}>
      <Tab.Screen
        name="Feed"
        listeners={{
          tabPress: () => {
            activeTab = 0;
          },
        }}
        options={{
          header: () => <AppHeader style={feedStyle} />,
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
        component={Statistics}
      />
      <Tab.Screen
        name="Discover"
        listeners={{
          tabPress: () => {
            activeTab = 2;
          },
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
        component={MyProfile}
      />
    </Tab.Navigator>
  );
}
