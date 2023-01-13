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
import { hp, wp } from 'enevti-app/utils/layout/imageRatio';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { diffClamp } from 'enevti-app/utils/layout/animation';
import OwnedNFTComponent from './tabs/OwnedNFTComponent';
import OnSaleNFTComponent from './tabs/OnSaleNFTComponent';
import AppProfileBody from './AppProfileBody';
import { useTheme } from 'react-native-paper';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import { useDispatch, useSelector } from 'react-redux';
import { loadProfile, unloadProfile } from 'enevti-app/store/middleware/thunk/ui/view/profile';
import CollectionListComponent from './tabs/CollectionListComponent';
import { AppAsyncThunk } from 'enevti-app/types/ui/store/AppAsyncThunk';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
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
import { Socket } from 'socket.io-client';
import { routeParamToAddress } from 'enevti-app/service/enevti/persona';
import { reduceBalanceChanged } from 'enevti-app/store/middleware/thunk/socket/profile/balanceChanged';
import { reduceNewCollection } from 'enevti-app/store/middleware/thunk/socket/profile/newCollection';
import { reduceNewOwned } from 'enevti-app/store/middleware/thunk/socket/profile/newOwned';
import { reduceNewPending } from 'enevti-app/store/middleware/thunk/socket/profile/newPending';
import { reduceNewProfileUpdates } from 'enevti-app/store/middleware/thunk/socket/profile/newProfileUpdates';
import { reduceNewUsername } from 'enevti-app/store/middleware/thunk/socket/profile/newUsername';
import { reduceTotalNFTSoldChanged } from 'enevti-app/store/middleware/thunk/socket/profile/totalNFTSoldChanged';
import { reduceTotalServeRateChanged } from 'enevti-app/store/middleware/thunk/socket/profile/totalServeRateChanged';
import { reduceTotalStakeChanged } from 'enevti-app/store/middleware/thunk/socket/profile/totalStakeChanged';
import { appSocket } from 'enevti-app/utils/app/network';
import { reduceTotalMomentSlotChanged } from 'enevti-app/store/middleware/thunk/socket/profile/totalMomentSlotChanged';
import MomentCreatedListComponent from './tabs/MomentCreatedListComponent';

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
  withFooterSpace?: boolean;
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
  withFooterSpace = false,
}: AppProfileProps) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const newUpdateRef = React.useRef<boolean>(false);
  const headerCollapsedRef = React.useRef<boolean>(false);
  const socket = React.useRef<Socket | undefined>();

  const profile = useSelector((state: RootState) =>
    isMyProfile ? selectMyProfileView(state) : selectProfileView(state, route.key),
  );
  const profileUndefined = useSelector((state: RootState) =>
    isMyProfile ? isMyProfileUndefined(state) : isProfileUndefined(state, route.key),
  );
  const newUpdate = useSelector((state: RootState) =>
    isMyProfile ? isThereAnyNewMyProfileUpdates(state) : isThereAnyNewProfileUpdate(state, route.key),
  );

  const persona = profile.persona;
  const styles = React.useMemo(() => makeStyles(headerHeight), [headerHeight]);

  const [ownedMounted, setOwnedMounted] = React.useState<boolean>(false);
  const [onSaleMounted, setOnSaleMounted] = React.useState<boolean>(false);
  const [momentMounted, setMomentMounted] = React.useState<boolean>(false);
  const [collectionMounted, setCollectionMouted] = React.useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, afterRefresh] = React.useState<boolean>(false);

  const ownedRef = useAnimatedRef<FlatList>();
  const onSaleRef = useAnimatedRef<FlatList>();
  const momentRef = useAnimatedRef<FlatList>();
  const collectionRef = useAnimatedRef<FlatList>();

  const animatedFocus = useSharedValue(true);
  const headerCollapsed = useSharedValue(true);
  const rawScrollY = useSharedValue(0);
  const tabScroll = useSharedValue(0);

  const totalHeaderHeight = React.useMemo(() => hp(PROFILE_HEADER_HEIGHT_PERCENTAGE) + headerHeight, [headerHeight]);
  const varHeaderHeight = React.useMemo(
    () => (disableHeaderAnimation ? headerHeight : 0),
    [disableHeaderAnimation, headerHeight],
  );

  const onUpdateClose = React.useCallback(() => {
    if (isMyProfile) {
      dispatch(setMyProfileViewVersion(Date.now()));
    } else {
      dispatch(setProfileViewVersion({ key: route.key, value: Date.now() }));
    }
  }, [dispatch, route.key, isMyProfile]);

  const onProfileScreenLoaded = React.useCallback(
    (reload: boolean = false) => {
      return dispatch(loadProfile({ route, isMyProfile, reload }));
    },
    [dispatch, route, isMyProfile],
  ) as AppAsyncThunk;

  React.useEffect(() => {
    const promise = onProfileScreenLoaded();
    return function cleanup() {
      dispatch(unloadProfile(route, isMyProfile));
      promise.abort();
    };
  }, [onProfileScreenLoaded, dispatch, route, isMyProfile]);

  React.useEffect(() => {
    const unsubscribeBlur = navigation?.addListener('blur', () => {
      animatedFocus.value = false;
    });
    const unsubscribeFocus = navigation?.addListener('focus', () => {
      animatedFocus.value = true;
    });
    return () => {
      unsubscribeBlur && unsubscribeBlur();
      unsubscribeFocus && unsubscribeFocus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const run = async () => {
      if (!isMyProfile && profile.persona && profile.persona.address) {
        const key = route.key;
        const address = await routeParamToAddress(route.params);
        socket.current = appSocket(address);
        socket.current.on('usernameChanged', (payload: any) => dispatch(reduceNewUsername(payload, key)));
        socket.current.on('balanceChanged', (payload: any) => dispatch(reduceBalanceChanged(payload, key)));
        socket.current.on('totalStakeChanged', (payload: any) => dispatch(reduceTotalStakeChanged(payload, key)));
        socket.current.on('totalNFTSoldChanged', (payload: any) => dispatch(reduceTotalNFTSoldChanged(payload, key)));
        socket.current.on('totalMomentSlotChanged', (payload: any) =>
          dispatch(reduceTotalMomentSlotChanged(payload, key)),
        );
        socket.current.on('totalServeRateChanged', (payload: any) =>
          dispatch(reduceTotalServeRateChanged(payload, key)),
        );
        socket.current.on('newProfileUpdates', (payload: any) => dispatch(reduceNewProfileUpdates(payload, key)));
        socket.current.on('newPending', (payload: any) => dispatch(reduceNewPending(payload, key)));
        socket.current.on('newOwned', (payload: any) => dispatch(reduceNewOwned(payload, key)));
        socket.current.on('newCollection', (payload: any) => dispatch(reduceNewCollection(payload, key)));
      }
    };

    run();
    return function cleanup() {
      socket.current?.disconnect();
    };
  }, [profile.persona, dispatch, route.params, route.key, isMyProfile]);

  const useCustomAnimatedScrollHandler = (scrollRefList: React.RefObject<any>[]) =>
    useAnimatedScrollHandler({
      onScroll: (event, ctx: { prevY: number; current: number }) => {
        rawScrollY.value = event.contentOffset.y;

        if (event.contentOffset.y < totalHeaderHeight - varHeaderHeight) {
          if (!headerCollapsed.value) {
            headerCollapsed.value = true;
            if (animatedFocus.value) {
              for (let i = 0; i < scrollRefList.length; i++) {
                scrollTo(scrollRefList[i], 0, totalHeaderHeight - varHeaderHeight, false);
              }
            }
          }
        } else {
          if (headerCollapsed.value) {
            headerCollapsed.value = false;
            if (animatedFocus.value) {
              for (let i = 0; i < scrollRefList.length; i++) {
                scrollTo(scrollRefList[i], 0, totalHeaderHeight - varHeaderHeight, false);
              }
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
          if (animatedFocus.value) {
            for (let i = 0; i < scrollRefList.length; i++) {
              scrollTo(scrollRefList[i], 0, event.contentOffset.y, false);
            }
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
          if (animatedFocus.value) {
            for (let i = 0; i < scrollRefList.length; i++) {
              scrollTo(scrollRefList[i], 0, event.contentOffset.y, false);
            }
          }
        }
        !disableHeaderAnimation && onMomentumEndWorklet && onMomentumEndWorklet(event.contentOffset.y);
      },
    });

  const ownedScrollHandler = useCustomAnimatedScrollHandler([onSaleRef, collectionRef, momentRef]);
  const onSaleScrollHandler = useCustomAnimatedScrollHandler([ownedRef, collectionRef, momentRef]);
  const momentScrollHandler = useCustomAnimatedScrollHandler([ownedRef, onSaleRef, collectionRef]);
  const collectionScrollHandler = useCustomAnimatedScrollHandler([ownedRef, onSaleRef, momentRef]);

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
    () => (ownedMounted && onSaleMounted && collectionMounted && momentMounted ? true : false),
    [ownedMounted, onSaleMounted, collectionMounted, momentMounted],
  );

  const onRefresh = React.useCallback(async () => {
    afterRefresh(false); // ios after refresh fix
    ownedRef.current?.scrollToOffset({ offset: 0 });
    onSaleRef.current?.scrollToOffset({ offset: 0 });
    momentRef.current?.scrollToOffset({ offset: 0 });
    collectionRef.current?.scrollToOffset({ offset: 0 });
    onBeginDragWorklet && onBeginDragWorklet(0);
    onScrollWorklet && onScrollWorklet(0);
    onEndDragWorklet && onEndDragWorklet(0);
    onMomentumEndWorklet && onMomentumEndWorklet(0);
    await onProfileScreenLoaded(true).unwrap();
    afterRefresh(true); // ios after refresh fix
  }, [
    onProfileScreenLoaded,
    ownedRef,
    onSaleRef,
    momentRef,
    collectionRef,
    onScrollWorklet,
    onBeginDragWorklet,
    onEndDragWorklet,
    onMomentumEndWorklet,
  ]);

  useFocusEffect(
    React.useCallback(() => {
      if (newUpdateRef.current && headerCollapsedRef.current) {
        onProfileScreenLoaded(true);
      }
    }, [onProfileScreenLoaded]),
  );

  React.useEffect(() => {
    headerCollapsedRef.current = headerCollapsed.value;
  }, [headerCollapsed.value]);

  React.useEffect(() => {
    newUpdateRef.current = newUpdate;
  }, [newUpdate]);

  const onSaleData = React.useMemo(() => (!profileUndefined ? profile.onSale : []), [profile, profileUndefined]);

  const ownedOnMounted = React.useCallback(() => setOwnedMounted(true), []);
  const onSaleOnMounted = React.useCallback(() => setOnSaleMounted(true), []);
  const momentOnMounted = React.useCallback(() => setMomentMounted(true), []);
  const collectionOnMounted = React.useCallback(() => setCollectionMouted(true), []);

  const OwnedNFTScreen = React.useCallback(
    () => (
      <OwnedNFTComponent
        ref={ownedRef}
        navigation={navigation}
        route={route}
        onScroll={ownedScrollHandler}
        onMomentumScroll={onUpdateClose}
        scrollEnabled={scrollEnabled}
        headerHeight={headerHeight}
        onMounted={ownedOnMounted}
        onRefresh={onRefresh}
        disableHeaderAnimation={disableHeaderAnimation}
        isMyProfile={isMyProfile}
        withFooterSpace={withFooterSpace}
      />
    ),
    [
      ownedRef,
      navigation,
      headerHeight,
      ownedScrollHandler,
      onUpdateClose,
      scrollEnabled,
      ownedOnMounted,
      onRefresh,
      disableHeaderAnimation,
      route,
      isMyProfile,
      withFooterSpace,
    ],
  );

  const OnSaleNFTScreen = React.useCallback(
    () => (
      <OnSaleNFTComponent
        ref={onSaleRef}
        navigation={navigation}
        onScroll={onSaleScrollHandler}
        onMomentumScroll={onUpdateClose}
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
      onUpdateClose,
      onSaleScrollHandler,
      scrollEnabled,
      onSaleOnMounted,
      onRefresh,
      disableHeaderAnimation,
    ],
  );

  const MomentScreen = React.useCallback(
    () => (
      <MomentCreatedListComponent
        ref={momentRef}
        navigation={navigation}
        route={route}
        onScroll={momentScrollHandler}
        onMomentumScroll={onUpdateClose}
        scrollEnabled={scrollEnabled}
        headerHeight={headerHeight}
        onMounted={momentOnMounted}
        onRefresh={onRefresh}
        disableHeaderAnimation={disableHeaderAnimation}
        isMyProfile={isMyProfile}
        withFooterSpace={withFooterSpace}
      />
    ),
    [
      momentRef,
      navigation,
      route,
      momentScrollHandler,
      onUpdateClose,
      scrollEnabled,
      headerHeight,
      momentOnMounted,
      onRefresh,
      disableHeaderAnimation,
      isMyProfile,
      withFooterSpace,
    ],
  );

  const CollectionScreen = React.useCallback(
    () => (
      <CollectionListComponent
        ref={collectionRef}
        navigation={navigation}
        route={route}
        onScroll={collectionScrollHandler}
        onMomentumScroll={onUpdateClose}
        scrollEnabled={scrollEnabled}
        headerHeight={headerHeight}
        onMounted={collectionOnMounted}
        onRefresh={onRefresh}
        disableHeaderAnimation={disableHeaderAnimation}
        isMyProfile={isMyProfile}
        withFooterSpace={withFooterSpace}
      />
    ),
    [
      collectionRef,
      navigation,
      headerHeight,
      route,
      collectionScrollHandler,
      onUpdateClose,
      scrollEnabled,
      collectionOnMounted,
      onRefresh,
      disableHeaderAnimation,
      isMyProfile,
      withFooterSpace,
    ],
  );

  const progressViewOffset = React.useMemo(() => hp(HEADER_HEIGHT_PERCENTAGE), []);

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
        style={{ top: headerHeight + hp('2%') }}
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
        momentScreen={MomentScreen}
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

const makeStyles = (headerHeight: number) =>
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
      top: hp(PROFILE_HEADER_HEIGHT_PERCENTAGE + 20),
      left: wp('48%'),
    },
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
  });
