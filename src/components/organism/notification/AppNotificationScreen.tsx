import { FlatListProps, FlatList, StyleSheet } from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';
import AppMessageEmpty from 'enevti-app/components/molecules/message/AppMessageEmpty';
import AppNotificationItem from './AppNotificationItem';
import { NotificationItem, NotificationState } from 'enevti-app/types/ui/store/Notification';
import { useDispatch, useSelector } from 'react-redux';
import {
  readAllNotificationItems,
  selectNotificationView,
  setNotificationLastRead,
  setNotificationUnread,
} from 'enevti-app/store/slices/entities/notification';
import { hp } from 'enevti-app/utils/imageRatio';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';

const AnimatedFlatList = Animated.createAnimatedComponent<FlatListProps<NotificationItem>>(FlatList);

interface AppNotificationScreenProps {
  navigation: StackNavigationProp<RootStackParamList>;
}

export default function AppNotificationScreen({ navigation }: AppNotificationScreenProps) {
  const dispatch = useDispatch();
  const styles = React.useMemo(() => makeStyles(), []);
  const myNotification: NotificationState = useSelector(selectNotificationView);

  React.useEffect(() => {
    dispatch(setNotificationLastRead(Date.now()));
    dispatch(readAllNotificationItems());
    dispatch(setNotificationUnread(0));
  }, [dispatch]);

  const renderItem = React.useCallback(
    ({ item, index }: any) => <AppNotificationItem index={index} navigation={navigation} notification={item} />,
    [navigation],
  );

  const keyExtractor = React.useCallback((_, index) => `notification:${index}`, []);

  const emptyComponent = React.useMemo(() => <AppMessageEmpty />, []);

  const contentContainerStyle = React.useMemo(
    () =>
      myNotification.items && myNotification.items.length > 0
        ? styles.listContentContainer
        : styles.listContentEmptyContainer,
    [myNotification.items, styles.listContentContainer, styles.listContentEmptyContainer],
  );

  const handleLoadMore = React.useCallback(() => {}, []);

  return (
    <AnimatedFlatList
      scrollEventThrottle={16}
      data={myNotification.items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      removeClippedSubviews={true}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      windowSize={21}
      ListEmptyComponent={emptyComponent}
      contentContainerStyle={contentContainerStyle}
      onEndReachedThreshold={0.1}
      onEndReached={handleLoadMore}
    />
  );
}

const makeStyles = () =>
  StyleSheet.create({
    listContentContainer: {
      paddingTop: hp(1),
    },
    listContentEmptyContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      flex: 1,
    },
  });
