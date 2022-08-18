import { View, StyleSheet, FlatListProps, FlatList, RefreshControl, TextInput, Platform } from 'react-native';
import React from 'react';
import AppCommentItem from 'enevti-app/components/molecules/comment/AppCommentItem';
import AppCommentBox from 'enevti-app/components/molecules/comment/AppCommentBox';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'enevti-app/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppAsyncThunk } from 'enevti-app/types/ui/store/AppAsyncThunk';
import {
  loadComment,
  unloadComment,
  loadMoreComment,
  setCommentById,
  addCommentLikeById,
  addReplyLikeById,
} from 'enevti-app/store/middleware/thunk/ui/view/comment';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootState } from 'enevti-app/store/state';
import { CommentItem, isCommentUndefined, selectCommentView, setReply } from 'enevti-app/store/slices/ui/view/comment';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import AppMessageEmpty from 'enevti-app/components/molecules/message/AppMessageEmpty';
import { hp } from 'enevti-app/utils/imageRatio';
import Animated from 'react-native-reanimated';
import { getCollectionIdFromRouteParam } from 'enevti-app/service/enevti/collection';
import { getNFTIdFromRouteParam } from 'enevti-app/service/enevti/nft';
import { selectKeyboardStatus } from 'enevti-app/store/slices/ui/global/keyboard';
import { directPayLikeComment } from 'enevti-app/store/middleware/thunk/payment/direct/directPayLikeComment';
import usePaymentCallback from 'enevti-app/utils/hook/usePaymentCallback';
import { PaymentStatus } from 'enevti-app/types/ui/store/Payment';
import { useKeyboard } from 'enevti-app/utils/hook/useKeyboard';
import { directPayLikeReply } from 'enevti-app/store/middleware/thunk/payment/direct/directPayLikeReply';

const AnimatedFlatList = Animated.createAnimatedComponent<FlatListProps<CommentItem>>(FlatList);

interface AppCommentProps {
  navigation: StackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'Comment'>;
}

