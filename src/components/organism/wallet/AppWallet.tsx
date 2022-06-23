import { View, StyleSheet, FlatListProps, FlatList, RefreshControl } from 'react-native';
import React from 'react';
import AppWalletHeader from './AppWalletHeader';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'enevti-app/store/state';
import { isWalletUndefined, selectWalletViewHistory } from 'enevti-app/store/slices/ui/view/wallet';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import { loadMoreTransactionHistory, loadWallet, unloadWallet } from 'enevti-app/store/middleware/thunk/ui/view/wallet';
import { AppAsyncThunk } from 'enevti-app/types/ui/store/AppAsyncThunk';
import Animated from 'react-native-reanimated';
import { TransactionServiceItem } from 'enevti-app/types/core/service/wallet';
import { LIST_ITEM_VERTICAL_MARGIN_PERCENTAGE } from 'enevti-app/components/molecules/list/AppListItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp } from 'enevti-app/utils/imageRatio';
import AppMessageEmpty from 'enevti-app/components/molecules/message/AppMessageEmpty';
import AppWalletTransactionHistoryItem from './AppWalletTransactionHistoryItem';

const TRANSACTION_HISTORY_ITEM_HEIGHT = 9;

const AnimatedFlatList = Animated.createAnimatedComponent<FlatListProps<TransactionServiceItem>>(FlatList);

interface AppWalletProps {
  navigation: StackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'Wallet'>;
}

export default function AppWallet({ navigation, route }: AppWalletProps) {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(), []);

  const transactionHistoryRef = React.useRef<any>();
  const itemHeight = React.useMemo(
    () => hp(TRANSACTION_HISTORY_ITEM_HEIGHT + LIST_ITEM_VERTICAL_MARGIN_PERCENTAGE, insets),
    [insets],
  );

  const transactionHistory = useSelector((state: RootState) => selectWalletViewHistory(state, route.key));
  const walletUndefined = useSelector((state: RootState) => isWalletUndefined(state, route.key));

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

  const keyExtractor = React.useCallback((item: TransactionServiceItem) => item.id, []);

  const getItemLayout = React.useCallback(
    (_, index) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    }),
    [itemHeight],
  );

  const renderItem = React.useCallback(
    ({ item }: { item: TransactionServiceItem }) => <AppWalletTransactionHistoryItem item={item} />,
    [],
  );

  const ListHeaderComponent = React.useMemo(
    () => <AppWalletHeader navigation={navigation} route={route} />,
    [navigation, route],
  );

  const emptyComponent = React.useMemo(() => <AppMessageEmpty />, []);

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
    <View>
      <AnimatedFlatList
        ref={transactionHistoryRef}
        keyExtractor={keyExtractor}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        getItemLayout={getItemLayout}
        data={transactionHistory}
        renderItem={renderItem}
        refreshControl={refreshControl}
        ListEmptyComponent={emptyComponent}
        ListHeaderComponent={ListHeaderComponent}
        removeClippedSubviews={true}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={21}
        onEndReachedThreshold={0.1}
        onEndReached={handleLoadMore}
        contentContainerStyle={styles.listContent}
      />
    </View>
  ) : (
    <View style={styles.loaderContainer}>
      <AppActivityIndicator animating />
    </View>
  );
}

const makeStyles = () =>
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
  });
