import { StyleSheet, TextInput } from 'react-native';
import React from 'react';
import { CommentItem, setCommentText } from 'enevti-app/store/slices/ui/view/comment';
import { parsePersonaLabel } from 'enevti-app/service/enevti/persona';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { RouteProp } from '@react-navigation/native';
import AppCommentItemBase from './AppCommentItemBase';
import AppReplyList from './AppReplyList';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { clearReplying, getCommentKey, setReplying } from 'enevti-app/store/middleware/thunk/ui/view/comment';
import { fetchIPFS } from 'enevti-app/service/ipfs';

interface AppCommentItemProps {
  comment: CommentItem;
  type: 'common' | 'clubs';
  navigation: StackNavigationProp<RootStackParamList>;
  index: number;
  route: RouteProp<RootStackParamList, 'Comment'>;
  commentBoxInputRef: React.RefObject<TextInput>;
  onLikeCommentPress: (id: string, key: string, target: string) => void;
  onLikeReplyPress: (id: string, commentIndex: number, replyIndex: number, key: string, target: string) => void;
}

export default function AppCommentItem({
  comment,
  type,
  navigation,
  index,
  route,
  commentBoxInputRef,
  onLikeCommentPress,
  onLikeReplyPress,
}: AppCommentItemProps) {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(insets), [insets]);

  const onLikeComment = React.useCallback(() => {
    onLikeCommentPress(comment.id, getCommentKey(route, type), parsePersonaLabel(comment.owner));
  }, [comment.id, comment.owner, onLikeCommentPress, route, type]);

  const onCommentLoad = React.useCallback(async () => {
    if (!comment.text) {
      const data = await fetchIPFS(comment.data);
      if (data) {
        dispatch(setCommentText({ key: getCommentKey(route, type), commentIndex: index, value: data }));
      }
    }
  }, [comment.data, comment.text, dispatch, index, route, type]);

  const onReplyPress = React.useCallback(() => {
    dispatch(clearReplying({ route, type }));
    dispatch(setReplying({ route, type, index }));
    commentBoxInputRef.current?.focus();
  }, [commentBoxInputRef, dispatch, index, route, type]);

  const replyComponent = React.useCallback(
    (commentIndex: number) => (
      <AppReplyList
        type={type}
        commentIndex={commentIndex}
        comment={comment}
        navigation={navigation}
        route={route}
        commentBoxInputRef={commentBoxInputRef}
        onLikeReplyPress={onLikeReplyPress}
      />
    ),
    [type, comment, navigation, route, commentBoxInputRef, onLikeReplyPress],
  );

  return (
    <AppCommentItemBase
      contentContainerStyle={styles.commentItem}
      commentOrReply={comment}
      navigation={navigation}
      index={index}
      route={route}
      type={type}
      onReplyPress={onReplyPress}
      onLikePress={onLikeComment}
      onLoad={onCommentLoad}
      replyComponent={replyComponent}
    />
  );
}

const makeStyles = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    commentItem: {
      paddingHorizontal: wp(4, insets),
      paddingVertical: hp(1.8, insets),
      marginVertical: hp(0.2, insets),
    },
  });
