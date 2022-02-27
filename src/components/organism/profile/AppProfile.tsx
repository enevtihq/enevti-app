import { StyleSheet, View } from 'react-native';
import React from 'react';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { FlatGrid, FlatGridProps } from 'react-native-super-grid';
import { NFTBase } from '../../../types/nft';
import { PersonaBase } from '../../../types/service/enevti/persona';
import { ProfileResponse } from '../../../types/service/enevti/profile';
import AppProfileHeader, {
  PROFILE_HEADER_HEIGHT_PERCENTAGE,
} from './AppProfileHeader';
import { hp, wp } from '../../../utils/imageRatio';
import AppNFTRenderer from '../../molecules/nft/AppNFTRenderer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AppTopTabBar, {
  TOP_TABBAR_HEIGHT_PERCENTAGE,
} from '../../atoms/view/AppTopTabBar';
import AppTextBody4 from '../../atoms/text/AppTextBody4';
import { diffClamp } from '../../../utils/animation';
import { useTheme } from 'react-native-paper';

const AnimatedFlatGrid =
  Animated.createAnimatedComponent<FlatGridProps<NFTBase>>(FlatGrid);

const Tab = createMaterialTopTabNavigator();

interface AppProfileProps {
  navigation: StackNavigationProp<RootStackParamList>;
  persona: PersonaBase;
  onScrollWorklet?: (val: number) => void;
  onBeginDragWorklet?: (val: number) => void;
  onEndDragWorklet?: (val: number) => void;
  onMomentumEndWorklet?: (val: number) => void;
  profile?: ProfileResponse;
  headerHeight?: number;
}

export default function AppProfile({
  navigation,
  persona,
  profile,
  onScrollWorklet,
  onBeginDragWorklet,
  onEndDragWorklet,
  onMomentumEndWorklet,
  headerHeight = 0,
}: AppProfileProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = makeStyle(headerHeight);

  const rawScrollY = useSharedValue(0);
  const tabScroll = useSharedValue(0);
  const totalHeaderHeight =
    hp(PROFILE_HEADER_HEIGHT_PERCENTAGE, insets) + headerHeight;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event, ctx: { prevY: number; current: number }) => {
      rawScrollY.value = event.contentOffset.y;
      if (event.contentOffset.y < totalHeaderHeight - headerHeight) {
        tabScroll.value = event.contentOffset.y;
        ctx.current = totalHeaderHeight;
      } else {
        const diff = event.contentOffset.y - ctx.prevY;
        if (diff > 0 && event.contentOffset.y < totalHeaderHeight) {
          tabScroll.value = event.contentOffset.y;
        } else {
          tabScroll.value = diffClamp(
            ctx.current + diff,
            totalHeaderHeight - headerHeight,
            totalHeaderHeight,
          );
        }
      }
      onScrollWorklet && onScrollWorklet(event.contentOffset.y);
    },
    onBeginDrag: (event, ctx) => {
      ctx.prevY = event.contentOffset.y;
      onBeginDragWorklet && onBeginDragWorklet(event.contentOffset.y);
    },
    onEndDrag: (event, ctx) => {
      if (event.contentOffset.y > totalHeaderHeight) {
        if (tabScroll.value < totalHeaderHeight - headerHeight / 2) {
          tabScroll.value = withTiming(totalHeaderHeight - headerHeight, {
            duration: 200,
          });
          ctx.current = totalHeaderHeight - headerHeight;
        } else {
          tabScroll.value = withTiming(totalHeaderHeight, { duration: 200 });
          ctx.current = totalHeaderHeight;
        }
      }
      onEndDragWorklet && onEndDragWorklet(event.contentOffset.y);
    },
    onMomentumEnd: (event, ctx) => {
      if (event.contentOffset.y > totalHeaderHeight) {
        if (tabScroll.value < totalHeaderHeight - headerHeight / 2) {
          tabScroll.value = withTiming(totalHeaderHeight - headerHeight, {
            duration: 200,
          });
          ctx.current = totalHeaderHeight - headerHeight;
        } else {
          tabScroll.value = withTiming(totalHeaderHeight, { duration: 200 });
          ctx.current = totalHeaderHeight;
        }
      }
      onMomentumEndWorklet && onMomentumEndWorklet(event.contentOffset.y);
    },
  });

  const scrollStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -rawScrollY.value }],
    };
  });

  const animatedTabBarStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -tabScroll.value }],
    };
  });

  const OwnedNFTComponent = React.useCallback(
    () => (
      <AnimatedFlatGrid
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop:
            hp(
              PROFILE_HEADER_HEIGHT_PERCENTAGE + TOP_TABBAR_HEIGHT_PERCENTAGE,
              insets,
            ) + headerHeight,
        }}
        spacing={wp('0.5%', insets)}
        showsVerticalScrollIndicator={false}
        itemDimension={wp('30%', insets)}
        data={profile ? profile.owned : []}
        renderItem={({ item }) => (
          <AppNFTRenderer nft={item} width={wp('30%', insets)} />
        )}
      />
    ),
    [insets, profile, scrollHandler, headerHeight],
  );

  return (
    <View>
      <Animated.View style={[styles.profileHeader, scrollStyle]}>
        <AppProfileHeader persona={persona} navigation={navigation} />
      </Animated.View>
      <View style={{ height: hp('100%', insets) }}>
        <Tab.Navigator
          tabBar={props => (
            <AppTopTabBar
              {...props}
              safeBackgroundBarHeight={headerHeight}
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
            component={OwnedNFTComponent}
          />
          <Tab.Screen
            options={{
              tabBarLabel: ({ color }) => (
                <AppTextBody4 style={{ color: color }}>
                  On Sold (3)
                </AppTextBody4>
              ),
            }}
            name={'On Sold'}
            component={OwnedNFTComponent}
          />
        </Tab.Navigator>
      </View>
    </View>
  );
}

const makeStyle = (headerHeight: number) =>
  StyleSheet.create({
    profileHeader: {
      position: 'absolute',
      zIndex: 1,
      paddingTop: headerHeight,
    },
    tabBarContainer: {
      top: 0,
      left: 0,
      right: 0,
      position: 'absolute',
      zIndex: 1,
    },
  });
