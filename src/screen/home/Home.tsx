import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feed from 'enevti-app/screen/home/Feed';
import Statistics from 'enevti-app/screen/home/Statistics';
import Discover from 'enevti-app/screen/home/Discover';
import MyProfile from 'enevti-app/screen/home/MyProfile';
import AppHeader, { HEADER_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppHeader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import AppTabBar, { TABBAR_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppTabBar';
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
import { Linking, View } from 'react-native';
import Color from 'color';
import AppIconGradient from 'enevti-app/components/molecules/AppIconGradient';
import { Theme } from 'enevti-app/theme/default';
import { isProfileCanCreateNFT, MINIMUM_BASIC_UNIT_STAKE_ELIGIBILITY } from 'enevti-app/service/enevti/profile';
import { selectOnceEligible, touchOnceEligible } from 'enevti-app/store/slices/entities/once/eligible';
import messaging from '@react-native-firebase/messaging';

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
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import { selectOnceWelcome, touchOnceWelcome } from 'enevti-app/store/slices/entities/once/welcome';
import { requestFaucet } from 'enevti-app/service/enevti/dummy';
import { isThereAnyNewMyProfileUpdates } from 'enevti-app/store/slices/ui/view/myProfile';
import { isThereAnyNewFeedView } from 'enevti-app/store/slices/ui/view/feed';
import { addAppOpenCounter, selectAppOpenCounter } from 'enevti-app/store/slices/entities/appOpenCounter';
import handleFCM from 'enevti-app/service/firebase/fcm';
import { addCheckDeliverSecretJob } from 'enevti-app/utils/background/worker/deliverSecretWorker';
import { selectDeliverSecretProcessing } from 'enevti-app/store/slices/session/transaction/processing';

const Tab = createBottomTabNavigator();

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
  const appOpenCounter = useSelector(selectAppOpenCounter);
  const isDeliverSecretProcessing = useSelector(selectDeliverSecretProcessing);

  const [uneligibleSheetVisible, setUneligibleSheetVisible] = React.useState<boolean>(false);
  const [restoreMenuVisible, setRestoreMenuVisible] = React.useState<boolean>(false);
  const headerHeight = hp(HEADER_HEIGHT_PERCENTAGE, insets);
  const tabBarHeight = hp(TABBAR_HEIGHT_PERCENTAGE, insets);

  const socket = React.useRef<Socket | undefined>();

  React.useEffect(() => {
    dispatch(syncTransactionNonce());
    dispatch(addAppOpenCounter());
  }, [dispatch]);

  React.useEffect(() => {
    messaging().subscribeToTopic(myPersona.address);
  }, [myPersona.address]);

  React.useEffect(() => {
    messaging().onMessage(async remoteMessage => {
      handleFCM(remoteMessage);
    });
  }, []);

  React.useEffect(() => {
    if (!isDeliverSecretProcessing) {
      addCheckDeliverSecretJob({ payload: myPersona.address });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myPersona.address]);

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

  const FeedComponent = React.useCallback(
    props => <Feed navigation={props.navigation} route={props.route as any} headerHeight={headerHeight} />,
    [headerHeight],
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
    <MyProfile navigation={props.navigation} route={props.route as any} headerHeight={headerHeight} />
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
      {appOpenCounter === 3 ? (
        <AppAlertModal
          visible={appOpenCounter === 3}
          iconName={'survey'}
          onDismiss={() => dispatch(addAppOpenCounter())}
          title={'We Need Feedback!'}
          description={'Would you mind filling out a quick survey for our MVP feedback? Only 1 minute'}
          secondaryButtonText={'Of Course!'}
          secondaryButtonOnPress={() => {
            Linking.openURL('https://link.enevti.com/mvp-feedback-en');
          }}
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
        tabBar={props => <AppTabBar {...props} />}
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
          options={{
            tabBarLabel: t('home:feed'),
            tabBarBadge: newFeedUpdate ? '' : undefined,
            tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name={iconMap.home} color={color} size={size} />,
            tabBarButton: props => <TouchableRipple {...props} disabled={props.disabled as boolean | undefined} />,
            header: () => (
              <AppHeader height={headerHeight}>
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
          options={{
            tabBarLabel: t('home:profile'),
            tabBarBadge: newProfileUpdate ? '' : undefined,
            tabBarIcon: ({ color, size }) => <AppAvatarRenderer color={color} size={size * 1.1} persona={myPersona} />,
            tabBarButton: props => <TouchableRipple {...props} disabled={props.disabled as boolean | undefined} />,
            header: () => (
              <AppHeader height={headerHeight} title={t('home:myProfile')}>
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
