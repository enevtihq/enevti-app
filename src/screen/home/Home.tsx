import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feed from 'enevti-app/screen/home/Feed';
import Statistics from 'enevti-app/screen/home/Statistics';
import Discover from 'enevti-app/screen/home/Discover';
import MyProfile from 'enevti-app/screen/home/MyProfile';
import AppHeader, { HEADER_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppHeader';
import {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  withTiming,
} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { diffClamp } from 'enevti-app/utils/animation';
import AppTabBar from 'enevti-app/components/atoms/view/AppTabBar';
import { hp } from 'enevti-app/utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppHeaderAction from 'enevti-app/components/atoms/view/AppHeaderAction';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { TouchableRipple, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import AppAvatarRenderer from 'enevti-app/components/molecules/avatar/AppAvatarRenderer';
import { useDispatch, useSelector } from 'react-redux';
import { selectMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import { selectMyProfileCache } from 'enevti-app/store/slices/entities/cache/myProfile';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { View } from 'react-native';
import Color from 'color';
import AppIconGradient from 'enevti-app/components/molecules/AppIconGradient';
import { Theme } from 'enevti-app/theme/default';
import { isProfileCanCreateNFT, MINIMUM_BASIC_UNIT_STAKE_ELIGIBILITY } from 'enevti-app/service/enevti/profile';
import { selectOnceEligible, touchOnceEligible } from 'enevti-app/store/slices/entities/once/eligible';

import { getCoinName } from 'enevti-app/utils/constant/identifier';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { clearCreateNFTQueueRoute, selectCreateNFTRouteQueue } from 'enevti-app/store/slices/queue/nft/create/route';
import { clearCreateNFTQueueType, selectCreateNFTTypeQueue } from 'enevti-app/store/slices/queue/nft/create/type';
import { clearCreateNFTOneKindQueue } from 'enevti-app/store/slices/queue/nft/create/onekind';
import { cleanTMPImage } from 'enevti-app/service/enevti/nft';
import { clearCreateNFTPackQueue } from 'enevti-app/store/slices/queue/nft/create/pack';
import AppAlertModal from 'enevti-app/components/organism/menu/AppAlertModal';
import AppConfirmationModal from 'enevti-app/components/organism/menu/AppConfirmationModal';
import { appSocket } from 'enevti-app/utils/network';
import { Socket } from 'socket.io-client';
import { reduceMyNewUsername } from 'enevti-app/store/middleware/thunk/socket/profile/newUsername';
import { reduceMyBalanceChanged } from 'enevti-app/store/middleware/thunk/socket/profile/balanceChanged';
import { reduceMyTotalStakeChanged } from 'enevti-app/store/middleware/thunk/socket/profile/totalStakeChanged';
import { reduceFeedsUpdates } from 'enevti-app/store/middleware/thunk/socket/feeds/feedsUpdates';
import { payDeliverSecret } from 'enevti-app/store/middleware/thunk/payment/creator/payDeliverSecret';
import { syncTransactionNonce } from 'enevti-app/store/middleware/thunk/ui/cache/syncTransactionNonce';
import { reduceMyTotalNFTSoldChanged } from 'enevti-app/store/middleware/thunk/socket/profile/totalNFTSoldChanged';
import { reduceMyNewPending } from 'enevti-app/store/middleware/thunk/socket/profile/newPending';
import { reduceMyNewProfileUpdates } from 'enevti-app/store/middleware/thunk/socket/profile/newProfileUpdates';
import { initProfile } from 'enevti-app/store/middleware/thunk/ui/view/profile';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import { selectOnceWelcome, touchOnceWelcome } from 'enevti-app/store/slices/entities/once/welcome';
import { requestFaucet } from 'enevti-app/service/enevti/dummy';
import { isThereAnyNewMyProfileUpdates } from 'enevti-app/store/slices/ui/view/myProfile';
import { isThereAnyNewFeedView } from 'enevti-app/store/slices/ui/view/feed';

const Tab = createBottomTabNavigator();
const TABBAR_HEIGHT_PERCENTAGE = 8;

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export default function Home({ navigation }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;

  const myPersona = useSelector(selectMyPersonaCache);
  const myProfile = useSelector(selectMyProfileCache);
  const onceEligible = useSelector(selectOnceEligible);
  const createQueue = useSelector(selectCreateNFTRouteQueue);
  const createType = useSelector(selectCreateNFTTypeQueue);
  const canCreateNFT = isProfileCanCreateNFT(myProfile);
  const welcome = useSelector(selectOnceWelcome);
  const newProfileUpdate = useSelector(isThereAnyNewMyProfileUpdates);
  const newFeedUpdate = useSelector(isThereAnyNewFeedView);

  const [uneligibleSheetVisible, setUneligibleSheetVisible] = React.useState<boolean>(false);
  const [restoreMenuVisible, setRestoreMenuVisible] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState<number>(0);
  const headerHeight = hp(HEADER_HEIGHT_PERCENTAGE, insets);
  const tabBarHeight = hp(TABBAR_HEIGHT_PERCENTAGE, insets);
  const tabScrollY = [useSharedValue(0), useSharedValue(0), useSharedValue(0), useSharedValue(0)];

  const myProfilePrevYSharedValue = useSharedValue(0);
  const myProfileInterpolatedYSharedValue = useSharedValue(0);
  const socket = React.useRef<Socket | undefined>();

  React.useEffect(() => {
    dispatch(syncTransactionNonce());
    dispatch(initProfile());
  }, [dispatch]);

  React.useEffect(() => {
    socket.current = appSocket(myPersona.address);
    socket.current.on('usernameChanged', (payload: any) => dispatch(reduceMyNewUsername(payload)));
    socket.current.on('balanceChanged', (payload: any) => dispatch(reduceMyBalanceChanged(payload)));
    socket.current.on('totalStakeChanged', (payload: any) => dispatch(reduceMyTotalStakeChanged(payload)));
    socket.current.on('totalNFTSoldChanged', (payload: any) => dispatch(reduceMyTotalNFTSoldChanged(payload)));
    socket.current.on('newProfileUpdates', (payload: any) => dispatch(reduceMyNewProfileUpdates(payload)));
    socket.current.on('newPending', (payload: any) => dispatch(reduceMyNewPending(payload)));
    socket.current.on('newFeedItem', (payload: any) => dispatch(reduceFeedsUpdates(payload)));
    socket.current.on('deliverSecretNotif', (payload: any) => dispatch(payDeliverSecret(payload)));
    return function cleanup() {
      socket.current?.disconnect();
    };
  }, [myPersona.address, dispatch]);

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
      if (ctx.current === undefined) {
        ctx.current = 0;
      }
      if (event.contentOffset.y === 0) {
        ctx.prevY = 0;
        ctx.current = 0;
        tabScrollY[0].value = 0;
      } else {
        tabScrollY[0].value = diffClamp(ctx.current + diff, 0, headerHeight + insets.top);
      }
    },
    onBeginDrag: (event, ctx) => {
      ctx.prevY = event.contentOffset.y;
    },
    onEndDrag: (event, ctx) => {
      if (tabScrollY[0].value < (headerHeight + insets.top) / 2 || event.contentOffset.y < headerHeight + insets.top) {
        tabScrollY[0].value = withTiming(0, { duration: 200 });
        ctx.current = 0;
      } else {
        tabScrollY[0].value = withTiming(headerHeight + insets.top, {
          duration: 200,
        });
        ctx.current = headerHeight + insets.top;
      }
    },
    onMomentumEnd: (event, ctx) => {
      if (tabScrollY[0].value < (headerHeight + insets.top) / 2 || event.contentOffset.y < headerHeight + insets.top) {
        tabScrollY[0].value = withTiming(0, { duration: 200 });
        ctx.current = 0;
      } else {
        tabScrollY[0].value = withTiming(headerHeight + insets.top, {
          duration: 200,
        });
        ctx.current = headerHeight + insets.top;
      }
    },
  });

  const myProfileStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            tabScrollY[3].value,
            [0, headerHeight + insets.top],
            [0, -(headerHeight + insets.top)],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  });

  const myProfileOnScrollWorklet = React.useCallback((val: number) => {
    'worklet';
    const diff = val - myProfilePrevYSharedValue.value;
    if (val === 0) {
      myProfilePrevYSharedValue.value = 0;
      myProfileInterpolatedYSharedValue.value = 0;
      tabScrollY[3].value = 0;
    } else {
      tabScrollY[3].value = diffClamp(myProfileInterpolatedYSharedValue.value + diff, 0, headerHeight + insets.top);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const myProfileOnBeginDragWorklet = React.useCallback((val: number) => {
    'worklet';
    myProfilePrevYSharedValue.value = val;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const myProfileOnEndDragWorklet = React.useCallback((val: number) => {
    'worklet';
    if (tabScrollY[3].value < (headerHeight + insets.top) / 2 || val < headerHeight + insets.top) {
      tabScrollY[3].value = withTiming(0, { duration: 200 });
      myProfileInterpolatedYSharedValue.value = 0;
    } else {
      tabScrollY[3].value = withTiming(headerHeight + insets.top, {
        duration: 200,
      });
      myProfileInterpolatedYSharedValue.value = headerHeight + insets.top;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const FeedComponent = React.useCallback(
    props => (
      <Feed
        navigation={props.navigation}
        route={props.route as any}
        onScroll={feedAnimatedScrollHandler}
        headerHeight={headerHeight}
      />
    ),
    [headerHeight, feedAnimatedScrollHandler],
  );

  const notEligibleOnDismiss = React.useCallback(() => setUneligibleSheetVisible(false), []);

  const notEligibleStakeText = React.useMemo(
    () => (myPersona.username ? t('home:notEligibleGoToStake') : undefined),
    [myPersona.username, t],
  );

  const notEligibleStakeAction = React.useCallback(() => {
    setUneligibleSheetVisible(false);
    navigation.navigate('StakePool', {
      arg: myPersona.address,
      mode: 'a',
    });
  }, [myPersona.address, navigation]);

  const restoreMenuOnDismiss = React.useCallback(() => setRestoreMenuVisible(false), []);

  const createNewCallback = React.useCallback(() => {
    switch (createType) {
      case 'onekind':
        dispatch(clearCreateNFTOneKindQueue());
        break;
      case 'pack':
        dispatch(clearCreateNFTPackQueue());
    }
    dispatch(clearCreateNFTQueueType());
    dispatch(clearCreateNFTQueueRoute());
    cleanTMPImage();
    setRestoreMenuVisible(false);
    navigation.navigate('ChooseNFTType');
  }, [dispatch, navigation, createType]);

  const restoreCallback = React.useCallback(() => {
    setRestoreMenuVisible(false);
    createQueue && navigation.navigate(createQueue);
  }, [createQueue, navigation]);

  const MyProfileComponent = (props: any) => (
    <MyProfile
      navigation={props.navigation}
      route={props.route as any}
      headerHeight={headerHeight}
      onScrollWorklet={myProfileOnScrollWorklet}
      onBeginDragWorklet={myProfileOnBeginDragWorklet}
      onEndDragWorklet={myProfileOnEndDragWorklet}
      onMomentumEndWorklet={myProfileOnEndDragWorklet}
    />
  );

  const requestFaucets = React.useCallback(async () => {
    const res = await requestFaucet(myPersona.address);
    if (res.status === 200) {
      dispatch(showSnackbar({ mode: 'info', text: 'Add Funds Success!' }));
      dispatch(touchOnceWelcome());
    }
  }, [myPersona.address, dispatch]);

  return (
    <BottomSheetModalProvider>
      {!welcome ? (
        <AppAlertModal
          visible={!welcome}
          iconName={'welcome'}
          onDismiss={requestFaucets}
          title={'Welcome to our Alpha App!'}
          description={"We'll give you 2K test coin to explore our alphanet, don't forget to give us feedback :)"}
          secondaryButtonText={"I'm Super Excited!"}
          secondaryButtonOnPress={() => dispatch(touchOnceWelcome())}
        />
      ) : null}
      {canCreateNFT ? null : (
        <AppAlertModal
          visible={uneligibleSheetVisible}
          iconName={'notEligibleCreator'}
          onDismiss={notEligibleOnDismiss}
          title={t('home:notEligible')}
          description={t('home:notEligibleDescription', {
            minimumStake: MINIMUM_BASIC_UNIT_STAKE_ELIGIBILITY,
            coin: getCoinName(),
          })}
          secondaryButtonText={t('home:notEligibleOKButton')}
          secondaryButtonOnPress={notEligibleOnDismiss}
          tertiaryButtonText={notEligibleStakeText}
          tertiaryButtonOnPress={notEligibleStakeAction}
        />
      )}
      {createQueue ? (
        <AppConfirmationModal
          iconName={'restore'}
          visible={restoreMenuVisible}
          onDismiss={restoreMenuOnDismiss}
          title={t('home:restoreDialog')}
          description={t('home:restoreDialogDescription')}
          cancelText={t('home:startNew')}
          cancelOnPress={createNewCallback}
          okText={t('home:restore')}
          okOnPress={restoreCallback}
        />
      ) : null}
      <Tab.Navigator
        tabBar={props => <AppTabBar {...props} style={tabBarStyle} />}
        screenOptions={{
          tabBarStyle: {
            position: 'absolute',
            height: tabBarHeight + insets.bottom,
            backgroundColor: theme.colors.background,
            borderTopColor: theme.colors.background,
          },
          tabBarActiveTintColor: theme.colors.text,
          tabBarInactiveTintColor: Color(theme.colors.text).alpha(0.5).rgb().toString(),
        }}>
        <Tab.Screen
          name="Feed"
          listeners={{
            tabPress: () => {
              setActiveTab(0);
            },
          }}
          options={{
            tabBarLabel: t('home:feed'),
            tabBarBadge: newFeedUpdate ? '' : undefined,
            tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name={iconMap.home} color={color} size={size} />,
            tabBarButton: props => <TouchableRipple {...props} disabled={props.disabled as boolean | undefined} />,
            header: () => (
              <AppHeader style={feedStyle} height={headerHeight}>
                <AppHeaderAction
                  icon={iconMap.magnify}
                  onPress={() => dispatch(showSnackbar({ mode: 'info', text: 'Coming Soon!' }))}
                />
                <AppHeaderAction
                  icon={iconMap.notification}
                  onPress={() => dispatch(showSnackbar({ mode: 'info', text: 'Coming Soon!' }))}
                />
              </AppHeader>
            ),
          }}>
          {props => FeedComponent(props)}
        </Tab.Screen>
        <Tab.Screen
          name="Statistics"
          listeners={{
            tabPress: () => {
              setActiveTab(1);
            },
          }}
          options={{
            tabBarLabel: t('home:statistics'),
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name={iconMap.statistics} color={color} size={size} />
            ),
            tabBarButton: props => <TouchableRipple {...props} disabled={props.disabled as boolean | undefined} />,
            header: () => <AppHeader height={headerHeight} title={'Statistics'} />,
          }}
          component={Statistics}
        />
        <Tab.Screen
          name="Create NFT"
          listeners={{
            tabPress: (event: any) => {
              event.preventDefault();
              if (canCreateNFT) {
                !onceEligible && dispatch(touchOnceEligible());
                if (createQueue) {
                  setRestoreMenuVisible(!restoreMenuVisible);
                } else {
                  navigation.navigate('ChooseNFTType');
                }
              } else {
                setUneligibleSheetVisible(!uneligibleSheetVisible);
              }
            },
          }}
          options={{
            tabBarLabel: t('home:createNFT'),
            tabBarBadge: canCreateNFT && !onceEligible ? t('home:eligible') : undefined,
            tabBarBadgeStyle: { fontSize: hp('1.2%', insets) },
            tabBarIcon: ({ size }) =>
              canCreateNFT ? (
                <AppIconGradient
                  name={iconMap.createNFT}
                  size={size * 1.5}
                  colors={[theme.colors.primary, theme.colors.secondary]}
                />
              ) : (
                <MaterialCommunityIcons
                  name={iconMap.createNFT}
                  color={Color(theme.colors.text).alpha(0.4).rgb().toString()}
                  size={size * 1.5}
                />
              ),
            tabBarButton: props => <TouchableRipple {...props} disabled={props.disabled as boolean | undefined} />,
          }}
          component={View}
        />
        <Tab.Screen
          name="Discover"
          listeners={{
            tabPress: () => {
              setActiveTab(2);
            },
          }}
          options={{
            tabBarLabel: t('home:apps'),
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name={iconMap.discover} color={color} size={size} />
            ),
            tabBarButton: props => <TouchableRipple {...props} disabled={props.disabled as boolean | undefined} />,
            header: () => <AppHeader height={headerHeight} title={'Discover'} />,
          }}
          component={Discover}
        />
        <Tab.Screen
          name="MyProfile"
          listeners={{
            tabPress: () => {
              setActiveTab(3);
            },
          }}
          options={{
            tabBarLabel: t('home:profile'),
            tabBarBadge: newProfileUpdate ? '' : undefined,
            tabBarIcon: ({ color, size }) => <AppAvatarRenderer color={color} size={size * 1.1} persona={myPersona} />,
            tabBarButton: props => <TouchableRipple {...props} disabled={props.disabled as boolean | undefined} />,
            header: () => (
              <AppHeader style={myProfileStyle} height={headerHeight} title={t('home:myProfile')}>
                <AppHeaderAction
                  icon={iconMap.edit}
                  onPress={() => dispatch(showSnackbar({ mode: 'info', text: 'Coming Soon!' }))}
                />
                <AppHeaderAction
                  icon={iconMap.setting}
                  onPress={() => dispatch(showSnackbar({ mode: 'info', text: 'Coming Soon!' }))}
                />
              </AppHeader>
            ),
          }}>
          {props => MyProfileComponent(props)}
        </Tab.Screen>
      </Tab.Navigator>
    </BottomSheetModalProvider>
  );
}
