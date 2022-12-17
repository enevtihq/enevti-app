import { Pressable, StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import React from 'react';
import { FlatList } from '@stream-io/flat-list-mvcp';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { loadMoment, unloadMoment } from 'enevti-app/store/middleware/thunk/ui/view/moment';
import { AppAsyncThunk } from 'enevti-app/types/ui/store/AppAsyncThunk';
import { selectMomentView } from 'enevti-app/store/slices/ui/view/moment';
import { RootState } from 'enevti-app/store/state';
import { Moment } from 'enevti-app/types/core/chain/moment';
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

const MOMENT_HEIGHT = hp(100);

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
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(insets), [insets]);

  const [controlVisible, setControlVisible] = React.useState<boolean>(true);
  const [muted, setMuted] = React.useState<boolean>(false);
  const [currentVisibleIndex, setCurrentVisibleIndex] = React.useState<number>(route.params.index ?? 0);

  const showAudioIndicatorTimeout = React.useRef<any>();
  const momentListRef = React.useRef<FlatList>(null);
  const isLongPressRef = React.useRef<boolean>(false);
  const touchedRef = React.useRef<boolean>(false);
  const videoRef = React.useRef<Record<number, any>>({});
  const currentIndexRef = React.useRef<number>(route.params.index ?? 0);
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

  React.useEffect(() => {
    const unsubscribe = EventRegister.addEventListener(route.key, () => {
      EventRegister.removeEventListener(unsubscribe.toString());
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
    ({ item, index }: { item: Moment & { liked?: boolean }; index: number }) => {
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
          <Animated.View style={[styles.leftContainer, controlAnimatedStyle]}>
            <Pressable
              onPress={() => navigation.push('Profile', { mode: 'a', arg: item.owner.address })}
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
              onPress={() => navigation.push('Profile', { mode: 'a', arg: item.creator.address })}
              style={styles.creatorContainer}>
              <AppTextBody4 style={{ color: darkTheme.colors.placeholder }}>with :</AppTextBody4>
              <AppAvatarRenderer persona={item.creator} size={hp(2)} style={{ marginHorizontal: wp(1.5) }} />
              <AppTextHeading4 style={{ color: darkTheme.colors.placeholder }}>
                {parsePersonaLabel(item.creator, true)}
              </AppTextHeading4>
            </Pressable>
          </Animated.View>
          <Animated.View style={[styles.rightContainer, controlAnimatedStyle]}>
            <View style={{ marginBottom: hp(3) }}>
              <AppIconButton
                icon={item.liked ? iconMap.likeActive : iconMap.likeInactive}
                color={item.liked ? darkTheme.colors.primary : darkTheme.colors.text}
                size={wp(8)}
                onPress={() => {}}
              />
              <AppTextHeading3
                style={[styles.textCenter, { color: item.liked ? darkTheme.colors.primary : darkTheme.colors.text }]}>
                {item.like}
              </AppTextHeading3>
            </View>
            <View style={{ marginBottom: hp(3) }}>
              <AppIconButton icon={iconMap.comment} color={darkTheme.colors.text} size={wp(8)} onPress={() => {}} />
              <AppTextHeading3 style={[styles.textCenter, { color: darkTheme.colors.text }]}>
                {item.comment}
              </AppTextHeading3>
            </View>
            <View style={{ width: wp(12) }}>
              <AppNFTRenderer
                nft={item.nft!}
                width={wp(12)}
                imageSize={'xxs'}
                onPress={() => {
                  navigation.push('NFTDetails', { arg: item.nft!.id, mode: 'id' });
                }}
              />
              <AppTextBody5
                numberOfLines={1}
                style={styles.nftLabel}>{`${item.nft?.symbol}#${item.nft?.serial}`}</AppTextBody5>
            </View>
          </Animated.View>
        </View>
      );
    },
    [
      audioIndicatorAnimatedStyle,
      controlAnimatedStyle,
      controlVisible,
      currentVisibleIndex,
      muted,
      navigation,
      onLongPress,
      onPress,
      onPressOut,
      styles.audioIndicator,
      styles.audioIndicatorItem,
      styles.creatorContainer,
      styles.leftContainer,
      styles.momentItemContainer,
      styles.nftLabel,
      styles.ownerAvatar,
      styles.ownerContainer,
      styles.ownerLabel,
      styles.rightContainer,
      styles.textCenter,
    ],
  );

  const keyExtractor = React.useCallback(item => item.id, []);

  const getItemLayout = React.useCallback(
    (_, index) => ({
      length: wp(100),
      offset: MOMENT_HEIGHT * index,
      index,
    }),
    [],
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
        viewabilityConfig={{
          itemVisiblePercentThreshold: 100,
        }}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
      />
    </AppResponseView>
  ) : (
    <View style={styles.loaderContainer}>
      <AppActivityIndicator animating />
    </View>
  );
}

const makeStyles = (insets: SafeAreaInsets) =>
  StyleSheet.create({
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
      height: MOMENT_HEIGHT,
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
  });
