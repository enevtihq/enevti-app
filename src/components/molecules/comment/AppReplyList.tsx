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
import {
  clearReplying,
  getCommentKey,
  loadMoreReply,
  loadReply,
  setReplyingOnReply,
} from 'enevti-app/store/middleware/thunk/ui/view/comment';
import { AppAsyncThunk } from 'enevti-app/types/ui/store/AppAsyncThunk';
import { parsePersonaLabel } from 'enevti-app/service/enevti/persona';

const AnimatedFlatList = Animated.createAnimatedComponent<FlatListProps<ReplyItem>>(FlatList);

interface AppReplyListProps {
  commentIndex: number;
  type: 'common' | 'clubs';
  comment: CommentItem;
  navigation: StackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'Comment'>;
  commentBoxInputRef: React.RefObject<TextInput>;
  onLikeReplyPress: (id: string, commentIndex: number, replyIndex: number, key: string, target: string) => void;
}

export default function AppReplyList({
  comment,
  type,
  commentIndex,
  navigation,
  route,
  commentBoxInputRef,
  onLikeReplyPress,
}: AppReplyListProps) {
  const dispatch = useDispatch();
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);
  const [isLoadingReply, setIsLoadingReply] = React.useState<boolean>(false);
  const [isLoadingMoreReply, setIsLoadingMoreReply] = React.useState<boolean>(false);

  const loadReplyCallback = React.useCallback(() => {
    return dispatch(loadReply({ route, type, index: commentIndex }));
  }, [dispatch, commentIndex, route, type]) as AppAsyncThunk;

  const loadMoreReplyCallback = React.useCallback(() => {
    return dispatch(loadMoreReply({ route, type, index: commentIndex }));
  }, [dispatch, commentIndex, route, type]) as AppAsyncThunk;

  const onLoadReply = React.useCallback(async () => {
    setIsLoadingReply(true);
    await loadReplyCallback().unwrap();
  }, [loadReplyCallback]);

  const onLoadMoreReply = React.useCallback(async () => {
    setIsLoadingMoreReply(true);
    await loadMoreReplyCallback().unwrap();
    setIsLoadingMoreReply(false);
  }, [loadMoreReplyCallback]);

  const onReplyPress = React.useCallback(
    (index: number) => {
      dispatch(clearReplying({ route, type }));
      dispatch(setReplyingOnReply({ route, type, commentIndex, replyIndex: index }));
      commentBoxInputRef.current?.focus();
    },
    [commentBoxInputRef, dispatch, commentIndex, route, type],
  );

  const keyExtractor = React.useCallback(item => item.id.toString(), []);

  const renderItem = React.useCallback(
    ({ item, index }: any) => (
      <AppCommentItemBase
        avatarSize={4}
        innerPadding={3}
        contentContainerStyle={styles.replyItem}
        route={route}
        type={type}
        index={index}
        commentOrReply={item}
        navigation={navigation}
        onReplyPress={() => onReplyPress(index)}
        onLikePress={() =>
          onLikeReplyPress(item.id, commentIndex, index, getCommentKey(route, type), parsePersonaLabel(item.owner))
        }
      />
    ),
    [styles.replyItem, route, navigation, onReplyPress, onLikeReplyPress, commentIndex, type],
  );

  const initialReplyListComponent = React.useMemo(() => {
    return (
      <TouchableRipple onPress={onLoadReply} style={styles.replyInitTouchable}>
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
    styles.replyInitTouchable,
  ]);

  const footerComponent = React.useMemo(() => {
    return comment.replyPagination &&
      comment.replies &&
      comment.replyPagination.version !== comment.replies.length &&
      comment.replies.length !== 0 ? (
      <TouchableRipple onPress={onLoadMoreReply} style={styles.replyLoadMoreTouchable}>
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
    styles.replyLoadMoreTouchable,
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
    replyInitTouchable: {
      paddingVertical: hp(1, insets),
    },
    replyLoadMoreTouchable: {
      paddingVertical: hp(1, insets),
    },
    replyContainer: {
      flexDirection: 'row',
      paddingLeft: wp(17),
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
      paddingVertical: hp(2, insets),
      paddingLeft: wp(17),
      paddingRight: wp(4),
    },
  });
