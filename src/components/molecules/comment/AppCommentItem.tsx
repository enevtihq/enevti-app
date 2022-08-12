import { View, StyleSheet } from 'react-native';
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
import { CommentItem } from 'enevti-app/store/slices/ui/view/comment';
import { parsePersonaLabel } from 'enevti-app/service/enevti/persona';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import timeSince from 'enevti-app/utils/date/timeSince';
import { useTranslation } from 'react-i18next';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import AppMentionRenderer from './AppMentionRenderer';

interface AppCommentItemProps {
  comment: CommentItem;
  navigation: StackNavigationProp<RootStackParamList>;
}

export default function AppCommentItem({ comment, navigation }: AppCommentItemProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(theme, insets, comment), [theme, insets, comment]);

  const onOwnerDetail = React.useCallback(() => {
    navigation.push('Profile', {
      arg: comment.owner.address,
      mode: 'a',
    });
  }, [navigation, comment.owner.address]);

  return (
    <View style={styles.commentContainer} pointerEvents={comment.isPosting ? 'none' : 'auto'}>
      <View style={styles.avatar}>
        <AppAvatarRenderer persona={comment.owner} size={hp(5, insets)} />
      </View>
      <View style={styles.commentText}>
        <AppMentionRenderer
          navigation={navigation}
          style={styles.commentTextItem}
          onTitlePress={onOwnerDetail}
          title={parsePersonaLabel(comment.owner)}
          text={comment.text}
        />
        <View style={styles.commentAction}>
          <AppTextHeading4 style={styles.commentActionItem}>{timeSince(comment.date)}</AppTextHeading4>
          {comment.like > 0 ? (
            <AppTextHeading4 style={styles.commentActionItem}>
              {t('explorer:likeCount', { count: comment.like })}
            </AppTextHeading4>
          ) : null}
          <AppTextHeading4 style={styles.commentActionItem}>{t('explorer:reply')}</AppTextHeading4>
        </View>
        {comment.reply > 0 ? (
          <View style={styles.replyContainer}>
            <View style={styles.replyLine} />
            <AppTextHeading4 style={styles.replyCounter}>
              {t('explorer:viewCountMoreReply', { count: comment.reply })}
            </AppTextHeading4>
          </View>
        ) : null}
        {comment.isPosting ? (
          <View style={styles.isPostingLoader}>
            <AppActivityIndicator animating />
          </View>
        ) : null}
      </View>
      <View style={styles.likeCommentButton}>
        <AppIconButton icon={iconMap.likeInactive} size={hp(2.25, insets)} />
      </View>
    </View>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets, comment: CommentItem) =>
  StyleSheet.create({
    isPostingLoader: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
    },
    commentContainer: {
      flexDirection: 'row',
      paddingVertical: hp(1.8, insets),
      marginVertical: hp(0.2, insets),
      opacity: comment.isPosting ? 0.5 : 1,
      backgroundColor: comment.highlighted ? Color(theme.colors.primary).alpha(0.025).rgb().toString() : undefined,
    },
    avatar: {
      marginHorizontal: wp(4, insets),
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
      marginVertical: hp(2, insets),
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
      marginHorizontal: wp(4, insets),
    },
  });
