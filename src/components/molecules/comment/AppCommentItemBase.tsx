import { View, StyleSheet, TextInput, StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import Color from 'color';
import AppIconButton from 'enevti-app/components/atoms/icon/AppIconButton';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import AppTextHeading4 from 'enevti-app/components/atoms/text/AppTextHeading4';
import { wp, hp, SafeAreaInsets } from 'enevti-app/utils/imageRatio';
import AppAvatarRenderer from '../avatar/AppAvatarRenderer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import { CommentItem, ReplyItem } from 'enevti-app/store/slices/ui/view/comment';
import { parsePersonaLabel } from 'enevti-app/service/enevti/persona';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import timeSince from 'enevti-app/utils/date/timeSince';
import { useTranslation } from 'react-i18next';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import AppMentionRenderer from './AppMentionRenderer';
import { useDispatch } from 'react-redux';
import { resetReplying, setReplying } from 'enevti-app/store/middleware/thunk/ui/view/comment';
import { RouteProp } from '@react-navigation/native';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';

interface AppCommentItemBaseProps {
  commentOrReply: CommentItem | ReplyItem;
  navigation: StackNavigationProp<RootStackParamList>;
  index: number;
  route: RouteProp<RootStackParamList, 'Comment'>;
  commentBoxInputRef: React.RefObject<TextInput>;
  onLikePress: (id: string, key: string, target: string) => void;
  contentContainerStyle?: StyleProp<ViewStyle>;
  replyComponent?: (index: number) => React.ReactNode;
  avatarSize?: number;
  innerPadding?: number;
}

export default function AppCommentItemBase({
  commentOrReply,
  navigation,
  index,
  route,
  commentBoxInputRef,
  onLikePress,
  contentContainerStyle,
  replyComponent,
  avatarSize = 5,
  innerPadding = 4,
}: AppCommentItemBaseProps) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(
    () => makeStyles(theme, insets, commentOrReply, innerPadding),
    [theme, insets, commentOrReply, innerPadding],
  );

  const onOwnerDetail = React.useCallback(() => {
    if (commentOrReply.owner.address) {
      navigation.push('Profile', {
        arg: commentOrReply.owner.address,
        mode: 'a',
      });
    } else {
      dispatch(showSnackbar({ mode: 'info', text: t('error:dataUnavailable') }));
    }
  }, [commentOrReply.owner.address, navigation, dispatch, t]);

  const onReplyPress = React.useCallback(() => {
    dispatch(resetReplying({ route }));
    dispatch(setReplying({ route, index }));
    commentBoxInputRef.current?.focus();
  }, [commentBoxInputRef, dispatch, index, route]);

  const onLike = React.useCallback(() => {
    onLikePress(commentOrReply.id, route.key, parsePersonaLabel(commentOrReply.owner));
  }, [commentOrReply.id, commentOrReply.owner, onLikePress, route.key]);

  const onAlreadyLiked = React.useCallback(() => {
    dispatch(showSnackbar({ mode: 'info', text: t('home:cannotLike') }));
  }, [dispatch, t]);

  return (
    <View
      style={[styles.commentContainer, contentContainerStyle]}
      pointerEvents={commentOrReply.isPosting ? 'none' : 'auto'}>
      <View style={styles.avatar}>
        <AppAvatarRenderer persona={commentOrReply.owner} size={hp(avatarSize, insets)} />
      </View>
      <View style={styles.commentRightSection}>
        <View style={styles.commentTextAndLike}>
          <View style={styles.commentText}>
            <AppMentionRenderer
              navigation={navigation}
              style={styles.commentTextItem}
              onTitlePress={onOwnerDetail}
              title={parsePersonaLabel(commentOrReply.owner)}
              text={commentOrReply.text}
            />
            <View style={styles.commentAction}>
              <AppTextHeading4 style={styles.commentActionItem}>{timeSince(commentOrReply.date)}</AppTextHeading4>
              {commentOrReply.like > 0 ? (
                <AppTextHeading4 style={styles.commentActionItem}>
                  {t('explorer:likeCount', { count: commentOrReply.like })}
                </AppTextHeading4>
              ) : null}
              <AppTextHeading4 onPress={onReplyPress} style={styles.commentActionItem}>
                {t('explorer:reply')}
              </AppTextHeading4>
            </View>
            {commentOrReply.isPosting ? (
              <View style={styles.isPostingLoader}>
                <AppActivityIndicator animating />
              </View>
            ) : null}
          </View>
          <View style={styles.likeCommentButton}>
            {commentOrReply.isLiking ? (
              <AppActivityIndicator animating size={hp(2)} />
            ) : commentOrReply.liked ? (
              <AppIconButton
                onPress={onAlreadyLiked}
                color={theme.colors.primary}
                icon={iconMap.likeActive}
                size={hp(2.25, insets)}
              />
            ) : (
              <AppIconButton
                onPress={onLike}
                color={theme.colors.text}
                icon={iconMap.likeInactive}
                size={hp(2.25, insets)}
              />
            )}
          </View>
        </View>
        {'reply' in commentOrReply && commentOrReply.reply > 0 && replyComponent ? replyComponent(index) : null}
      </View>
    </View>
  );
}

const makeStyles = (
  theme: Theme,
  insets: SafeAreaInsets,
  commentOrReply: CommentItem | ReplyItem,
  innerPadding: number,
) =>
  StyleSheet.create({
    isPostingLoader: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
    },
    commentRightSection: {
      flex: 1,
    },
    commentTextAndLike: {
      flexDirection: 'row',
      flex: 1,
    },
    commentContainer: {
      flexDirection: 'row',
      opacity: commentOrReply.isPosting ? 0.5 : 1,
      backgroundColor: commentOrReply.highlighted
        ? Color(theme.colors.placeholder).alpha(0.05).rgb().toString()
        : undefined,
    },
    avatar: {
      marginRight: wp(innerPadding, insets),
    },
    commentText: {
      flex: 1,
    },
    commentTextItem: {
      marginBottom: hp(0.5),
    },
    commentAction: {
      flexDirection: 'row',
    },
    commentActionItem: {
      color: theme.colors.placeholder,
      marginRight: wp(4, insets),
    },
    replyContainer: {
      flexDirection: 'row',
      marginTop: hp(2.5, insets),
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
    likeCommentButton: {
      marginLeft: wp(innerPadding, insets),
    },
  });
