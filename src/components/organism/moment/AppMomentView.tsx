import { Platform, RefreshControl, StyleSheet, useWindowDimensions, View } from 'react-native';
import React from 'react';
import { FlatList } from '@stream-io/flat-list-mvcp';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {
  addMomentLikeById,
  loadMoment,
  loadMoreMoment,
  setMomentById,
  unloadMoment,
} from 'enevti-app/store/middleware/thunk/ui/view/moment';
import { AppAsyncThunk } from 'enevti-app/types/ui/store/AppAsyncThunk';
import { MomentsData, selectMomentView } from 'enevti-app/store/slices/ui/view/moment';
import { RootState } from 'enevti-app/store/state';
import { SafeAreaInsets, wp } from 'enevti-app/utils/layout/imageRatio';
import { EventRegister } from 'react-native-event-listeners';
import AppResponseView from '../view/AppResponseView';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import darkTheme from 'enevti-app/theme/dark';
import usePaymentCallback from 'enevti-app/utils/hook/usePaymentCallback';
import { PaymentStatus } from 'enevti-app/types/ui/store/Payment';
import { directPayLikeMoment } from 'enevti-app/store/middleware/thunk/payment/direct/directPayLikeMoment';
import AppLikeReadyInstance from 'enevti-app/utils/app/likeReady';
import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';
import AppComment from '../comment/AppComment';
import AppMomentViewItem from './AppMomentViewItem';

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
  const dimension = useWindowDimensions();
  const styles = React.useMemo(() => makeStyles(insets, dimension.height), [insets, dimension.height]);
  const snapPoints = React.useMemo(() => ['70%'], []);

  const [muted, setMuted] = React.useState<boolean>(false);
  const [visible, setVisible] = React.useState<number>(0);
  const [commentId, setCommentId] = React.useState<string>('');

  const commentRoute = React.useMemo(
    () => ({
      key: route.key,
      name: route.name,
      params: { type: 'moment', mode: 'id', arg: commentId },
      path: route.path,
    }),
    [commentId, route.key, route.name, route.path],
  ) as unknown as RouteProp<RootStackParamList, 'Comment'>;

  const momentListRef = React.useRef<FlatList>(null);
  const isLongPressRef = React.useRef<boolean>(false);
  const touchedRef = React.useRef<boolean>(false);
  const videoRef = React.useRef<Record<number, any>>({});
  const currentIndexRef = React.useRef<number>(route.params.index ?? 0);
  const paymentThunkRef = React.useRef<any>();

  const momentView = useSelector((state: RootState) => selectMomentView(state, route.key));

  const onLongPress = React.useCallback(() => {
    onLongPressWorklet();
    isLongPressRef.current = true;
    videoRef.current[currentIndexRef.current]?.setNativeProps({ paused: true });
  }, [onLongPressWorklet]);

  const onPress = React.useCallback(() => {
    setMuted(old => !old);
  }, []);

  const onPressOut = React.useCallback(() => {
    if (isLongPressRef.current) {
      onLongPressOutWorklet();
      isLongPressRef.current = false;
      videoRef.current[currentIndexRef.current]?.setNativeProps({ paused: false });
      return;
    }
  }, [onLongPressOutWorklet]);

  const onMomentLoaded = React.useCallback(
    (reload: boolean = false) => dispatch(loadMoment({ route, reload })),
    [dispatch, route],
  ) as AppAsyncThunk;

  const onMomentReload = React.useCallback(async () => {
    await onMomentLoaded(true).unwrap();
    videoRef.current[currentIndexRef.current]?.setNativeProps({ paused: false });
  }, [onMomentLoaded]);

  const onMomentLoadMore = React.useCallback(
    () => dispatch(loadMoreMoment({ route })),
    [dispatch, route],
  ) as AppAsyncThunk;

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

  const listFooter = React.useMemo(
    () =>
      momentView.momentPagination &&
      momentView.momentPagination.version !== momentView.moments.length &&
      momentView.moments.length !== 0 ? (
        <View style={styles.footer}>
          <AppActivityIndicator animating />
        </View>
      ) : undefined,
    [momentView.momentPagination, momentView.moments.length, styles.footer],
  );

  const renderItem = React.useCallback(
    ({ item, index }: { item: MomentsData; index: number }) => {
      return (
        <AppMomentViewItem
          ref={ref => {
            videoRef.current[index] = ref;
          }}
          item={item}
          momentHeight={dimension.height}
          muted={muted}
          navigation={navigation}
          onLongPress={onLongPress}
          onPress={onPress}
          onPressOut={onPressOut}
          onCommentPress={onCommentPress}
          onLikePress={onLikePress}
        />
      );
    },
    [dimension.height, muted, navigation, onLongPress, onPress, onPressOut, onCommentPress, onLikePress],
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

  const onViewableItemsChanged = React.useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      videoRef.current[viewableItems[0].index]?.setNativeProps({ paused: false });

      if (touchedRef.current) {
        videoRef.current[currentIndexRef.current]?.setNativeProps({ paused: true });
        videoRef.current[currentIndexRef.current]?.seek(0);
      } else {
        touchedRef.current = true;
      }

      currentIndexRef.current = viewableItems[0].index;
    }
  }, []);

  return momentView.loaded ? (
    <AppResponseView color={darkTheme.colors.text} status={momentView.reqStatus} style={styles.container}>
      <FlatList
        ref={momentListRef}
        removeClippedSubviews={true}
        windowSize={5}
        maxToRenderPerBatch={5}
        initialNumToRender={1}
        getItemLayout={getItemLayout}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        pagingEnabled={true}
        data={momentView.moments}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        refreshControl={refreshControl}
        style={{ opacity: visible }}
        ListFooterComponent={listFooter}
        onEndReachedThreshold={1}
        onEndReached={onMomentLoadMore}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 80,
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

const makeStyles = (insets: SafeAreaInsets, momentHeight: number) =>
  StyleSheet.create({
    footer: {
      height: momentHeight,
      width: wp(100),
      justifyContent: 'center',
      alignItems: 'center',
    },
    comment: {
      marginBottom: Platform.OS === 'ios' ? insets.bottom : undefined,
    },
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
    container: {
      flex: 1,
    },
  });
