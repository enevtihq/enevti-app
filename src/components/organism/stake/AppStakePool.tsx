import { View, FlatListProps, FlatList, RefreshControl, StyleSheet } from 'react-native';
import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'enevti-app/navigation';
import Animated, { runOnJS, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { StakerItem } from 'enevti-app/types/core/chain/stake';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp } from 'enevti-app/utils/imageRatio';
import { RootState } from 'enevti-app/store/state';
import {
  isStakePoolUndefined,
  isThereAnyNewStaker,
  selectStakePoolOwnerView,
  selectStakePoolView,
  setStakePoolVersion,
} from 'enevti-app/store/slices/ui/view/stakePool';
import { loadMoreStaker, loadStakePool, unloadStakePool } from 'enevti-app/store/middleware/thunk/ui/view/stakePool';
import { AppAsyncThunk } from 'enevti-app/types/ui/store/AppAsyncThunk';
import AppStakerItem, { STAKER_ITEM_HEIGHT_PERCENTAGE } from 'enevti-app/components/organism/stake/AppStakerItem';
import AppStakeButton from 'enevti-app/components/organism/stake/AppStakeButton';
import { LIST_ITEM_VERTICAL_MARGIN_PERCENTAGE } from 'enevti-app/components/molecules/list/AppListItem';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import { hideModalLoader, showModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import usePaymentCallback from 'enevti-app/utils/hook/usePaymentCallback';
import { useTranslation } from 'react-i18next';
import AppResponseView from '../view/AppResponseView';
import AppMessageEmpty from 'enevti-app/components/molecules/message/AppMessageEmpty';
import AppFloatingNotifButton from 'enevti-app/components/molecules/button/AppFloatingNotifButton';
import { appSocket } from 'enevti-app/utils/network';
import { routeParamToAddress } from 'enevti-app/service/enevti/persona';
import { reduceStakerUpdates } from 'enevti-app/store/middleware/thunk/socket/stakePool/stakerUpdates';
import { Socket } from 'socket.io-client';
import { PaymentStatus } from 'enevti-app/types/ui/store/Payment';

const AnimatedFlatList = Animated.createAnimatedComponent<FlatListProps<StakerItem>>(FlatList);

interface AppStakePoolProps {
  route: RouteProp<RootStackParamList, 'StakePool'>;
}

export default function AppStakePool({ route }: AppStakePoolProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(), []);
  const extendedTreshold = hp('10%', insets);

  const [extended, setExtended] = React.useState(true);
  const UIExtended = useSharedValue(true);

  const stakePool = useSelector((state: RootState) => selectStakePoolView(state, route.key));
  const stakePoolUndefined = useSelector((state: RootState) => isStakePoolUndefined(state, route.key));
  const newStaker = useSelector((state: RootState) => isThereAnyNewStaker(state, route.key));
  const owner = useSelector((state: RootState) => selectStakePoolOwnerView(state, route.key));

  const socket = React.useRef<Socket | undefined>();

  React.useEffect(() => {
    const subscribe = async () => {
      const address = await routeParamToAddress(route.params);
      socket.current = appSocket(address);
      socket.current.on('stakerUpdates', (payload: any) => dispatch(reduceStakerUpdates(payload, route.key)));
    };
    subscribe();
    return function cleanup() {
      socket.current?.disconnect();
    };
  }, [route.params, route.key, dispatch]);

  const onStakePoolScreenLoaded = React.useCallback(
    (reload: boolean = false) => {
      return dispatch(loadStakePool({ route, reload }));
    },
    [dispatch, route],
  ) as AppAsyncThunk;

  const handleRefresh = React.useCallback(async () => {
    onStakePoolScreenLoaded(true);
  }, [onStakePoolScreenLoaded]);

  const handleUpdateClose = React.useCallback(() => {
    dispatch(setStakePoolVersion({ key: route.key, value: Date.now() }));
  }, [dispatch, route.key]);

  React.useEffect(() => {
    const promise = onStakePoolScreenLoaded();
    return function cleanup() {
      dispatch(unloadStakePool(route));
      promise.abort();
    };
  }, [onStakePoolScreenLoaded, dispatch, route]);

  const paymentCondition = React.useCallback(
    (paymentStatus: PaymentStatus) => {
      return (
        paymentStatus.action !== undefined &&
        ['addStake'].includes(paymentStatus.action) &&
        paymentStatus.key === route.key
      );
    },
    [route.key],
  );

  const paymentProcessCallback = React.useCallback(() => {
    dispatch(showModalLoader());
  }, [dispatch]);

  const paymentSuccessCallback = React.useCallback(() => {
    dispatch(hideModalLoader());
    dispatch(showSnackbar({ mode: 'info', text: t('payment:success') }));
  }, [dispatch, t]);

  const paymentErrorCallback = React.useCallback(() => dispatch(hideModalLoader()), [dispatch]);

  usePaymentCallback({
    condition: paymentCondition,
    onProcess: paymentProcessCallback,
    onSuccess: paymentSuccessCallback,
    onError: paymentErrorCallback,
  });

  const setJSExtended = (value: boolean) => {
    setExtended(value);
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      if (event.contentOffset.y > extendedTreshold) {
        if (UIExtended.value) {
          runOnJS(setJSExtended)(false);
          UIExtended.value = false;
        }
      } else {
        if (!UIExtended.value) {
          runOnJS(setJSExtended)(true);
          UIExtended.value = true;
        }
      }
    },
  });

  const renderItem = React.useCallback(({ item }: any) => <AppStakerItem staker={item} />, []);

  const keyExtractor = React.useCallback(item => item.rank.toString() + item.persona.address, []);

  const getItemLayout = React.useCallback(
    (_, index) => ({
      length: STAKER_ITEM_HEIGHT_PERCENTAGE + LIST_ITEM_VERTICAL_MARGIN_PERCENTAGE,
      offset: (STAKER_ITEM_HEIGHT_PERCENTAGE + LIST_ITEM_VERTICAL_MARGIN_PERCENTAGE) * index,
      index,
    }),
    [],
  );

  const emptyComponent = React.useMemo(() => <AppMessageEmpty />, []);

  const refreshControl = React.useMemo(
    () => <RefreshControl refreshing={false} onRefresh={handleRefresh} />,
    [handleRefresh],
  );

  const contentContainerStyle = React.useMemo(
    () =>
      stakePool && stakePool.staker && stakePool.staker.length > 0
        ? styles.listContentContainer
        : styles.listContentEmptyContainer,
    [stakePool, styles.listContentContainer, styles.listContentEmptyContainer],
  );

  const handleLoadMore = React.useCallback(() => {
    dispatch(loadMoreStaker({ route, reload: true }));
  }, [dispatch, route]);

  const footerComponent = React.useMemo(
    () =>
      stakePool.stakerPagination &&
      stakePool.staker &&
      stakePool.stakerPagination.version !== stakePool.staker.length &&
      stakePool.staker.length !== 0 ? (
        <AppActivityIndicator style={{ marginVertical: hp('3%') }} />
      ) : null,
    [stakePool],
  );

  return !stakePoolUndefined ? (
    <AppResponseView onReload={handleRefresh} status={stakePool.reqStatus} style={styles.stakePoolContainer}>
      <AppFloatingNotifButton
        show={newStaker}
        label={t('stake:newStaker')}
        onPress={handleRefresh}
        onClose={handleUpdateClose}
      />
      <AnimatedFlatList
        onScroll={onScroll}
        onMomentumScrollBegin={handleUpdateClose}
        scrollEventThrottle={16}
        data={stakePool?.staker}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        removeClippedSubviews={true}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={21}
        getItemLayout={getItemLayout}
        refreshControl={refreshControl}
        ListEmptyComponent={emptyComponent}
        ListFooterComponent={footerComponent}
        contentContainerStyle={contentContainerStyle}
        onEndReachedThreshold={0.1}
        onEndReached={handleLoadMore}
      />
      <AppStakeButton persona={owner} extended={extended} route={route} />
    </AppResponseView>
  ) : (
    <View style={styles.loaderContainer}>
      <AppActivityIndicator animating />
    </View>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    stakePoolContainer: {
      flex: 1,
    },
    listContentContainer: {
      paddingTop: undefined,
    },
    listContentEmptyContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      flex: 1,
    },
  });
