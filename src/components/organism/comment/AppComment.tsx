import { View, StyleSheet, FlatListProps, FlatList, RefreshControl } from 'react-native';
import React from 'react';
import AppCommentItem from 'enevti-app/components/molecules/comment/AppCommentItem';
import AppCommentBox from 'enevti-app/components/molecules/comment/AppCommentBox';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'enevti-app/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppAsyncThunk } from 'enevti-app/types/ui/store/AppAsyncThunk';
import { loadComment, unloadComment, loadMoreComment } from 'enevti-app/store/middleware/thunk/ui/view/comment';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootState } from 'enevti-app/store/state';
import { CommentItem, isCommentUndefined, selectCommentView } from 'enevti-app/store/slices/ui/view/comment';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import AppMessageEmpty from 'enevti-app/components/molecules/message/AppMessageEmpty';
import { hp } from 'enevti-app/utils/imageRatio';
import Animated from 'react-native-reanimated';

const AnimatedFlatList = Animated.createAnimatedComponent<FlatListProps<CommentItem>>(FlatList);

interface AppCommentProps {
  navigation: StackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'Comment'>;
}

export default function AppComment({ route, navigation }: AppCommentProps) {
  const dispatch = useDispatch();
  const styles = React.useMemo(() => makeStyles(), []);

  const comment = useSelector((state: RootState) => selectCommentView(state, route.key));
  const commentUndefined = useSelector((state: RootState) => isCommentUndefined(state, route.key));

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
    dispatch(loadMoreComment({ route, reload: true }));
  }, [dispatch, route]);

  React.useEffect(() => {
    const promise = onCommentScreenLoaded();
    return function cleanup() {
      dispatch(unloadComment(route));
      promise.abort();
    };
  }, [dispatch, route, onCommentScreenLoaded]);

  const renderItem = React.useCallback(
    ({ item }: any) => <AppCommentItem comment={item} navigation={navigation} />,
    [navigation],
  );

  const keyExtractor = React.useCallback(item => item.id.toString(), []);

  const refreshControl = React.useMemo(
    () => <RefreshControl refreshing={false} onRefresh={handleRefresh} />,
    [handleRefresh],
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
        removeClippedSubviews={true}
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
      <AppCommentBox route={route} />
    </View>
  ) : (
    <View style={styles.loaderContainer}>
      <AppActivityIndicator animating />
    </View>
  );
}

const makeStyles = () =>
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
    },
    listContentEmptyContainer: {
      flex: 0.9,
      justifyContent: 'center',
    },
  });
