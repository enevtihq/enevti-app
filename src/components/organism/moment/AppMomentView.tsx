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
import { hp, wp } from 'enevti-app/utils/layout/imageRatio';
import { IPFStoURL } from 'enevti-app/service/ipfs';
import { EventRegister } from 'react-native-event-listeners';
import AppResponseView from '../view/AppResponseView';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import AppIconComponent, { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import Color from 'color';

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
  const styles = React.useMemo(() => makeStyles(), []);

  const [controlVisible, setControlVisible] = React.useState<boolean>(true);
  const [muted, setMuted] = React.useState<boolean>(false);
  const [currentVisibleIndex, setCurrentVisbleIndex] = React.useState<number>();

  const showAudioIndicatorTimeout = React.useRef<any>();
  const momentListRef = React.useRef<FlatList>(null);
  const isLongPressRef = React.useRef<boolean>(false);
  const videoRef = React.useRef<Record<number, any>>({});
  const currentIndexRef = React.useRef<number>(route.params.index ?? 0);
  const momentView = useSelector((state: RootState) => selectMomentView(state, route.key));
  const opacity = useSharedValue(0);

  const audioIndicatorAnimatedStyle = useAnimatedStyle(() => {
    return { opacity: opacity.value };
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
    onLongPressWorklet();
    isLongPressRef.current = true;
    setControlVisible(false);
  }, [onLongPressWorklet]);

  const onPress = React.useCallback(() => {
    setMuted(old => !old);
    muteCallback();
  }, [muteCallback]);

  const onPressOut = React.useCallback(() => {
    if (isLongPressRef.current) {
      setControlVisible(true);
      onLongPressOutWorklet();
      isLongPressRef.current = false;
      return;
    }
  }, [onLongPressOutWorklet]);

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

  const renderItem = React.useCallback(
    ({ item, index }: { item: Moment; index: number }) => {
      return (
        <Pressable
          onLongPress={onLongPress}
          onPress={onPress}
          onPressOut={onPressOut}
          style={styles.momentItemContainer}>
          <Animated.View style={[styles.audioIndicator, audioIndicatorAnimatedStyle]}>
            <View style={styles.audioIndicatorItem}>
              <AppIconComponent
                name={muted ? iconMap.volumeOff : iconMap.volumeOn}
                size={hp(3)}
                color={'white'}
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
      );
    },
    [
      audioIndicatorAnimatedStyle,
      controlVisible,
      currentVisibleIndex,
      muted,
      onLongPress,
      onPress,
      onPressOut,
      styles.audioIndicator,
      styles.audioIndicatorItem,
      styles.momentItemContainer,
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
        setCurrentVisbleIndex(viewableItems[0].index);

        videoRef.current[currentIndexRef.current]?.setNativeProps({ paused: true });
        videoRef.current[currentIndexRef.current]?.seek(0);
        currentIndexRef.current = viewableItems[0].index;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return momentView.loaded ? (
    <AppResponseView color={'white'} status={momentView.reqStatus} style={styles.container}>
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

const makeStyles = () =>
  StyleSheet.create({
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
