import React from 'react';
import { useTheme } from '@react-navigation/native';
import { Theme } from 'enevti-app/theme/default';
import { hp, wp } from 'enevti-app/utils/imageRatio';
import AppIconButton from 'enevti-app/components/atoms/icon/AppIconButton';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import AppListItem from 'enevti-app/components/molecules/list/AppListItem';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { NotificationItem } from 'enevti-app/types/ui/store/Notification';
import AppActivityIcon from 'enevti-app/components/molecules/activity/AppActivityIcon';
import AppMentionRenderer from 'enevti-app/components/molecules/comment/AppMentionRenderer';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import timeSince from 'enevti-app/utils/date/timeSince';
import { deleteNotificationItem } from 'enevti-app/store/slices/entities/notification';

interface AppNotificationItemProps {
  navigation: StackNavigationProp<RootStackParamList>;
  notification: NotificationItem;
  index: number;
}

export default function AppNotificationItem({ notification, navigation, index }: AppNotificationItemProps) {
  const dispatch = useDispatch();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(), []);

  const onDelete = React.useCallback(() => {
    dispatch(deleteNotificationItem(index));
  }, [dispatch, index]);

  return (
    <AppListItem
      leftContent={
        <View style={styles.activityIcon}>
          <AppActivityIcon activityName={notification.type} />
        </View>
      }
      rightContent={
        <View style={styles.removeButton}>
          <AppIconButton color={theme.colors.placeholder} size={hp(2)} icon={iconMap.remove} onPress={onDelete} />
        </View>
      }>
      <AppMentionRenderer navigation={navigation} text={notification.text} />
      <AppTextBody4 style={{ color: theme.colors.placeholder }} numberOfLines={1}>
        {timeSince(notification.date)}
      </AppTextBody4>
    </AppListItem>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    activityIcon: {
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    removeButton: {
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      marginLeft: wp(1),
    },
  });
