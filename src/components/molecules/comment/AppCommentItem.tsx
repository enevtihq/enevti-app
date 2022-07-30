import { View, StyleSheet } from 'react-native';
import React from 'react';
import Color from 'color';
import AppIconButton from 'enevti-app/components/atoms/icon/AppIconButton';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import AppTextHeading4 from 'enevti-app/components/atoms/text/AppTextHeading4';
import { wp, hp, SafeAreaInsets } from 'enevti-app/utils/imageRatio';
import AppAvatarRenderer from '../avatar/AppAvatarRenderer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import { isMentionPartType, parseValue, Part, PartType } from 'react-native-controlled-mentions';
import { CommentItem } from 'enevti-app/store/slices/ui/view/comment';
import { parsePersonaLabel } from 'enevti-app/service/enevti/persona';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';

interface AppCommentItemProps {
  comment: CommentItem;
  navigation: StackNavigationProp<RootStackParamList>;
}

export default function AppCommentItem({ comment, navigation }: AppCommentItemProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);

  const renderPart = React.useCallback(
    (part: Part, index: number) => {
      if (!part.partType) {
        return <AppTextBody4 key={index}>{part.text}</AppTextBody4>;
      }

      if (isMentionPartType(part.partType)) {
        if (part.partType.trigger === '@') {
          return (
            <AppTextBody4
              key={`${index}-${part.data?.trigger}`}
              style={{ color: theme.colors.link }}
              onPress={() => navigation.push('Profile', { mode: 'a', arg: part.data!.id })}>
              {part.text}
            </AppTextBody4>
          );
        } else if (part.partType.trigger === '$') {
          return (
            <AppTextBody4
              key={`${index}-${part.data?.trigger}`}
              style={{ color: theme.colors.link }}
              onPress={() => navigation.push('Collection', { mode: 'id', arg: part.data!.id })}>
              {part.text}
            </AppTextBody4>
          );
        } else if (part.partType.trigger === '*') {
          return (
            <AppTextBody4
              key={`${index}-${part.data?.trigger}`}
              style={{ color: theme.colors.link }}
              onPress={() => navigation.push('NFTDetails', { mode: 'id', arg: part.data!.id })}>
              {part.text}
            </AppTextBody4>
          );
        }
      }

      return <AppTextBody4 key={`${index}-pattern`}>{part.text}</AppTextBody4>;
    },
    [navigation, theme.colors.link],
  );

  const renderValue = React.useCallback(
    (value: string, partTypes: PartType[]) => {
      const { parts } = parseValue(value, partTypes);
      return parts.map(renderPart);
    },
    [renderPart],
  );

  return (
    <View style={styles.commentContainer}>
      <View style={styles.avatar}>
        <AppAvatarRenderer persona={comment.owner} size={hp(5, insets)} />
      </View>
      <View style={styles.commentText}>
        <AppTextBody4 style={styles.commentTextItem}>
          <AppTextHeading4>{parsePersonaLabel(comment.owner)}</AppTextHeading4>{' '}
          {renderValue(comment.text, [{ trigger: '@' }, { trigger: '$' }, { trigger: '*' }])}
        </AppTextBody4>
        <View style={styles.commentAction}>
          <AppTextHeading4 style={styles.commentActionItem}>3d</AppTextHeading4>
          <AppTextHeading4 style={styles.commentActionItem}>0 likes</AppTextHeading4>
          {comment.reply > 0 ? <AppTextHeading4 style={styles.commentActionItem}>Reply</AppTextHeading4> : null}
        </View>
        {comment.reply > 0 ? (
          <View style={styles.replyContainer}>
            <View style={styles.replyLine} />
            <AppTextHeading4 style={styles.replyCounter}>View 13 more replies</AppTextHeading4>
          </View>
        ) : null}
      </View>
      <View style={styles.likeCommentButton}>
        <AppIconButton icon={iconMap.likeInactive} size={hp(2.25, insets)} />
      </View>
    </View>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    commentContainer: {
      flexDirection: 'row',
      marginBottom: hp(4, insets),
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
