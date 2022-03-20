import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feed from '../screen/home/Feed';
import Statistics from '../screen/home/Statistics';
import Discover from '../screen/home/Discover';
import MyProfile from '../screen/home/MyProfile';
import AppHeader, {
  HEADER_HEIGHT_PERCENTAGE,
} from '../components/atoms/view/AppHeader';
import {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  withTiming,
} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { diffClamp } from '../utils/animation';
import AppTabBar from '../components/atoms/view/AppTabBar';
import { hp, SafeAreaInsets, wp } from '../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppHeaderAction from '../components/atoms/view/AppHeaderAction';
import { iconMap } from '../components/atoms/icon/AppIconComponent';
import { TouchableRipple, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { getMyBasePersona } from '../service/enevti/persona';
import AppAvatarRenderer from '../components/molecules/avatar/AppAvatarRenderer';
import { useDispatch, useSelector } from 'react-redux';
import { selectPersona } from '../store/slices/entities/persona';
import { selectProfile } from '../store/slices/entities/profile';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StyleSheet, View } from 'react-native';
import Color from 'color';
import AppIconGradient from '../components/molecules/AppIconGradient';
import { Theme } from '../theme/default';
import {
  getMyProfile,
  isProfileCanCreateNFT,
  MINIMUM_BASIC_UNIT_STAKE_ELIGIBILITY,
} from '../service/enevti/profile';
import {
  selectOnceEligible,
  touchOnceEligible,
} from '../store/slices/entities/once/eligible';
import AppMenuContainer from '../components/atoms/menu/AppMenuContainer';
import AppHeaderWizard from '../components/molecules/AppHeaderWizard';

import NotEligibleIMG from '../assets/svg/undraw_stand_out_-1-oag.svg';
import { getCoinName } from '../components/atoms/brand/AppBrandConstant';
import AppSecondaryButton from '../components/atoms/button/AppSecondaryButton';
import AppQuaternaryButton from '../components/atoms/button/AppQuaternaryButton';
import AppTextBody4 from '../components/atoms/text/AppTextBody4';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '.';
import {
  clearCreateNFTQueueRoute,
  selectCreateNFTRouteQueue,
} from '../store/slices/queue/nft/create/route';
import AppPrimaryButton from '../components/atoms/button/AppPrimaryButton';
import {
  clearCreateNFTQueueType,
  selectCreateNFTTypeQueue,
} from '../store/slices/queue/nft/create/type';
import { clearCreateNFTOneKindQueue } from '../store/slices/queue/nft/create/onekind';
import { cleanTMPImage } from '../service/enevti/nft';
import { clearCreateNFTPackQueue } from '../store/slices/queue/nft/create/pack';