export default function AppComment({ route, navigation }: AppCommentProps) {
  const dispatch = useDispatch();
  const { keyboardHeight } = useKeyboard();
  const keyboardState = useSelector(selectKeyboardStatus);
  const styles = React.useMemo(() => makeStyles(keyboardState, keyboardHeight), [keyboardState, keyboardHeight]);

  const [targetId, setTargetId] = React.useState<string>('');
  const comment = useSelector((state: RootState) => selectCommentView(state, route.key));
  const commentUndefined = useSelector((state: RootState) => isCommentUndefined(state, route.key));
  const commentBoxInputRef = React.useRef<TextInput>(null);
  const paymentThunkRef = React.useRef<any>();

  const prepareTargetId = React.useCallback(async () => {
    if (route.params.type === 'collection') {
      const id = await getCollectionIdFromRouteParam(route.params);
      setTargetId(id);
    } else if (route.params.type === 'nft') {
      const id = await getNFTIdFromRouteParam(route.params);
      setTargetId(id);
    }
  }, [route.params]);

  const onCommentScreenLoaded = React.useCallback(
    (reload: boolean = false) => {
      return dispatch(loadComment({ route, reload }));
    },
    [dispatch, route],
  ) as AppAsyncThunk;

  const handleRefresh = React.useCallback(async () => {
    onCommentScreenLoaded(true);
  }, [onCommentScreenLoaded]);

  const handleLoadMore = React.useCallback(() => {
    dispatch(loadMoreComment({ route }));
  }, [dispatch, route]);

  const onLikeCommentPress = React.useCallback(
    (id: string, key: string, target: string) => {
      dispatch(setCommentById({ route, id, comment: { isLiking: true } }));
      paymentThunkRef.current = dispatch(directPayLikeComment({ id, key, route, target }));
    },
    [dispatch, route],
  );

  const onLikeReplyPress = React.useCallback(
    (id: string, commentIndex: number, replyIndex: number, key: string, target: string) => {
      dispatch(setReply({ key: route.key, commentIndex, replyIndex, value: { isLiking: true } }));
      paymentThunkRef.current = dispatch(directPayLikeReply({ id, commentIndex, replyIndex, key, route, target }));
    },
    [dispatch, route],
  );

  const paymentCondition = React.useCallback(
    (paymentStatus: PaymentStatus) => {
      return (
        paymentStatus.action !== undefined &&
        ['likeComment', 'likeReply'].includes(paymentStatus.action) &&
        paymentStatus.key === route.key
      );
    },
    [route.key],
  );

  const paymentIdleCallback = React.useCallback(
    (paymentStatus: PaymentStatus) => {
      switch (paymentStatus.action) {
        case 'likeComment':
          dispatch(setCommentById({ route, id: paymentStatus.id, comment: { isLiking: false } }));
          break;
        case 'likeReply':
          dispatch(
            setReply({
              key: route.key,
              commentIndex: Number(paymentStatus.id.split(':')[0]),
              replyIndex: Number(paymentStatus.id.split(':')[1]),
              value: { isLiking: false },
            }),
          );
          break;
        default:
          break;
      }
    },
    [dispatch, route],
  );

  const paymentSuccessCallback = React.useCallback(
    async (paymentStatus: PaymentStatus) => {
      switch (paymentStatus.action) {
        case 'likeComment':
          dispatch(addCommentLikeById({ route, id: paymentStatus.id }));
          dispatch(setCommentById({ route, id: paymentStatus.id, comment: { liked: true } }));
          break;
        case 'likeReply':
          dispatch(
            addReplyLikeById({
              route,
              commentIndex: Number(paymentStatus.id.split(':')[0]),
              replyIndex: Number(paymentStatus.id.split(':')[1]),
            }),
          );
          dispatch(
            setReply({
              key: route.key,
              commentIndex: Number(paymentStatus.id.split(':')[0]),
              replyIndex: Number(paymentStatus.id.split(':')[1]),
              value: { liked: true },
            }),
          );
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
    prepareTargetId();
    const promise = onCommentScreenLoaded();
    return function cleanup() {
      dispatch(unloadComment(route));
      promise.abort();
      paymentThunkRef.current?.abort();
    };
  }, [dispatch, route, onCommentScreenLoaded, prepareTargetId]);

  const renderItem = React.useCallback(
    ({ item, index }: any) => (
      <AppCommentItem
        commentBoxInputRef={commentBoxInputRef}
        route={route}
        index={index}
        comment={item}
        navigation={navigation}
        onLikeCommentPress={onLikeCommentPress}
        onLikeReplyPress={onLikeReplyPress}
      />
    ),
    [navigation, route, onLikeCommentPress, onLikeReplyPress],
  );

  const keyExtractor = React.useCallback(item => item.id.toString(), []);

  const refreshControl = React.useMemo(
    () => <RefreshControl refreshing={false} onRefresh={keyboardState === 'hide' ? handleRefresh : undefined} />,
    [handleRefresh, keyboardState],
  );

  const emptyComponent = React.useMemo(() => <AppMessageEmpty />, []);

  const contentContainerStyle = React.useMemo(
    () =>
      comment && comment.comment && comment.comment.length > 0
        ? styles.listContentContainer
        : styles.listContentEmptyContainer,
    [comment, styles.listContentContainer, styles.listContentEmptyContainer],
  );

  const footerComponent = React.useMemo(
    () =>
      comment.commentPagination &&
      comment.comment &&
      comment.commentPagination.version !== comment.comment.length &&
      comment.comment.length !== 0 ? (
        <AppActivityIndicator style={{ marginVertical: hp('3%') }} />
      ) : null,
    [comment],
  );

  return !commentUndefined ? (
    <View style={styles.container}>
      <AnimatedFlatList
        scrollEventThrottle={16}
        data={comment.comment}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={21}
        refreshControl={refreshControl}
        ListEmptyComponent={emptyComponent}
        ListFooterComponent={footerComponent}
        contentContainerStyle={contentContainerStyle}
        onEndReachedThreshold={0.1}
        onEndReached={handleLoadMore}
      />
      <AppCommentBox inputRef={commentBoxInputRef} route={route} target={targetId} />
    </View>
  ) : (
    <View style={styles.loaderContainer}>
      <AppActivityIndicator animating />
    </View>
  );
}

const makeStyles = (keyboardState: 'show' | 'hide', keyboardHeight: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '90%',
    },
    listContentContainer: {
      paddingTop: undefined,
      paddingBottom: hp(14) + (keyboardState === 'show' && Platform.OS === 'ios' ? keyboardHeight : 0),
    },
    listContentEmptyContainer: {
      flex: 1,
      justifyContent: 'center',
    },
  });
