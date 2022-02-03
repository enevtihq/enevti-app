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

const Tab = createBottomTabNavigator();

export default function Home() {
  const feedScrollY = useSharedValue(0);
  const feedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        feedScrollY.value,
        [0, 100],
        [1, 0],
        Extrapolate.CLAMP,
      ),
      transform: [
        {
          translateY: interpolate(
            feedScrollY.value,
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
      feedScrollY.value = diffClamp(feedScrollY.value + diff, 0, 100);
    },
    onBeginDrag: (event, ctx) => {
      ctx.prevY = event.contentOffset.y;
    },
    onEndDrag: () => {
      if (feedScrollY.value < 100 / 2) {
        feedScrollY.value = withSpring(0);
      } else {
        feedScrollY.value = withSpring(100);
      }
    },
  });

  return (
    <Tab.Navigator screenOptions={{ tabBarStyle: { position: 'absolute' } }}>
      <Tab.Screen
        name="Feed"
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
      <Tab.Screen name="Statistics" component={Statistics} />
      <Tab.Screen name="Discover" component={Discover} />
      <Tab.Screen name="MyProfile" component={MyProfile} />
    </Tab.Navigator>
  );
}
