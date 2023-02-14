import React from 'react';
import { Platform, RefreshControl, ScaledSize, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { FlatGrid, FlatGridProps } from 'react-native-super-grid';
import { NFTBase } from 'enevti-types/chain/nft';
import { PROFILE_HEADER_HEIGHT_PERCENTAGE } from 'enevti-app/components/organism/profile/AppProfileHeader';
import { TOP_TABBAR_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppTopTabBar';
import { hp, SafeAreaInsets, windowFullHeight, wp } from 'enevti-app/utils/layout/imageRatio';
import AppNFTRenderer from 'enevti-app/components/molecules/nft/AppNFTRenderer';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import AppMessageEmpty from 'enevti-app/components/molecules/message/AppMessageEmpty';
import { loadMoreOwned } from 'enevti-app/store/middleware/thunk/ui/view/profile';
import { useDispatch, useSelector } from 'react-redux';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { RootState } from 'enevti-app/store/state';
import {
  selectMyProfileView,
  selectMyProfileViewOwned,
  selectMyProfileViewRender,
  setMyProfileRender,
} from 'enevti-app/store/slices/ui/view/myProfile';
import {
  selectProfileView,
  selectProfileViewOwned,
  selectProfileViewRender,
  setProfileRender,
} from 'enevti-app/store/slices/ui/view/profile';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import { TABBAR_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppTabBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedFlatGrid = Animated.createAnimatedComponent<FlatGridProps<NFTBase>>(FlatGrid);

interface OwnedNFTComponentProps {
  navigation: StackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'Profile'>;
  onScroll?: any;
  onMomentumScroll?: any;
  headerHeight?: any;
  onMounted?: () => void;
  onRefresh?: () => void;
  scrollEnabled?: boolean;
  disableHeaderAnimation?: boolean;
  isMyProfile?: boolean;
  withFooterSpace?: boolean;
}

function Component(
  {
    navigation,
    route,
    onScroll,
    onMomentumScroll,
    headerHeight,
    onMounted,
    onRefresh,
    scrollEnabled,
    disableHeaderAnimation = false,
    isMyProfile = false,
    withFooterSpace = false,
  }: OwnedNFTComponentProps,
  ref: any,
) {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const dimension = useWindowDimensions();
  const mounted = React.useRef<boolean>(false);
  const [displayed, setDisplayed] = React.useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  const total = useSelector((state: RootState) =>
    isMyProfile
      ? selectMyProfileView(state).ownedPagination.version
      : selectProfileView(state, route.key).ownedPagination.version,
  );
  const data = useSelector((state: RootState) =>
    isMyProfile ? selectMyProfileViewOwned(state) : selectProfileViewOwned(state, route.key),
  );
  const render = useSelector((state: RootState) =>
    isMyProfile ? selectMyProfileViewRender(state) : selectProfileViewRender(state, route.key),
  );

  useFocusEffect(
    React.useCallback(() => {
      if (!render.owned) {
        isMyProfile
          ? dispatch(setMyProfileRender({ owned: true }))
          : dispatch(setProfileRender({ key: route.key, value: { owned: true } }));
      }
    }, [dispatch, isMyProfile, render.owned, route.key]),
  );

  const styles = React.useMemo(
    () => makeStyles(headerHeight, displayed, disableHeaderAnimation, insets, dimension),
    [headerHeight, displayed, disableHeaderAnimation, insets, dimension],
  );
  const isScrollEnabled = React.useMemo(() => (refreshing ? false : scrollEnabled), [refreshing, scrollEnabled]);
  const spacing = React.useMemo(() => wp('0.5%'), []);
  const itemDimension = React.useMemo(() => wp('30%'), []);
  const progressViewOffset = React.useMemo(
    () =>
      Platform.OS === 'ios'
        ? headerHeight
        : hp(PROFILE_HEADER_HEIGHT_PERCENTAGE + TOP_TABBAR_HEIGHT_PERCENTAGE) + headerHeight,
    [headerHeight],
  );

  const handleRefresh = React.useCallback(() => {
    setRefreshing(true);
    onRefresh && onRefresh();
    if (mounted.current) {
      setRefreshing(false);
    }
  }, [onRefresh]);

  const refreshControl = React.useMemo(
    () => <RefreshControl refreshing={false} onRefresh={handleRefresh} progressViewOffset={progressViewOffset} />,
    [handleRefresh, progressViewOffset],
  );

  const emptyComponent = React.useMemo(
    () =>
      render.owned ? (
        <AppMessageEmpty />
      ) : (
        <View style={styles.loaderContainer}>
          <AppActivityIndicator animating />
        </View>
      ),
    [render.owned, styles.loaderContainer],
  );

  const renderItem = React.useCallback(
    ({ item }) => <AppNFTRenderer imageSize={'m'} nft={item} width={itemDimension} navigation={navigation} />,
    [itemDimension, navigation],
  );

  const keyExtractor = React.useCallback((item: NFTBase) => item.id, []);

  React.useEffect(() => {
    if (ref && ref.current) {
      mounted.current = true;
      setDisplayed(true);
      onMounted && onMounted();
    }
    return function cleanup() {
      mounted.current = false;
    };
  }, [ref, onMounted, refreshing]);

  const handleLoadMore = React.useCallback(() => {
    dispatch(loadMoreOwned({ route, isMyProfile, reload: true }));
  }, [dispatch, route, isMyProfile]);

  const footerComponent = React.useMemo(
    () => (
      <View style={{ marginBottom: withFooterSpace ? hp(TABBAR_HEIGHT_PERCENTAGE) : hp(0) }}>
        {render.owned && total !== data.length && data.length !== 0 ? (
          <AppActivityIndicator style={{ marginVertical: hp('3%') }} />
        ) : null}
      </View>
    ),
    [withFooterSpace, render.owned, total, data.length],
  );

  return (
    <AnimatedFlatGrid
      ref={ref}
      onScroll={onScroll}
      onMomentumScrollBegin={onMomentumScroll}
      scrollEnabled={isScrollEnabled}
      scrollEventThrottle={16}
      contentContainerStyle={styles.contentContainerStyle}
      spacing={spacing}
      showsVerticalScrollIndicator={false}
      itemDimension={itemDimension}
      data={render.owned ? data : []}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      refreshControl={refreshControl}
      ListEmptyComponent={emptyComponent}
      ListFooterComponent={footerComponent}
      onEndReachedThreshold={0.1}
      onEndReached={handleLoadMore}
    />
  );
}

const makeStyles = (
  headerHeight: number,
  displayed: boolean,
  disableHeaderAnimation: boolean,
  insets: SafeAreaInsets,
  dimension: ScaledSize,
) =>
  StyleSheet.create({
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '20%',
    },
    contentContainerStyle: {
      paddingTop: hp(PROFILE_HEADER_HEIGHT_PERCENTAGE + TOP_TABBAR_HEIGHT_PERCENTAGE) + headerHeight,
      minHeight:
        windowFullHeight(dimension, insets) +
        hp(PROFILE_HEADER_HEIGHT_PERCENTAGE) +
        (disableHeaderAnimation ? 0 : headerHeight),
      display: displayed ? undefined : 'none',
    },
  });

const OwnedNFTComponent = React.forwardRef(Component);
export default OwnedNFTComponent;
