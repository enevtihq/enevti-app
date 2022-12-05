import React from 'react';
import { Platform, RefreshControl, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { FlatGrid, FlatGridProps } from 'react-native-super-grid';
import { PROFILE_HEADER_HEIGHT_PERCENTAGE } from 'enevti-app/components/organism/profile/AppProfileHeader';
import { TOP_TABBAR_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppTopTabBar';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/layout/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import AppMessageEmpty from 'enevti-app/components/molecules/message/AppMessageEmpty';
import { loadMoreMoment } from 'enevti-app/store/middleware/thunk/ui/view/profile';
import { useDispatch, useSelector } from 'react-redux';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { RootState } from 'enevti-app/store/state';
import {
  selectMyProfileView,
  selectMyProfileViewMomentCreated,
  selectMyProfileViewRender,
  setMyProfileRender,
} from 'enevti-app/store/slices/ui/view/myProfile';
import {
  selectProfileView,
  selectProfileViewMomentCreated,
  selectProfileViewRender,
  setProfileRender,
} from 'enevti-app/store/slices/ui/view/profile';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import { TABBAR_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppTabBar';
import { MomentBase } from 'enevti-app/types/core/chain/moment';
import AppMomentItem from '../../moment/AppMomentItem';

const AnimatedFlatGrid = Animated.createAnimatedComponent<FlatGridProps<MomentBase>>(FlatGrid);

interface MomentCreatedListComponentProps {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  }: MomentCreatedListComponentProps,
  ref: any,
) {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const mounted = React.useRef<boolean>(false);
  const [displayed, setDisplayed] = React.useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  const total = useSelector((state: RootState) =>
    isMyProfile
      ? selectMyProfileView(state).momentPagination.version
      : selectProfileView(state, route.key).momentPagination.version,
  );
  const data = useSelector((state: RootState) =>
    isMyProfile ? selectMyProfileViewMomentCreated(state) : selectProfileViewMomentCreated(state, route.key),
  );
  const render = useSelector((state: RootState) =>
    isMyProfile ? selectMyProfileViewRender(state) : selectProfileViewRender(state, route.key),
  );

  useFocusEffect(
    React.useCallback(() => {
      if (!render.momentCreated) {
        isMyProfile
          ? dispatch(setMyProfileRender({ momentCreated: true }))
          : dispatch(setProfileRender({ key: route.key, value: { momentCreated: true } }));
      }
    }, [dispatch, isMyProfile, render.momentCreated, route.key]),
  );

  const styles = React.useMemo(
    () => makeStyles(insets, headerHeight, displayed, disableHeaderAnimation),
    [insets, headerHeight, displayed, disableHeaderAnimation],
  );
  const isScrollEnabled = React.useMemo(() => (refreshing ? false : scrollEnabled), [refreshing, scrollEnabled]);
  const spacing = React.useMemo(() => wp('0.583%'), []);
  const itemDimension = React.useMemo(() => wp('30%', insets), [insets]);
  const progressViewOffset = React.useMemo(
    () =>
      Platform.OS === 'ios'
        ? headerHeight
        : hp(PROFILE_HEADER_HEIGHT_PERCENTAGE + TOP_TABBAR_HEIGHT_PERCENTAGE, insets) + headerHeight,
    [headerHeight, insets],
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
      render.momentCreated ? (
        <AppMessageEmpty />
      ) : (
        <View style={styles.loaderContainer}>
          <AppActivityIndicator animating />
        </View>
      ),
    [render.momentCreated, styles.loaderContainer],
  );

  const renderItem = React.useCallback(
    ({ item }) => <AppMomentItem showLike width={32.75} moment={item} onPress={() => {}} style={styles.moment} />,
    [styles.moment],
  );

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
    dispatch(loadMoreMoment({ route, isMyProfile, reload: true }));
  }, [dispatch, route, isMyProfile]);

  const footerComponent = React.useMemo(
    () => (
      <View style={{ marginBottom: withFooterSpace ? hp(TABBAR_HEIGHT_PERCENTAGE) : hp(0) }}>
        {render.momentCreated && total !== data.length && data.length !== 0 ? (
          <AppActivityIndicator style={{ marginVertical: hp('3%') }} />
        ) : null}
      </View>
    ),
    [withFooterSpace, render.momentCreated, total, data.length],
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
      data={render.momentCreated ? data : []}
      renderItem={renderItem}
      refreshControl={refreshControl}
      ListEmptyComponent={emptyComponent}
      ListFooterComponent={footerComponent}
      onEndReachedThreshold={0.1}
      onEndReached={handleLoadMore}
    />
  );
}

const makeStyles = (
  insets: SafeAreaInsets,
  headerHeight: number,
  displayed: boolean,
  disableHeaderAnimation: boolean,
) =>
  StyleSheet.create({
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '20%',
    },
    contentContainerStyle: {
      paddingTop: hp(PROFILE_HEADER_HEIGHT_PERCENTAGE + TOP_TABBAR_HEIGHT_PERCENTAGE, insets) + headerHeight,
      minHeight:
        hp(PROFILE_HEADER_HEIGHT_PERCENTAGE + 100, insets) +
        (Platform.OS === 'android' ? insets.top : 0) +
        (disableHeaderAnimation ? 0 : headerHeight),
      display: displayed ? undefined : 'none',
    },
    moment: {
      borderRadius: 0,
    },
  });

const MomentCreatedListComponent = React.forwardRef(Component);
export default MomentCreatedListComponent;
