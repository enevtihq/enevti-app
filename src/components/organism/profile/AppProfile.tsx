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
import AppProfileHeader, { PROFILE_HEADER_HEIGHT_PERCENTAGE } from './AppProfileHeader';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { diffClamp } from 'enevti-app/utils/animation';
import OwnedNFTComponent from './tabs/OwnedNFTComponent';
import OnSaleNFTComponent from './tabs/OnSaleNFTComponent';
import AppProfileBody from './AppProfileBody';
import { useTheme } from 'react-native-paper';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import { useDispatch, useSelector } from 'react-redux';
import { loadProfile, unloadProfile } from 'enevti-app/store/middleware/thunk/ui/view/profile';
import CollectionListComponent from './tabs/CollectionListComponent';
import { AppAsyncThunk } from 'enevti-app/types/ui/store/AppAsyncThunk';
import { RouteProp } from '@react-navigation/native';
import AppResponseView from '../view/AppResponseView';
import { HEADER_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppHeader';
import AppFloatingNotifButton from 'enevti-app/components/molecules/button/AppFloatingNotifButton';
import { useTranslation } from 'react-i18next';
import { RootState } from 'enevti-app/store/state';
import {
  selectProfileView,
  isProfileUndefined,
  setProfileViewVersion,
  isThereAnyNewProfileUpdate,
} from 'enevti-app/store/slices/ui/view/profile';
import {
  selectMyProfileView,
  isMyProfileUndefined,
  setMyProfileViewVersion,
  isThereAnyNewMyProfileUpdates,
} from 'enevti-app/store/slices/ui/view/myProfile';

const noDisplay = 'none';
const visible = 1;
const notVisible = 0;

interface AppProfileProps {
  navigation: StackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'Profile'>;
  onScrollWorklet?: (val: number) => void;
  onBeginDragWorklet?: (val: number) => void;
  onEndDragWorklet?: (val: number) => void;
  onMomentumEndWorklet?: (val: number) => void;
  headerHeight?: number;
  disableHeaderAnimation?: boolean;
  isMyProfile?: boolean;
}

export default function AppProfile({
  navigation,
  route,
  onScrollWorklet,
  onBeginDragWorklet,
  onEndDragWorklet,
  onMomentumEndWorklet,
  headerHeight = 0,
  disableHeaderAnimation = false,
  isMyProfile = false,
}: AppProfileProps) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const profile = useSelector((state: RootState) =>
    isMyProfile ? selectMyProfileView(state) : selectProfileView(state, route.params.arg),
  );
  const profileUndefined = useSelector((state: RootState) =>
    isMyProfile ? isMyProfileUndefined(state) : isProfileUndefined(state, route.params.arg),
  );
  const newUpdate = useSelector((state: RootState) =>
    isMyProfile ? isThereAnyNewMyProfileUpdates(state) : isThereAnyNewProfileUpdate(state, route.params.arg),
  );

  const persona = profile.persona;
  const styles = React.useMemo(() => makeStyles(headerHeight, insets), [headerHeight, insets]);

  const [ownedMounted, setOwnedMounted] = React.useState<boolean>(false);
  const [onSaleMounted, setOnSaleMounted] = React.useState<boolean>(false);
  const [collectionMounted, setCollectionMouted] = React.useState<boolean>(false);

  const ownedRef = useAnimatedRef<FlatList>();
  const onSaleRef = useAnimatedRef<FlatList>();
  const collectionRef = useAnimatedRef<FlatList>();

  const headerCollapsed = useSharedValue(true);
  const rawScrollY = useSharedValue(0);
  const tabScroll = useSharedValue(0);

  const totalHeaderHeight = React.useMemo(
    () => hp(PROFILE_HEADER_HEIGHT_PERCENTAGE, insets) + headerHeight,
    [headerHeight, insets],
  );
  const varHeaderHeight = React.useMemo(
    () => (disableHeaderAnimation ? headerHeight : 0),
    [disableHeaderAnimation, headerHeight],
  );

  const onUpdateClose = React.useCallback(() => {
    if (isMyProfile) {
      dispatch(setMyProfileViewVersion(Date.now()));
    } else {
      dispatch(setProfileViewVersion({ key: route.params.arg, value: Date.now() }));
    }
  }, [dispatch, route.params.arg, isMyProfile]);

  const onProfileScreenLoaded = React.useCallback(
    (reload: boolean = false) => {
      return dispatch(loadProfile({ routeParam: route.params, isMyProfile, reload }));
    },
    [dispatch, route.params, isMyProfile],
  ) as AppAsyncThunk;

  React.useEffect(() => {
    const promise = onProfileScreenLoaded();
    return function cleanup() {
      dispatch(unloadProfile(route.params, isMyProfile));
      promise.abort();
    };
  }, [onProfileScreenLoaded, dispatch, route.params, isMyProfile]);

  const useCustomAnimatedScrollHandler = (scrollRefList: React.RefObject<any>[]) =>
    useAnimatedScrollHandler({
      onScroll: (event, ctx: { prevY: number; current: number }) => {
        rawScrollY.value = event.contentOffset.y;

        if (event.contentOffset.y < totalHeaderHeight - varHeaderHeight) {
          if (!headerCollapsed.value) {
            headerCollapsed.value = true;
            for (let i = 0; i < scrollRefList.length; i++) {
              scrollTo(scrollRefList[i], 0, totalHeaderHeight - varHeaderHeight, false);
            }
          }
        } else {
          if (headerCollapsed.value) {
            headerCollapsed.value = false;
            for (let i = 0; i < scrollRefList.length; i++) {
              scrollTo(scrollRefList[i], 0, totalHeaderHeight - varHeaderHeight, false);
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
              tabScroll.value = diffClamp(ctx.current + diff, totalHeaderHeight - headerHeight, totalHeaderHeight);
            }
          } else {
            tabScroll.value = totalHeaderHeight - headerHeight;
          }
        }

        !disableHeaderAnimation && onScrollWorklet && onScrollWorklet(event.contentOffset.y);
      },
      onBeginDrag: (event, ctx) => {
        ctx.prevY = event.contentOffset.y;
        !disableHeaderAnimation && onBeginDragWorklet && onBeginDragWorklet(event.contentOffset.y);
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
        !disableHeaderAnimation && onEndDragWorklet && onEndDragWorklet(event.contentOffset.y);
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
        !disableHeaderAnimation && onMomentumEndWorklet && onMomentumEndWorklet(event.contentOffset.y);
      },
    });

  const ownedScrollHandler = useCustomAnimatedScrollHandler([onSaleRef, collectionRef]);
  const onSaleScrollHandler = useCustomAnimatedScrollHandler([ownedRef, collectionRef]);
  const collectionScrollHandler = useCustomAnimatedScrollHandler([ownedRef, onSaleRef]);

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
    () => (ownedMounted && onSaleMounted && collectionMounted ? true : false),
    [ownedMounted, onSaleMounted, collectionMounted],
  );

  const onRefresh = React.useCallback(() => {
    onProfileScreenLoaded(true);
    ownedRef.current?.scrollToOffset({ offset: 0 });
    onSaleRef.current?.scrollToOffset({ offset: 0 });
    collectionRef.current?.scrollToOffset({ offset: 0 });
    onBeginDragWorklet && onBeginDragWorklet(0);
    onScrollWorklet && onScrollWorklet(0);
    onEndDragWorklet && onEndDragWorklet(0);
    onMomentumEndWorklet && onMomentumEndWorklet(0);
  }, [
    onProfileScreenLoaded,
    ownedRef,
    onSaleRef,
    collectionRef,
    onScrollWorklet,
    onBeginDragWorklet,
    onEndDragWorklet,
    onMomentumEndWorklet,
  ]);

  const onSaleData = React.useMemo(() => (!profileUndefined ? profile.onSale : []), [profile, profileUndefined]);

  const ownedOnMounted = React.useCallback(() => setOwnedMounted(true), []);
  const onSaleOnMounted = React.useCallback(() => setOnSaleMounted(true), []);
  const collectionOnMounted = React.useCallback(() => setCollectionMouted(true), []);

  const OwnedNFTScreen = React.useCallback(
    () => (
      <OwnedNFTComponent
        ref={ownedRef}
        navigation={navigation}
        route={route}
        onScroll={ownedScrollHandler}
        scrollEnabled={scrollEnabled}
        headerHeight={headerHeight}
        onMounted={ownedOnMounted}
        onRefresh={onRefresh}
        disableHeaderAnimation={disableHeaderAnimation}
        isMyProfile={isMyProfile}
      />
    ),
    [
      ownedRef,
      navigation,
      headerHeight,
      ownedScrollHandler,
      scrollEnabled,
      ownedOnMounted,
      onRefresh,
      disableHeaderAnimation,
      route,
      isMyProfile,
    ],
  );

  const OnSaleNFTScreen = React.useCallback(
    () => (
      <OnSaleNFTComponent
        ref={onSaleRef}
        navigation={navigation}
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
      navigation,
      headerHeight,
      onSaleData,
      onSaleScrollHandler,
      scrollEnabled,
      onSaleOnMounted,
      onRefresh,
      disableHeaderAnimation,
    ],
  );

  const CollectionScreen = React.useCallback(
    () => (
      <CollectionListComponent
        ref={collectionRef}
        navigation={navigation}
        route={route}
        onScroll={collectionScrollHandler}
        scrollEnabled={scrollEnabled}
        headerHeight={headerHeight}
        onMounted={collectionOnMounted}
        onRefresh={onRefresh}
        disableHeaderAnimation={disableHeaderAnimation}
        isMyProfile={isMyProfile}
      />
    ),
    [
      collectionRef,
      navigation,
      headerHeight,
      route,
      collectionScrollHandler,
      scrollEnabled,
      collectionOnMounted,
      onRefresh,
      disableHeaderAnimation,
      isMyProfile,
    ],
  );

  const progressViewOffset = React.useMemo(() => hp(HEADER_HEIGHT_PERCENTAGE, insets), [insets]);

  return !profileUndefined ? (
    <AppResponseView
      onReload={onRefresh}
      progressViewOffset={progressViewOffset}
      status={profile.reqStatus}
      style={styles.profileContainer}>
      <Animated.View pointerEvents={'box-none'} style={[styles.profileHeader, scrollStyle]}>
        <AppProfileHeader persona={persona} profile={profile} navigation={navigation} />
      </Animated.View>
      <AppFloatingNotifButton
        show={newUpdate}
        label={t('profile:newUpdates')}
        onPress={onRefresh}
        style={{ top: headerHeight + hp('2%', insets) }}
        onClose={onUpdateClose}
      />
      <AppProfileBody
        route={route}
        isMyProfile={isMyProfile}
        headerHeight={headerHeight}
        animatedTabBarStyle={animatedTabBarStyle}
        ownedNFTScreen={OwnedNFTScreen}
        onSaleNFTScreen={OnSaleNFTScreen}
        collectionScreen={CollectionScreen}
        style={{
          opacity: ownedMounted && onSaleMounted ? visible : notVisible,
        }}
      />
      {ownedMounted && onSaleMounted ? null : (
        <AppActivityIndicator
          animating={true}
          style={[styles.mountedIndicator, { display: ownedMounted && onSaleMounted ? noDisplay : undefined }]}
          color={theme.colors.primary}
        />
      )}
    </AppResponseView>
  ) : (
    <View style={styles.loaderContainer}>
      <AppActivityIndicator animating />
    </View>
  );
}

const makeStyles = (headerHeight: number, insets: SafeAreaInsets) =>
  StyleSheet.create({
    profileContainer: {
      flex: 1,
    },
    profileHeader: {
      position: 'absolute',
      zIndex: 2,
      paddingTop: headerHeight,
    },
    mountedIndicator: {
      position: 'absolute',
      top: hp(PROFILE_HEADER_HEIGHT_PERCENTAGE + 20, insets),
      left: wp('48%', insets),
    },
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
  });
