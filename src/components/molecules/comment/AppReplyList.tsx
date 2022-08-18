import { View, StyleSheet, FlatListProps, FlatList, TextInput } from 'react-native';
import React from 'react';
import { CommentItem, ReplyItem } from 'enevti-app/store/slices/ui/view/comment';
import AppTextHeading4 from 'enevti-app/components/atoms/text/AppTextHeading4';
import { t } from 'i18next';
import Color from 'color';
import { SafeAreaInsets, hp, wp } from 'enevti-app/utils/imageRatio';
import { TouchableRipple, useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import AppCommentItemBase from './AppCommentItemBase';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { RouteProp } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { loadMoreReply, loadReply } from 'enevti-app/store/middleware/thunk/ui/view/comment';
import { AppAsyncThunk } from 'enevti-app/types/ui/store/AppAsyncThunk';

const AnimatedFlatList = Animated.createAnimatedComponent<FlatListProps<ReplyItem>>(FlatList);

interface AppReplyListProps {
  index: number;
  comment: CommentItem;
  navigation: StackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'Comment'>;
  commentBoxInputRef: React.RefObject<TextInput>;
}

export default function AppReplyList({ comment, index, navigation, route, commentBoxInputRef }: AppReplyListProps) {
  const dispatch = useDispatch();
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);
  const [isLoadingReply, setIsLoadingReply] = React.useState<boolean>(false);
  const [isLoadingMoreReply, setIsLoadingMoreReply] = React.useState<boolean>(false);

  const loadReplyCallback = React.useCallback(() => {
    return dispatch(loadReply({ route, index }));
  }, [dispatch, index, route]) as AppAsyncThunk;

  const loadMoreReplyCallback = React.useCallback(() => {
    return dispatch(loadMoreReply({ route, index }));
  }, [dispatch, index, route]) as AppAsyncThunk;

  const onLoadReply = React.useCallback(async () => {
    setIsLoadingReply(true);
    await loadReplyCallback().unwrap();
  }, [loadReplyCallback]);

  const onLoadMoreReply = React.useCallback(async () => {
    setIsLoadingMoreReply(true);
    await loadMoreReplyCallback().unwrap();
    setIsLoadingMoreReply(false);
  }, [loadMoreReplyCallback]);

  const keyExtractor = React.useCallback(item => item.id.toString(), []);

  const renderItem = React.useCallback(
    ({ item }: any) => (
      <AppCommentItemBase
        avatarSize={4}
        innerPadding={3}
        contentContainerStyle={styles.replyItem}
        commentBoxInputRef={commentBoxInputRef}
        route={route}
        index={index}
        commentOrReply={item}
        navigation={navigation}
        onLikePress={() => {}}
      />
    ),
    [styles.replyItem, commentBoxInputRef, route, index, navigation],
  );

  const initialReplyListComponent = React.useMemo(() => {
    return (
      <TouchableRipple onPress={onLoadReply} style={styles.replyTouchable}>
        <View style={styles.replyContainer}>
          <View style={styles.replyLine} />
          <AppTextHeading4 style={styles.replyCounter}>
            {isLoadingReply ? t('explorer:loading') : t('explorer:viewCountMoreReply', { count: comment.reply })}
          </AppTextHeading4>
        </View>
      </TouchableRipple>
    );
  }, [
    comment.reply,
    isLoadingReply,
    onLoadReply,
    styles.replyContainer,
    styles.replyCounter,
    styles.replyLine,
    styles.replyTouchable,
  ]);

  const footerComponent = React.useMemo(() => {
    return comment.replyPagination &&
      comment.replies &&
      comment.replyPagination.version !== comment.replies.length - 1 &&
      comment.replies.length !== 0 ? (
      <TouchableRipple onPress={onLoadMoreReply} style={styles.replyTouchable}>
        <View style={styles.replyContainer}>
          <View style={styles.replyLine} />
          <AppTextHeading4 style={styles.replyCounter}>
            {isLoadingMoreReply
              ? t('explorer:loading')
              : t('explorer:loadCountMoreReply', { count: comment.reply - comment.replies.length })}
          </AppTextHeading4>
        </View>
      </TouchableRipple>
    ) : null;
  }, [
    comment.replies,
    comment.reply,
    comment.replyPagination,
    isLoadingMoreReply,
    onLoadMoreReply,
    styles.replyContainer,
    styles.replyCounter,
    styles.replyLine,
    styles.replyTouchable,
  ]);

  return comment.replies.length > 0 ? (
    <AnimatedFlatList
      scrollEventThrottle={16}
      data={comment.replies}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      removeClippedSubviews={true}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      windowSize={21}
      ListFooterComponent={footerComponent}
    />
  ) : (
    initialReplyListComponent
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    replyTouchable: {
      marginTop: hp(2.5, insets),
    },
    replyContainer: {
      flexDirection: 'row',
    },
    replyLine: {
      height: 2,
      width: wp(10, insets),
      backgroundColor: Color(theme.colors.placeholder).alpha(0.1).rgb().toString(),
      alignSelf: 'center',
      marginRight: wp(4, insets),
    },
    replyCounter: {
      color: theme.colors.placeholder,
    },
    replyItem: {
      marginTop: hp(2, insets),
    },
  });
