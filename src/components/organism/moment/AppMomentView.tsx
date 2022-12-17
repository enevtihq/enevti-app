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

  const momentListRef = React.useRef<FlatList>(null);
  const isLongPressRef = React.useRef<boolean>(false);
  const momentView = useSelector((state: RootState) => selectMomentView(state, route.key));

  const onLongPress = React.useCallback(() => {
    onLongPressWorklet();
    isLongPressRef.current = true;
    setControlVisible(false);
  }, [onLongPressWorklet]);

  const onPressOut = React.useCallback(() => {
    if (isLongPressRef.current) {
      setControlVisible(true);
      onLongPressOutWorklet();
      isLongPressRef.current = false;
      return;
    }
    setMuted(old => !old);
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
        <Pressable onLongPress={onLongPress} onPressOut={onPressOut} style={styles.momentItemContainer}>
          <Video
            repeat
            poster={IPFStoURL(item.cover.cid)}
            paused={!controlVisible || currentVisibleIndex !== index}
            source={{ uri: IPFStoURL(item.data.cid) }}
            style={styles.momentItemContainer}
            resizeMode={'contain'}
          />
        </Pressable>
      );
    },
    [controlVisible, currentVisibleIndex, onLongPress, onPressOut, styles.momentItemContainer],
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

  const onViewableItemsChanged = React.useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentVisbleIndex(viewableItems[0].index);
    }
  }, []);

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
  });
