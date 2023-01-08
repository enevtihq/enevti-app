import { Platform, Pressable, RefreshControl, StyleSheet, useWindowDimensions, View } from 'react-native';
import Video from 'react-native-video';
import React from 'react';
import { FlatList } from '@stream-io/flat-list-mvcp';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {
  addMomentLikeById,
  loadMoment,
  setMomentById,
  unloadMoment,
} from 'enevti-app/store/middleware/thunk/ui/view/moment';
import { AppAsyncThunk } from 'enevti-app/types/ui/store/AppAsyncThunk';
import { MomentsData, selectMomentView } from 'enevti-app/store/slices/ui/view/moment';
import { RootState } from 'enevti-app/store/state';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/layout/imageRatio';
import { IPFStoURL } from 'enevti-app/service/ipfs';
import { EventRegister } from 'react-native-event-listeners';
import AppResponseView from '../view/AppResponseView';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import AppIconComponent, { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import Color from 'color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppAvatarRenderer from 'enevti-app/components/molecules/avatar/AppAvatarRenderer';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import { parsePersonaLabel } from 'enevti-app/service/enevti/persona';
import AppMentionRenderer from 'enevti-app/components/molecules/comment/AppMentionRenderer';
import AppTextHeading4 from 'enevti-app/components/atoms/text/AppTextHeading4';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import darkTheme from 'enevti-app/theme/dark';
import AppIconButton from 'enevti-app/components/atoms/icon/AppIconButton';
import AppNFTRenderer from 'enevti-app/components/molecules/nft/AppNFTRenderer';
import AppTextBody5 from 'enevti-app/components/atoms/text/AppTextBody5';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import usePaymentCallback from 'enevti-app/utils/hook/usePaymentCallback';
import { PaymentStatus } from 'enevti-app/types/ui/store/Payment';
import { directPayLikeMoment } from 'enevti-app/store/middleware/thunk/payment/direct/directPayLikeMoment';
import AppLikeReadyInstance from 'enevti-app/utils/app/likeReady';
import { useTranslation } from 'react-i18next';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import { numberKMB } from 'enevti-app/utils/format/amount';
import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';
import AppComment from '../comment/AppComment';
import useDebouncedNavigation from 'enevti-app/utils/hook/useDebouncedNavigation';
import LinearGradient from 'react-native-linear-gradient';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface AppMomentViewProps {
  navigation: StackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'Moment'>;
  onLongPressWorklet: () => void;
  onLongPressOutWorklet: () => void;
}

export default function AppMomentView({
  navigation,
  route,
  onLongPressWorklet,
  onLongPressOutWorklet,
}: AppMomentViewProps) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const dimension = useWindowDimensions();
  const styles = React.useMemo(() => makeStyles(theme, insets, dimension.height), [theme, insets, dimension.height]);
  const snapPoints = React.useMemo(() => ['70%'], []);
  const dnavigation = useDebouncedNavigation(navigation);

  const [controlVisible, setControlVisible] = React.useState<boolean>(true);
  const [muted, setMuted] = React.useState<boolean>(false);
  const [visible, setVisible] = React.useState<number>(0);
  const [commentId, setCommentId] = React.useState<string>('');
  const [currentVisibleIndex, setCurrentVisibleIndex] = React.useState<number>(route.params.index ?? 0);

  const commentRoute = React.useMemo(
    () => ({
      key: route.key,
      name: route.name,
      params: { type: 'moment', mode: 'id', arg: commentId },
      path: route.path,
    }),
    [commentId, route.key, route.name, route.path],
  ) as unknown as RouteProp<RootStackParamList, 'Comment'>;

  const showAudioIndicatorTimeout = React.useRef<any>();
  const momentListRef = React.useRef<FlatList>(null);
  const isLongPressRef = React.useRef<boolean>(false);
  const touchedRef = React.useRef<boolean>(false);
  const videoRef = React.useRef<Record<number, any>>({});
  const currentIndexRef = React.useRef<number>(route.params.index ?? 0);
  const paymentThunkRef = React.useRef<any>();

  const momentView = useSelector((state: RootState) => selectMomentView(state, route.key));
  const opacity = useSharedValue(0);
  const controlOpacity = useSharedValue(1);

  const audioIndicatorAnimatedStyle = useAnimatedStyle(() => {
    return { opacity: opacity.value };
  });

  const controlAnimatedStyle = useAnimatedStyle(() => {
    return { opacity: controlOpacity.value };
  });

  const muteCallback = React.useCallback(() => {
    clearTimeout(showAudioIndicatorTimeout.current);
    opacity.value = 1;
    showAudioIndicatorTimeout.current = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 500 });
      clearTimeout(showAudioIndicatorTimeout.current);
    }, 1000);
  }, [opacity]);

  const onLongPress = React.useCallback(() => {
    controlOpacity.value = withTiming(0, { duration: 250 });
    onLongPressWorklet();
    isLongPressRef.current = true;
    setControlVisible(false);
  }, [controlOpacity, onLongPressWorklet]);

  const onPress = React.useCallback(() => {
    setMuted(old => !old);
    muteCallback();
  }, [muteCallback]);

  const onPressOut = React.useCallback(() => {
    if (isLongPressRef.current) {
      controlOpacity.value = withTiming(1, { duration: 250 });
      onLongPressOutWorklet();
      isLongPressRef.current = false;
      setControlVisible(true);
      return;
    }
  }, [controlOpacity, onLongPressOutWorklet]);

  const onMomentLoaded = React.useCallback(
    (reload: boolean = false) => dispatch(loadMoment({ route, reload })),
    [dispatch, route],
  ) as AppAsyncThunk;

  const onMomentReload = React.useCallback(async () => {
    await onMomentLoaded(true).unwrap();
    videoRef.current[currentIndexRef.current]?.setNativeProps({ paused: false });
  }, [onMomentLoaded]);

  const onLikePress = React.useCallback(
    (id: string, target: string) => {
      dispatch(setMomentById({ route, id, moment: { isLiking: true } }));
      paymentThunkRef.current = dispatch(directPayLikeMoment({ id, key: route.key, target }));
    },
    [dispatch, route],
  );

  const onCommentPress = React.useCallback((id: string) => {
    setCommentId(id);
  }, []);

  const onCommentDismiss = React.useCallback(() => {
    setCommentId('');
  }, []);

  const onAlreadyLiked = React.useCallback(() => {
    dispatch(showSnackbar({ mode: 'info', text: t('home:cannotLike') }));
  }, [dispatch, t]);

  const paymentCondition = React.useCallback(
    (paymentStatus: PaymentStatus) => {
      return (
        paymentStatus.action !== undefined &&
        ['likeMoment'].includes(paymentStatus.action) &&
        paymentStatus.key === route.key
      );
    },
    [route],
  );

  const paymentIdleCallback = React.useCallback(
    (paymentStatus: PaymentStatus) => {
      switch (paymentStatus.action) {
        case 'likeMoment':
          dispatch(setMomentById({ route, id: paymentStatus.id, moment: { isLiking: false } }));
          break;
        default:
          break;
      }
      AppLikeReadyInstance.setReady();
    },
    [dispatch, route],
  );

  const paymentSuccessCallback = React.useCallback(
    async (paymentStatus: PaymentStatus) => {
      switch (paymentStatus.action) {
        case 'likeMoment':
          dispatch(addMomentLikeById({ route, id: paymentStatus.id }));
          dispatch(setMomentById({ route, id: paymentStatus.id, moment: { liked: true } }));
          break;
        default:
          break;
      }
    },
    [dispatch, route],
  );

  usePaymentCallback({
    condition: paymentCondition,
    onIdle: paymentIdleCallback,
    onSuccess: paymentSuccessCallback,
  });

  React.useEffect(() => {
    const unsubscribe = EventRegister.addEventListener(route.key, () => {
      EventRegister.removeEventListener(unsubscribe.toString());
      setVisible(1);
      if (route.params.mode !== undefined) {
        momentListRef.current?.scrollToIndex({ animated: false, index: route.params.index! });
      }
    });
    const promise = onMomentLoaded();

    return function cleanup() {
      dispatch(unloadMoment(route.key));
      promise.abort();
      EventRegister.removeEventListener(unsubscribe.toString());
    };
  }, [dispatch, onMomentLoaded, route.key, route.params.index, route.params.mode]);

  React.useEffect(() => {
    const unsubscribeBlur = navigation.addListener('blur', () => {
      videoRef.current[currentIndexRef.current]?.setNativeProps({ paused: true });
      videoRef.current[currentIndexRef.current]?.seek(0);
    });
    const unsubscribeFocus = navigation.addListener('focus', () => {
      videoRef.current[currentIndexRef.current]?.setNativeProps({ paused: false });
    });
    return () => {
      unsubscribeBlur();
      unsubscribeFocus();
    };
  }, [navigation, dispatch]);

  const renderItem = React.useCallback(
    ({ item, index }: { item: MomentsData; index: number }) => {
      return (
        <View style={styles.momentItemContainer}>
          <Pressable onLongPress={onLongPress} onPress={onPress} onPressOut={onPressOut}>
            <Animated.View style={[styles.audioIndicator, audioIndicatorAnimatedStyle]}>
              <View style={styles.audioIndicatorItem}>
                <AppIconComponent
                  name={muted ? iconMap.volumeOff : iconMap.volumeOn}
                  size={hp(3)}
                  color={darkTheme.colors.text}
                  style={{ padding: hp(2) }}
                />
              </View>
            </Animated.View>
            <Video
              repeat
              ref={ref => {
                videoRef.current[index] = ref;
              }}
              poster={IPFStoURL(item.cover.cid)}
              paused={!controlVisible || currentVisibleIndex !== index}
              source={{ uri: IPFStoURL(item.data.cid) }}
              style={styles.momentItemContainer}
              resizeMode={'contain'}
              muted={muted}
            />
          </Pressable>
          <AnimatedLinearGradient
            colors={['transparent', Color('#000000').alpha(0.25).rgb().toString()]}
            style={[styles.gradientBottom, controlAnimatedStyle]}
          />
          <Animated.View style={[styles.leftContainer, controlAnimatedStyle]}>
            <Pressable
              onPress={() => dnavigation('Profile', { mode: 'a', arg: item.owner.address })}
              style={styles.ownerContainer}>
              <AppAvatarRenderer persona={item.owner} size={hp(3)} style={styles.ownerAvatar} />
              <AppTextHeading3 style={styles.ownerLabel}>{parsePersonaLabel(item.owner, true)}</AppTextHeading3>
            </Pressable>
            <View style={{ marginVertical: hp(2) }}>
              <AppMentionRenderer
                numberOfLines={2}
                navigation={navigation}
                text={item.textPlain!}
                color={darkTheme.colors.text}
                theme={'dark'}
              />
            </View>
            <Pressable
              onPress={() => dnavigation('Profile', { mode: 'a', arg: item.creator.address })}
              style={styles.creatorContainer}>
              <AppTextBody4 style={{ color: darkTheme.colors.placeholder }}>{t('moment:momentWith')}</AppTextBody4>
              <AppAvatarRenderer persona={item.creator} size={hp(2)} style={{ marginHorizontal: wp(1.5) }} />
              <AppTextHeading4 style={{ color: darkTheme.colors.placeholder }}>
                {parsePersonaLabel(item.creator, true)}
              </AppTextHeading4>
            </Pressable>
          </Animated.View>
          <Animated.View style={[styles.rightContainer, controlAnimatedStyle]}>
            <View style={styles.rightContent}>
              {item.isLiking ? (
                <View style={styles.rightContentItem}>
                  <AppActivityIndicator animating />
                </View>
              ) : (
                <View style={styles.rightContentItem}>
                  <AppIconButton
                    icon={item.liked ? iconMap.likeActive : iconMap.likeInactive}
                    color={item.liked ? darkTheme.colors.primary : darkTheme.colors.text}
                    size={wp(8)}
                    onPress={() =>
                      item.liked ? onAlreadyLiked() : onLikePress(item.id, parsePersonaLabel(item.owner))
                    }
                  />
                  <AppTextHeading3
                    numberOfLines={1}
                    style={[
                      styles.textCenter,
                      { color: item.liked ? darkTheme.colors.primary : darkTheme.colors.text },
                    ]}>
                    {numberKMB(item.like, 2, true, ['K', 'M', 'B'], 10000)}
                  </AppTextHeading3>
                </View>
              )}
              <View style={styles.rightContentItem}>
                <AppIconButton
                  icon={iconMap.comment}
                  color={darkTheme.colors.text}
                  size={wp(8)}
                  onPress={() => onCommentPress(item.id)}
                />
                <AppTextHeading3 numberOfLines={1} style={[styles.textCenter, { color: darkTheme.colors.text }]}>
                  {numberKMB(item.comment, 2, true, ['K', 'M', 'B'], 10000)}
                </AppTextHeading3>
              </View>
              <View
                style={{
                  width: wp(12),
                }}>
                <AppNFTRenderer
                  nft={item.nft!}
                  style={styles.nft}
                  width={wp(12)}
                  imageSize={'xs'}
                  onPress={() => {
                    dnavigation('NFTDetails', { arg: item.nft!.id, mode: 'id' });
                  }}
                />
                <AppTextBody5
                  numberOfLines={1}
                  style={styles.nftLabel}>{`${item.nft?.symbol}#${item.nft?.serial}`}</AppTextBody5>
              </View>
            </View>
          </Animated.View>
        </View>
      );
    },
    [
      t,
      audioIndicatorAnimatedStyle,
      controlAnimatedStyle,
      controlVisible,
      currentVisibleIndex,
      muted,
      navigation,
      dnavigation,
      onLikePress,
      onLongPress,
      onPress,
      onPressOut,
      onAlreadyLiked,
      onCommentPress,
      styles.audioIndicator,
      styles.audioIndicatorItem,
      styles.creatorContainer,
      styles.leftContainer,
      styles.momentItemContainer,
      styles.nft,
      styles.nftLabel,
      styles.ownerAvatar,
      styles.ownerContainer,
      styles.ownerLabel,
      styles.rightContainer,
      styles.rightContent,
      styles.textCenter,
      styles.rightContentItem,
      styles.gradientBottom,
    ],
  );

  const refreshControl = React.useMemo(
    () => <RefreshControl refreshing={false} onRefresh={onMomentReload} progressViewOffset={insets.top} />,
    [onMomentReload, insets],
  );

  const keyExtractor = React.useCallback(item => item.id, []);

  const getItemLayout = React.useCallback(
    (_, index) => ({
      length: dimension.height,
      offset: dimension.height * index,
      index,
    }),
    [dimension.height],
  );

  const onViewableItemsChanged = React.useCallback(
    ({ viewableItems }) => {
      if (viewableItems.length > 0) {
        opacity.value = 0;
        clearTimeout(showAudioIndicatorTimeout.current);
        setCurrentVisibleIndex(viewableItems[0].index);

        if (touchedRef.current) {
          videoRef.current[currentIndexRef.current]?.setNativeProps({ paused: true });
          videoRef.current[currentIndexRef.current]?.seek(0);
        } else {
          touchedRef.current = true;
        }

        currentIndexRef.current = viewableItems[0].index;
      }
    },
    [opacity],
  );

  return momentView.loaded ? (
    <AppResponseView color={darkTheme.colors.text} status={momentView.reqStatus} style={styles.container}>
      <FlatList
        ref={momentListRef}
        removeClippedSubviews={true}
        windowSize={5}
        getItemLayout={getItemLayout}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        pagingEnabled={true}
        data={momentView.moments}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        refreshControl={refreshControl}
        style={{ opacity: visible }}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 80,
        }}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
      />
      <AppMenuContainer
        enableContentPanningGesture={false}
        tapEverywhereToDismiss={true}
        visible={!!commentId}
        onDismiss={onCommentDismiss}
        snapPoints={snapPoints}>
        {commentId ? (
          <AppComment withModal commentBoxStyle={styles.comment} navigation={navigation} route={commentRoute} />
        ) : null}
      </AppMenuContainer>
    </AppResponseView>
  ) : (
    <View style={styles.loaderContainer}>
      <AppActivityIndicator animating />
    </View>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets, momentHeight: number) =>
  StyleSheet.create({
    comment: {
      marginBottom: Platform.OS === 'ios' ? insets.bottom : undefined,
    },
    nft: {
      borderRadius: theme.roundness,
      borderWidth: wp(0.25),
      borderColor: darkTheme.colors.text,
      overflow: 'hidden',
    },
    leftContainer: {
      position: 'absolute',
      height: hp(25),
      width: wp(80),
      marginBottom: insets.bottom,
      bottom: 0,
      left: 0,
      paddingLeft: wp(3),
      paddingBottom: hp(3),
      justifyContent: 'flex-end',
    },
    ownerContainer: {
      flexDirection: 'row',
    },
    ownerAvatar: {
      marginRight: wp(3),
    },
    ownerLabel: {
      color: darkTheme.colors.text,
    },
    creatorContainer: {
      flexDirection: 'row',
    },
    rightContainer: {
      position: 'absolute',
      height: hp(45),
      width: wp(20),
      marginBottom: insets.bottom,
      bottom: 0,
      right: 0,
      paddingRight: wp(3),
      paddingBottom: hp(3.5),
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
    },
    rightContent: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    rightContentItem: {
      height: hp(8),
      width: wp(12),
      marginBottom: hp(3),
      justifyContent: 'center',
      alignItems: 'center',
    },
    textCenter: {
      textAlign: 'center',
    },
    nftLabel: {
      marginTop: hp(0.5),
      color: darkTheme.colors.text,
      alignSelf: 'center',
    },
    momentItemContainer: {
      height: momentHeight,
      width: wp(100),
    },
    container: {
      flex: 1,
    },
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
    audioIndicator: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
    },
    audioIndicatorItem: {
      borderRadius: hp(5),
      backgroundColor: Color('black').alpha(0.5).rgb().string(),
    },
    gradientBottom: {
      height: hp(45),
      width: '100%',
      bottom: 0,
      position: 'absolute',
    },
  });
