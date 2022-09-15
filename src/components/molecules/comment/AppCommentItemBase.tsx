import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
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
import { RouteProp } from '@react-navigation/native';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import { getCommentKey } from 'enevti-app/store/middleware/thunk/ui/view/comment';
import { fetchIPFS } from 'enevti-app/service/ipfs';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';

interface AppCommentItemBaseProps {
  commentOrReply: CommentItem | ReplyItem;
  type: 'common' | 'clubs';
  navigation: StackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'Comment'>;
  onLikePress: (id: string, key: string, target: string) => void;
  onReplyPress: () => void;
  index: number;
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
  type,
  onLikePress,
  onReplyPress,
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

  const [text, setText] = React.useState<string>('');

  React.useEffect(() => {
    const run = async () => {
      if (commentOrReply.data) {
        const data = await fetchIPFS(commentOrReply.data);
        if (data) {
          setText(data);
        }
      } else if (commentOrReply.text) {
        setText(commentOrReply.text);
      }
    };
    run();
  }, [commentOrReply.data, commentOrReply.text]);

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

  const onLike = React.useCallback(() => {
    onLikePress(commentOrReply.id, getCommentKey(route, type), parsePersonaLabel(commentOrReply.owner));
  }, [commentOrReply.id, commentOrReply.owner, onLikePress, route, type]);

  const onAlreadyLiked = React.useCallback(() => {
    dispatch(showSnackbar({ mode: 'info', text: t('home:cannotLike') }));
  }, [dispatch, t]);

  return (
    <View pointerEvents={commentOrReply.isPosting ? 'none' : 'auto'} style={styles.commentItemContainer}>
      <View style={[styles.commentContainer, contentContainerStyle]}>
        <View style={styles.avatar}>
          <AppAvatarRenderer persona={commentOrReply.owner} size={hp(avatarSize, insets)} />
        </View>
        <View style={styles.commentRightSection}>
          <View style={styles.commentTextAndLike}>
            <View style={styles.commentText}>
              {text ? (
                <AppMentionRenderer
                  navigation={navigation}
                  style={styles.commentTextItem}
                  onTitlePress={onOwnerDetail}
                  title={parsePersonaLabel(commentOrReply.owner)}
                  text={text}
                />
              ) : (
                <View style={styles.isCommentContentLoading}>
                  <AppActivityIndicator animating size={hp(1.8)} style={styles.isCommentContentLoadingLoader} />
                  <AppTextBody4 style={styles.isCommentContentLoadingText}>{t('explorer:loading')}</AppTextBody4>
                </View>
              )}
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
        </View>
      </View>
      {'reply' in commentOrReply && commentOrReply.reply > 0 && replyComponent ? replyComponent(index) : null}
      {commentOrReply.isPosting ? (
        <View style={styles.isPostingLoader}>
          <AppActivityIndicator animating />
        </View>
      ) : null}
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
    isCommentContentLoading: {
      flexDirection: 'row',
      marginBottom: hp(0.5),
    },
    isCommentContentLoadingLoader: {
      justifyContent: 'center',
    },
    isCommentContentLoadingText: {
      marginLeft: wp(2),
    },
    commentRightSection: {
      flex: 1,
    },
    commentTextAndLike: {
      flexDirection: 'row',
      flex: 1,
    },
    commentItemContainer: {
      opacity: commentOrReply.isPosting ? 0.5 : 1,
    },
    commentContainer: {
      flexDirection: 'row',
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
