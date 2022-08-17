import { StyleSheet, TextInput } from 'react-native';
import React from 'react';
import { CommentItem } from 'enevti-app/store/slices/ui/view/comment';
import { parsePersonaLabel } from 'enevti-app/service/enevti/persona';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { RouteProp } from '@react-navigation/native';
import AppCommentItemBase from './AppCommentItemBase';
import AppReplyList from './AppReplyList';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppCommentItemProps {
  comment: CommentItem;
  navigation: StackNavigationProp<RootStackParamList>;
  index: number;
  route: RouteProp<RootStackParamList, 'Comment'>;
  commentBoxInputRef: React.RefObject<TextInput>;
  onLikeCommentPress: (id: string, key: string, target: string) => void;
}

export default function AppCommentItem({
  comment,
  navigation,
  index,
  route,
  commentBoxInputRef,
  onLikeCommentPress,
}: AppCommentItemProps) {
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(insets), [insets]);

  const onLikeComment = React.useCallback(() => {
    onLikeCommentPress(comment.id, route.key, parsePersonaLabel(comment.owner));
  }, [comment.id, comment.owner, onLikeCommentPress, route.key]);

  const replyComponent = React.useCallback(
    (commentIndex: number) => (
      <AppReplyList
        index={commentIndex}
        comment={comment}
        navigation={navigation}
        route={route}
        commentBoxInputRef={commentBoxInputRef}
      />
    ),
    [comment, commentBoxInputRef, navigation, route],
  );

  return (
    <AppCommentItemBase
      contentContainerStyle={styles.commentItem}
      commentOrReply={comment}
      navigation={navigation}
      index={index}
      route={route}
      commentBoxInputRef={commentBoxInputRef}
      onLikePress={onLikeComment}
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
