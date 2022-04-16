import {
  View,
  FlatListProps,
  FlatList,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'enevti-app/navigation';
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { StakerItem } from 'enevti-app/types/service/enevti/stake';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp } from 'enevti-app/utils/imageRatio';
import { RootState } from 'enevti-app/store/state';
import {
  isStakePoolUndefined,
  selectStakePoolOwnerView,
  selectStakePoolView,
} from 'enevti-app/store/slices/ui/view/stakePool';
import {
  loadStakePool,
  unloadStakePool,
} from 'enevti-app/store/middleware/thunk/ui/view/stakePool';
import { AppAsyncThunk } from 'enevti-app/types/store/AppAsyncThunk';
import AppStakerItem, {
  STAKER_ITEM_HEIGHT_PERCENTAGE,
} from 'enevti-app/components/organism/stake/AppStakerItem';
import AppStakeButton from 'enevti-app/components/organism/stake/AppStakeButton';
import { LIST_ITEM_VERTICAL_MARGIN_PERCENTAGE } from 'enevti-app/components/molecules/list/AppListItem';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';

const AnimatedFlatList =
  Animated.createAnimatedComponent<FlatListProps<StakerItem>>(FlatList);

interface AppStakePoolProps {
  route: RouteProp<RootStackParamList, 'StakePool'>;
}

export default function AppStakePool({ route }: AppStakePoolProps) {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(), []);
  const extendedTreshold = hp('10%', insets);

  const [menuVisible, setMenuVisible] = React.useState<boolean>(false);
  const [extended, setExtended] = React.useState(true);
  const UIExtended = useSharedValue(true);

  const stakePool = useSelector((state: RootState) =>
    selectStakePoolView(state, route.params.arg),
  );

  const stakePoolUndefined = useSelector((state: RootState) =>
    isStakePoolUndefined(state, route.params.arg),
  );

  const owner = useSelector((state: RootState) =>
    selectStakePoolOwnerView(state, route.params.arg),
  );

  const onStakePoolScreenLoaded = React.useCallback(
    (reload: boolean = false) => {
      return dispatch(loadStakePool({ routeParam: route.params, reload }));
    },
    [dispatch, route.params],
  ) as AppAsyncThunk;

  const handleRefresh = React.useCallback(async () => {
    onStakePoolScreenLoaded(true);
  }, [onStakePoolScreenLoaded]);

  React.useEffect(() => {
    const promise = onStakePoolScreenLoaded();
    return function cleanup() {
      dispatch(unloadStakePool(route.params.arg));
      promise.abort();
    };
  }, [onStakePoolScreenLoaded, dispatch, route.params.arg]);

  const onStakeButtonDismiss = React.useCallback(() => {
    setMenuVisible(false);
  }, []);

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

  const onStakeButtonPress = React.useCallback(async () => {
    setMenuVisible(!menuVisible);
  }, [menuVisible]);

  const renderItem = React.useCallback(
    ({ item }: any) => <AppStakerItem staker={item} />,
    [],
  );

  const keyExtractor = React.useCallback(
    item => item.rank.toString() + item.persona.address,
    [],
  );

  const getItemLayout = React.useCallback(
    (_, index) => ({
      length:
        STAKER_ITEM_HEIGHT_PERCENTAGE + LIST_ITEM_VERTICAL_MARGIN_PERCENTAGE,
      offset:
        (STAKER_ITEM_HEIGHT_PERCENTAGE + LIST_ITEM_VERTICAL_MARGIN_PERCENTAGE) *
        index,
      index,
    }),
    [],
  );

  const refreshControl = React.useMemo(
    () => <RefreshControl refreshing={false} onRefresh={handleRefresh} />,
    [handleRefresh],
  );

  return !stakePoolUndefined ? (
    <View style={styles.stakePoolContainer}>
      <AnimatedFlatList
        onScroll={onScroll}
        scrollEventThrottle={16}
        data={stakePool?.staker}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        removeClippedSubviews={true}
        initialNumToRender={10}
        maxToRenderPerBatch={20}
        updateCellsBatchingPeriod={100}
        windowSize={5}
        getItemLayout={getItemLayout}
        refreshControl={refreshControl}
      />
      <AppStakeButton
        persona={owner}
        visible={menuVisible}
        extended={extended}
        onPress={onStakeButtonPress}
        onModalDismiss={onStakeButtonDismiss}
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
    stakePoolContainer: {
      flex: 1,
    },
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      flex: 1,
    },
  });
