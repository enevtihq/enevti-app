import { StyleSheet, View } from 'react-native';
import React from 'react';
import Animated, {
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { PersonaBase } from '../../../types/service/enevti/persona';
import { ProfileResponse } from '../../../types/service/enevti/profile';
import AppProfileHeader, {
  PROFILE_HEADER_HEIGHT_PERCENTAGE,
} from './AppProfileHeader';
import { hp } from '../../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation';
import { diffClamp } from '../../../utils/animation';
import OwnedNFTComponent from './tabs/OwnedNFTComponent';
import OnSaleNFTComponent from './tabs/OnSaleNFTComponent';
import AppProfileBody from './AppProfileBody';

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
  const styles = makeStyle(headerHeight);

  const ownedRef = useAnimatedRef<any>();
  const onSaleRef = useAnimatedRef<any>();

  const headerCollapsed = useSharedValue(true);
  const rawScrollY = useSharedValue(0);
  const tabScroll = useSharedValue(0);

  const totalHeaderHeight =
    hp(PROFILE_HEADER_HEIGHT_PERCENTAGE, insets) + headerHeight;

  const useCustomAnimatedScrollHandler = (
    scrollRefList: React.RefObject<any>[],
  ) =>
    useAnimatedScrollHandler({
      onScroll: (event, ctx: { prevY: number; current: number }) => {
        rawScrollY.value = event.contentOffset.y;

        if (event.contentOffset.y < totalHeaderHeight) {
          if (!headerCollapsed.value) {
            headerCollapsed.value = true;
            for (let i = 0; i < scrollRefList.length; i++) {
              scrollTo(scrollRefList[i], 0, totalHeaderHeight, false);
            }
          }
        } else {
          if (headerCollapsed.value) {
            headerCollapsed.value = false;
            for (let i = 0; i < scrollRefList.length; i++) {
              scrollTo(scrollRefList[i], 0, totalHeaderHeight, false);
            }
          }
        }

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
            tabScroll.value = withTiming(totalHeaderHeight, {
              duration: 200,
            });
            ctx.current = totalHeaderHeight;
          }
        } else {
          for (let i = 0; i < scrollRefList.length; i++) {
            scrollTo(scrollRefList[i], 0, event.contentOffset.y, false);
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
            tabScroll.value = withTiming(totalHeaderHeight, {
              duration: 200,
            });
            ctx.current = totalHeaderHeight;
          }
        } else {
          for (let i = 0; i < scrollRefList.length; i++) {
            scrollTo(scrollRefList[i], 0, event.contentOffset.y, false);
          }
        }
        onMomentumEndWorklet && onMomentumEndWorklet(event.contentOffset.y);
      },
    });

  const ownedScrollHandler = useCustomAnimatedScrollHandler([onSaleRef]);
  const onSaleScrollHandler = useCustomAnimatedScrollHandler([ownedRef]);

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

  const OwnedNFTScreen = React.useCallback(
    () => (
      <OwnedNFTComponent
        ref={ownedRef}
        onScroll={ownedScrollHandler}
        headerHeight={headerHeight}
        data={profile ? profile.owned : []}
      />
    ),
    [ownedRef, headerHeight, profile, ownedScrollHandler],
  );

  const OnSaleNFTScreen = React.useCallback(
    () => (
      <OnSaleNFTComponent
        ref={onSaleRef}
        onScroll={onSaleScrollHandler}
        headerHeight={headerHeight}
        data={profile ? profile.owned : []}
      />
    ),
    [onSaleRef, headerHeight, profile, onSaleScrollHandler],
  );

  return (
    <View>
      <Animated.View style={[styles.profileHeader, scrollStyle]}>
        <AppProfileHeader persona={persona} navigation={navigation} />
      </Animated.View>
      <AppProfileBody
        headerHeight={headerHeight}
        animatedTabBarStyle={animatedTabBarStyle}
        ownedNFTScreen={OwnedNFTScreen}
        onSaleNFTScreen={OnSaleNFTScreen}
      />
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
  });
