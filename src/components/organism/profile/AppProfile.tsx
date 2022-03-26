import { FlatList, StyleSheet, View } from 'react-native';
import React from 'react';
import Animated, {
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
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
import { useDispatch } from 'react-redux';
import {
  loadProfile,
  unloadProfile,
} from '../../../store/middleware/thunk/ui/view/profile';
import { Profile } from '../../../types/service/enevti/profile';
import { Persona } from '../../../types/service/enevti/persona';

const noDisplay = 'none';
const visible = 1;
const notVisible = 0;

interface AppProfileProps {
  navigation: StackNavigationProp<RootStackParamList>;
  address: string;
  profile: Profile & { persona: Persona };
  profileUndefined: boolean;
  onScrollWorklet?: (val: number) => void;
  onBeginDragWorklet?: (val: number) => void;
  onEndDragWorklet?: (val: number) => void;
  onMomentumEndWorklet?: (val: number) => void;
  headerHeight?: number;
  disableHeaderAnimation?: boolean;
}

export default function AppProfile({
  navigation,
  address,
  profile,
  profileUndefined,
  onScrollWorklet,
  onBeginDragWorklet,
  onEndDragWorklet,
  onMomentumEndWorklet,
  headerHeight = 0,
  disableHeaderAnimation = false,
}: AppProfileProps) {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const persona = profile.persona;
  const styles = React.useMemo(
    () => makeStyles(headerHeight, insets),
    [headerHeight, insets],
  );

  const [ownedMounted, setOwnedMounted] = React.useState<boolean>(false);
  const [onSaleMounted, setOnSaleMounted] = React.useState<boolean>(false);

  const ownedRef = useAnimatedRef<FlatList>();
  const onSaleRef = useAnimatedRef<any>();

  const headerCollapsed = useSharedValue(true);
  const rawScrollY = useSharedValue(0);
  const tabScroll = useSharedValue(0);

  const totalHeaderHeight =
    hp(PROFILE_HEADER_HEIGHT_PERCENTAGE, insets) + headerHeight;

  const onProfileScreenLoaded = React.useCallback(
    (reload: boolean = false) => dispatch(loadProfile(address, reload)),
    [address, dispatch],
  );

  React.useEffect(() => {
    dispatch(unloadProfile(address));
    onProfileScreenLoaded();
  }, [onProfileScreenLoaded, dispatch, address]);

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
          if (!disableHeaderAnimation) {
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
          } else {
            tabScroll.value = totalHeaderHeight - headerHeight;
          }
        }

        !disableHeaderAnimation &&
          onScrollWorklet &&
          onScrollWorklet(event.contentOffset.y);
      },
      onBeginDrag: (event, ctx) => {
        ctx.prevY = event.contentOffset.y;
        !disableHeaderAnimation &&
          onBeginDragWorklet &&
          onBeginDragWorklet(event.contentOffset.y);
      },
      onEndDrag: (event, ctx) => {
        if (event.contentOffset.y > totalHeaderHeight) {
          if (tabScroll.value < totalHeaderHeight - headerHeight / 2) {
            if (!disableHeaderAnimation) {
              tabScroll.value = withTiming(totalHeaderHeight - headerHeight, {
                duration: 200,
              });
            }
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
        !disableHeaderAnimation &&
          onEndDragWorklet &&
          onEndDragWorklet(event.contentOffset.y);
      },
      onMomentumEnd: (event, ctx) => {
        if (event.contentOffset.y > totalHeaderHeight) {
          if (tabScroll.value < totalHeaderHeight - headerHeight / 2) {
            if (!disableHeaderAnimation) {
              tabScroll.value = withTiming(totalHeaderHeight - headerHeight, {
                duration: 200,
              });
            }
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
        !disableHeaderAnimation &&
          onMomentumEndWorklet &&
          onMomentumEndWorklet(event.contentOffset.y);
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

  const scrollEnabled = React.useMemo(
    () => (ownedMounted && onSaleMounted ? true : false),
    [ownedMounted, onSaleMounted],
  );

  const onRefresh = React.useCallback(() => {
    onProfileScreenLoaded(true);
    ownedRef.current?.scrollToOffset({ offset: 1 });
    onSaleRef.current?.scrollToOffset({ offset: 1 });
    onBeginDragWorklet && onBeginDragWorklet(0);
    onScrollWorklet && onScrollWorklet(0);
    onEndDragWorklet && onEndDragWorklet(0);
    onMomentumEndWorklet && onMomentumEndWorklet(0);
  }, [
    onProfileScreenLoaded,
    ownedRef,
    onSaleRef,
    onScrollWorklet,
    onBeginDragWorklet,
    onEndDragWorklet,
    onMomentumEndWorklet,
  ]);

  const ownedData = React.useMemo(
    () => (!profileUndefined ? profile.owned : []),
    [profile, profileUndefined],
  );

  const ownedOnMounted = React.useCallback(() => setOwnedMounted(true), []);

  const onSaleData = React.useMemo(
    () => (!profileUndefined ? profile.onsale : []),
    [profile, profileUndefined],
  );

  const onSaleOnMounted = React.useCallback(() => setOnSaleMounted(true), []);

  const OwnedNFTScreen = React.useCallback(
    () => (
      <OwnedNFTComponent
        ref={ownedRef}
        onScroll={ownedScrollHandler}
        scrollEnabled={scrollEnabled}
        headerHeight={headerHeight}
        data={ownedData}
        onMounted={ownedOnMounted}
        onRefresh={onRefresh}
        disableHeaderAnimation={disableHeaderAnimation}
      />
    ),
    [
      ownedRef,
      headerHeight,
      ownedData,
      ownedScrollHandler,
      scrollEnabled,
      ownedOnMounted,
      onRefresh,
      disableHeaderAnimation,
    ],
  );

  const OnSaleNFTScreen = React.useCallback(
    () => (
      <OnSaleNFTComponent
        ref={onSaleRef}
        onScroll={onSaleScrollHandler}
        scrollEnabled={scrollEnabled}
        headerHeight={headerHeight}
        data={onSaleData}
        onMounted={onSaleOnMounted}
        onRefresh={onRefresh}
        disableHeaderAnimation={disableHeaderAnimation}
      />
    ),
    [
      onSaleRef,
      headerHeight,
      onSaleData,
      onSaleScrollHandler,
      scrollEnabled,
      onSaleOnMounted,
      onRefresh,
      disableHeaderAnimation,
    ],
  );

  return !profileUndefined ? (
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

const makeStyles = (headerHeight: number, insets: SafeAreaInsets) =>
  StyleSheet.create({
    profileHeader: {
      position: 'absolute',
      zIndex: 2,
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
      width: '100%',
      height: '100%',
    },
  });