const Tab = createBottomTabNavigator();
const TABBAR_HEIGHT_PERCENTAGE = 8;

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export default function Home({ navigation }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(insets), [insets]);
  const restoreMenuSnapPoints = React.useMemo(() => ['42%'], []);

  const myPersona = useSelector(selectPersona);
  const myProfile = useSelector(selectProfile);
  const onceEligible = useSelector(selectOnceEligible);
  const createQueue = useSelector(selectCreateNFTRouteQueue);
  const createType = useSelector(selectCreateNFTTypeQueue);
  const canCreateNFT = isProfileCanCreateNFT(myProfile);

  const getPersona = async () => {
    await getMyBasePersona();
  };

  const getProfile = React.useCallback(async () => {
    await getMyProfile();
  }, []);

  React.useEffect(() => {
    getPersona();
    getProfile();
  }, [getProfile]);

  const [uneligibleSheetVisible, setUneligibleSheetVisible] =
    React.useState<boolean>(false);
  const [restoreMenuVisible, setRestoreMenuVisible] =
    React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState<number>(0);
  const headerHeight = hp(HEADER_HEIGHT_PERCENTAGE, insets);
  const tabBarHeight = hp(TABBAR_HEIGHT_PERCENTAGE, insets);
  const tabScrollY = [
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
  ];

  const myProfilePrevYSharedValue = useSharedValue(0);
  const myProfileInterpolatedYSharedValue = useSharedValue(0);

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
      tabScrollY[0].value = diffClamp(
        ctx.current + diff,
        0,
        headerHeight + insets.top,
      );
    },
    onBeginDrag: (event, ctx) => {
      ctx.prevY = event.contentOffset.y;
    },
    onEndDrag: (event, ctx) => {
      if (
        tabScrollY[0].value < (headerHeight + insets.top) / 2 ||
        event.contentOffset.y < headerHeight + insets.top
      ) {
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
      if (
        tabScrollY[0].value < (headerHeight + insets.top) / 2 ||
        event.contentOffset.y < headerHeight + insets.top
      ) {
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

  const myProfileOnScrollWorklet = (val: number) => {
    'worklet';
    const diff = val - myProfilePrevYSharedValue.value;
    tabScrollY[3].value = diffClamp(
      myProfileInterpolatedYSharedValue.value + diff,
      0,
      headerHeight + insets.top,
    );
  };

  const myProfileOnBeginDragWorklet = (val: number) => {
    'worklet';
    myProfilePrevYSharedValue.value = val;
  };

  const myProfileOnEndDragWorklet = (val: number) => {
    'worklet';
    if (
      tabScrollY[3].value < (headerHeight + insets.top) / 2 ||
      val < headerHeight + insets.top
    ) {
      tabScrollY[3].value = withTiming(0, { duration: 200 });
      myProfileInterpolatedYSharedValue.value = 0;
    } else {
      tabScrollY[3].value = withTiming(headerHeight + insets.top, {
        duration: 200,
      });
      myProfileInterpolatedYSharedValue.value = headerHeight + insets.top;
    }
  };

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

  const restoreMenuOnDismiss = React.useCallback(
    () => setRestoreMenuVisible(false),
    [],
  );

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

  return (
    <BottomSheetModalProvider>
      {canCreateNFT ? null : (
        <AppMenuContainer
          visible={uneligibleSheetVisible}
          snapPoints={['70%']}
          onDismiss={() => setUneligibleSheetVisible(false)}>
          <AppHeaderWizard
            component={
              <View style={styles.notEligibleImage}>
                <NotEligibleIMG
                  width={wp('80%', insets)}
                  height={hp('20%', insets)}
                />
              </View>
            }
            style={styles.notEligibleContainer}
            title={t('home:notEligible')}
            description={t('home:notEligibleDescription', {
              minimumStake: MINIMUM_BASIC_UNIT_STAKE_ELIGIBILITY,
              coin: getCoinName(),
            })}
          />
          <View style={{ padding: wp('10%', insets) }}>
            <AppSecondaryButton
              onPress={() => setUneligibleSheetVisible(false)}>
              {t('home:notEligibleOKButton')}
            </AppSecondaryButton>
            <View style={{ height: hp('1%', insets) }} />
            <AppQuaternaryButton
              contentStyle={styles.notEligibleGoToStakeButton}
              onPress={() => {
                setUneligibleSheetVisible(false);
                navigation.navigate('StakePool', { persona: myPersona });
              }}>
              <AppTextBody4 style={{ color: theme.colors.primary }}>
                {t('home:notEligibleGoToStake')}
              </AppTextBody4>
            </AppQuaternaryButton>
          </View>
        </AppMenuContainer>
      )}
      {createQueue ? (
        <AppMenuContainer
          memoKey={['visible']}
          tapEverywhereToDismiss
          enablePanDownToClose
          snapPoints={restoreMenuSnapPoints}
          visible={restoreMenuVisible}
          onDismiss={restoreMenuOnDismiss}>
          <AppHeaderWizard
            noHeaderSpace
            mode={'icon'}
            modeData={'restore'}
            style={styles.restoreMenuContainer}
            title={t('home:restoreDialog')}
            titleStyle={styles.restoreMenuTitle}
            description={t('home:restoreDialogDescription')}
          />
          <View style={styles.restoreMenuAction}>
            <View style={styles.restoreMenuItemAction}>
              <AppSecondaryButton onPress={createNewCallback}>
                {t('home:startNew')}
              </AppSecondaryButton>
            </View>
            <View style={styles.restoreMenuActionSpace} />
            <View style={styles.restoreMenuItemAction}>
              <AppPrimaryButton onPress={restoreCallback}>
                {t('home:restore')}
              </AppPrimaryButton>
            </View>
          </View>
        </AppMenuContainer>
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
          tabBarInactiveTintColor: Color(theme.colors.text)
            .alpha(0.5)
            .rgb()
            .toString(),
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
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name={iconMap.home}
                color={color}
                size={size}
              />
            ),
            tabBarButton: props => (
              <TouchableRipple
                {...props}
                disabled={props.disabled as boolean | undefined}
              />
            ),
            header: () => (
              <AppHeader style={feedStyle} height={headerHeight}>
                <AppHeaderAction
                  icon={iconMap.magnify}
                  onPress={() => console.log('pressed')}
                />
                <AppHeaderAction
                  icon={iconMap.notification}
                  onPress={() => console.log('pressed')}
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
              <MaterialCommunityIcons
                name={iconMap.statistics}
                color={color}
                size={size}
              />
            ),
            tabBarButton: props => (
              <TouchableRipple
                {...props}
                disabled={props.disabled as boolean | undefined}
              />
            ),
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
            tabBarBadge:
              canCreateNFT && !onceEligible ? t('home:eligible') : undefined,
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
            tabBarButton: props => (
              <TouchableRipple
                {...props}
                disabled={props.disabled as boolean | undefined}
              />
            ),
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
              <MaterialCommunityIcons
                name={iconMap.discover}
                color={color}
                size={size}
              />
            ),
            tabBarButton: props => (
              <TouchableRipple
                {...props}
                disabled={props.disabled as boolean | undefined}
              />
            ),
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
            tabBarIcon: ({ color, size }) => (
              <AppAvatarRenderer
                color={color}
                size={size * 1.1}
                photo={myPersona?.photo}
                address={myPersona?.address}
              />
            ),
            tabBarButton: props => (
              <TouchableRipple
                {...props}
                disabled={props.disabled as boolean | undefined}
              />
            ),
            header: () => (
              <AppHeader
                style={myProfileStyle}
                height={headerHeight}
                title={t('home:profile')}>
                <AppHeaderAction
                  icon={iconMap.edit}
                  onPress={() => console.log('pressed')}
                />
                <AppHeaderAction
                  icon={iconMap.setting}
                  onPress={() => console.log('pressed')}
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

const makeStyles = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    notEligibleImage: {
      alignSelf: 'center',
    },
    notEligibleContainer: {
      width: wp('90%', insets),
      alignSelf: 'center',
      flex: 0,
    },
    notEligibleGoToStakeButton: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    restoreMenuContainer: {
      width: wp('90%', insets),
      alignSelf: 'center',
      flex: 0,
    },
    restoreMenuTitle: {
      marginTop: hp('1%', insets),
    },
    restoreMenuAction: {
      paddingHorizontal: wp('5%', insets),
      marginTop: hp('3%', insets),
      flexDirection: 'row',
    },
    restoreMenuItemAction: {
      flex: 1,
    },
    restoreMenuActionSpace: {
      marginHorizontal: wp('1%', insets),
    },
  });
