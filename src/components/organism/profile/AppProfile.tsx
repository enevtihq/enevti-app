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
import { Persona } from '../../../types/service/enevti/persona';
import { Profile } from '../../../types/service/enevti/profile';
import AppProfileHeader, {
  PROFILE_HEADER_HEIGHT_PERCENTAGE,
} from './AppProfileHeader';
import { hp, SafeAreaInsets, wp } from '../../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation';
import { diffClamp } from '../../../utils/animation';
import OwnedNFTComponent from './tabs/OwnedNFTComponent';
import OnSaleNFTComponent from './tabs/OnSaleNFTComponent';
import AppProfileBody from './AppProfileBody';
import { useTheme } from 'react-native-paper';
import AppActivityIndicator from '../../atoms/loading/AppActivityIndicator';

const noDisplay = 'none';
const visible = 1;
const notVisible = 0;

interface AppProfileProps {
  navigation: StackNavigationProp<RootStackParamList>;
  persona: Persona;
  profile: Profile;
  onScrollWorklet?: (val: number) => void;
  onBeginDragWorklet?: (val: number) => void;
  onEndDragWorklet?: (val: number) => void;
  onMomentumEndWorklet?: (val: number) => void;
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
  const styles = makeStyle(headerHeight, insets);

  const [ownedMounted, setOwnedMounted] = React.useState<boolean>(false);
  const [onSaleMounted, setOnSaleMounted] = React.useState<boolean>(false);

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
        persona={persona}
        onScroll={ownedScrollHandler}
        scrollEnabled={ownedMounted && onSaleMounted ? true : false}
        headerHeight={headerHeight}
        data={profile ? profile.owned : []}
        onMounted={() => setOwnedMounted(true)}
      />
    ),
    [
      ownedRef,
      headerHeight,
      profile,
      ownedScrollHandler,
      ownedMounted,
      onSaleMounted,
      persona,
    ],
  );

  const OnSaleNFTScreen = React.useCallback(
    () => (
      <OnSaleNFTComponent
        ref={onSaleRef}
        persona={persona}
        onScroll={onSaleScrollHandler}
        scrollEnabled={ownedMounted && onSaleMounted ? true : false}
        headerHeight={headerHeight}
        data={profile ? profile.onsale : []}
        onMounted={() => setOnSaleMounted(true)}
      />
    ),
    [
      onSaleRef,
      headerHeight,
      profile,
      onSaleScrollHandler,
      ownedMounted,
      onSaleMounted,
      persona,
    ],
  );

  return persona && profile ? (
    <View>
      <Animated.View style={[styles.profileHeader, scrollStyle]}>
        <AppProfileHeader
          persona={persona}
          profile={profile}
          navigation={navigation}
        />
      </Animated.View>
      <AppProfileBody
        headerHeight={headerHeight}
        animatedTabBarStyle={animatedTabBarStyle}
        ownedNFTScreen={OwnedNFTScreen}
        onSaleNFTScreen={OnSaleNFTScreen}
        style={{
          opacity: ownedMounted && onSaleMounted ? visible : notVisible,
        }}
      />
      {ownedMounted && onSaleMounted ? null : (
        <AppActivityIndicator
          animating={true}
          style={[
            styles.mountedIndicator,
            { display: ownedMounted && onSaleMounted ? noDisplay : undefined },
          ]}
          color={theme.colors.primary}
        />
      )}
    </View>
  ) : (
    <View style={styles.loaderContainer}>
      <AppActivityIndicator animating />
    </View>
  );
}

const makeStyle = (headerHeight: number, insets: SafeAreaInsets) =>
  StyleSheet.create({
    profileHeader: {
      position: 'absolute',
      zIndex: 1,
      paddingTop: headerHeight,
    },
    mountedIndicator: {
      position: 'absolute',
      top: hp('60%', insets),
      left: wp('48%', insets),
    },
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });