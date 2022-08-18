import { View, StyleSheet, FlatListProps, FlatList, RefreshControl } from 'react-native';
import React from 'react';
import AppWalletHeader from './AppWalletHeader';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'enevti-app/store/state';
import {
  isThereAnyNewWalletUpdate,
  isWalletUndefined,
  selectWalletViewHistory,
  selectWalletViewHistoryPagination,
  selectWalletViewReqStatus,
  setWalletViewVersion,
} from 'enevti-app/store/slices/ui/view/wallet';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import { loadMoreTransactionHistory, loadWallet, unloadWallet } from 'enevti-app/store/middleware/thunk/ui/view/wallet';
import { AppAsyncThunk } from 'enevti-app/types/ui/store/AppAsyncThunk';
import Animated from 'react-native-reanimated';
import { LIST_ITEM_VERTICAL_MARGIN_PERCENTAGE } from 'enevti-app/components/molecules/list/AppListItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import AppMessageEmpty from 'enevti-app/components/molecules/message/AppMessageEmpty';
import AppWalletTransactionHistoryItem from './AppWalletTransactionHistoryItem';
import { ProfileActivity } from 'enevti-app/types/core/account/profile';
import AppTextBody2 from 'enevti-app/components/atoms/text/AppTextBody2';
import { useTranslation } from 'react-i18next';
import AppResponseView from '../view/AppResponseView';
import AppFloatingNotifButton from 'enevti-app/components/molecules/button/AppFloatingNotifButton';

const TRANSACTION_HISTORY_ITEM_HEIGHT = 9;

const AnimatedFlatList = Animated.createAnimatedComponent<FlatListProps<ProfileActivity>>(FlatList);

interface AppWalletProps {
  navigation: StackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'Wallet'>;
}

export default function AppWallet({ navigation, route }: AppWalletProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(insets), [insets]);

  const transactionHistoryRef = React.useRef<any>();
  const itemHeight = React.useMemo(
    () => hp(TRANSACTION_HISTORY_ITEM_HEIGHT + LIST_ITEM_VERTICAL_MARGIN_PERCENTAGE, insets),
    [insets],
  );

  const transactionHistory = useSelector((state: RootState) => selectWalletViewHistory(state, route.key));
  const transactionHistoryPagination = useSelector((state: RootState) =>
    selectWalletViewHistoryPagination(state, route.key),
  );
  const walletReqStatus = useSelector((state: RootState) => selectWalletViewReqStatus(state, route.key));
  const walletUndefined = useSelector((state: RootState) => isWalletUndefined(state, route.key));
  const newUpdate = useSelector((state: RootState) => isThereAnyNewWalletUpdate(state, route.key));

  const onWalletLoaded = React.useCallback(
    (reload: boolean = false) => {
      return dispatch(loadWallet({ route, reload }));
    },
    [dispatch, route],
  ) as AppAsyncThunk;

  React.useEffect(() => {
    const promise = onWalletLoaded();
    return function cleanup() {
      dispatch(unloadWallet(route));
      promise.abort();
    };
  }, [onWalletLoaded, dispatch, route]);

  const keyExtractor = React.useCallback((item: ProfileActivity) => item.transaction, []);

  const getItemLayout = React.useCallback(
    (_, index) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    }),
    [itemHeight],
  );

  const renderItem = React.useCallback(
    ({ item }: { item: ProfileActivity }) => <AppWalletTransactionHistoryItem item={item} />,
    [],
  );

  const ListHeaderComponent = React.useMemo(
    () => (
      <View>
        <AppWalletHeader navigation={navigation} route={route} />
        <AppTextBody2 style={styles.activityLabel}>{t('wallet:activity')}</AppTextBody2>
      </View>
    ),
    [navigation, route, styles.activityLabel, t],
  );

  const ListFooterComponent = React.useMemo(
    () => (
      <View style={{ marginBottom: hp(18) }}>
        {transactionHistoryPagination.version !== transactionHistory.length && transactionHistory.length !== 0 ? (
          <AppActivityIndicator style={{ marginVertical: hp('3%') }} />
        ) : null}
      </View>
    ),
    [transactionHistory.length, transactionHistoryPagination.version],
  );

  const emptyComponent = React.useMemo(() => <AppMessageEmpty />, []);

  const onUpdateClose = React.useCallback(() => {
    dispatch(setWalletViewVersion({ key: route.key, value: Date.now() }));
  }, [dispatch, route.key]);

  const handleRefresh = React.useCallback(() => {
    onWalletLoaded(true);
  }, [onWalletLoaded]);

  const refreshControl = React.useMemo(
    () => <RefreshControl refreshing={false} onRefresh={handleRefresh} />,
    [handleRefresh],
  );

  const handleLoadMore = React.useCallback(() => {
    dispatch(loadMoreTransactionHistory({ route, reload: true }));
  }, [dispatch, route]);

  return !walletUndefined ? (
    <AppResponseView onReload={handleRefresh} status={walletReqStatus} style={styles.loaderContainer}>
      <AppFloatingNotifButton
        show={newUpdate}
        label={t('wallet:newActivity')}
        onPress={handleRefresh}
        onClose={onUpdateClose}
      />
      <AnimatedFlatList
        ref={transactionHistoryRef}
        onMomentumScrollBegin={onUpdateClose}
        keyExtractor={keyExtractor}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        getItemLayout={getItemLayout}
        data={transactionHistory}
        renderItem={renderItem}
        refreshControl={refreshControl}
        ListEmptyComponent={emptyComponent}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        removeClippedSubviews={true}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={21}
        onEndReachedThreshold={0.1}
        onEndReached={handleLoadMore}
        contentContainerStyle={styles.listContent}
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
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      flex: 1,
    },
    listContent: {
      minHeight: '100%',
    },
    activityLabel: {
      paddingHorizontal: wp('8%', insets),
      marginVertical: hp('2%', insets),
    },
  });
