import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';
import { NotificationItem, NotificationState } from 'enevti-app/types/ui/store/Notification';
import { assignDeep } from 'enevti-app/utils/primitive/object';

const initialState: NotificationState = {
  version: 0,
  lastRead: 0,
  unread: 0,
  items: [],
};

const notificationViewSlice = createSlice({
  name: 'notificationView',
  initialState,
  reducers: {
    setNotificationView: (notification, action: PayloadAction<Partial<NotificationState>>) => {
      assignDeep(notification, action.payload);
    },
    readAllNotificationItems: (notification, action: PayloadAction<{ lastRead: number; unread: number }>) => {
      notification.items = notification.items.map(item => ({ ...item, read: true }));
      notification.lastRead = action.payload.lastRead;
      notification.unread = action.payload.unread;
    },
    setNotificationVersion: (notification, action: PayloadAction<number>) => {
      notification.version = action.payload;
    },
    setNotificationLastRead: (notification, action: PayloadAction<number>) => {
      notification.lastRead = action.payload;
    },
    addNotificationUnread: notification => {
      notification.unread += 1;
    },
    setNotificationUnread: (notification, action: PayloadAction<number>) => {
      notification.unread = action.payload;
    },
    pushNotificationItem: (notification, action: PayloadAction<NotificationItem[]>) => {
      notification.items = notification.items.concat(action.payload);
    },
    unshiftNotificationItem: (notification, action: PayloadAction<NotificationItem[]>) => {
      notification.items = action.payload.concat(notification.items);
    },
    deleteNotificationItem: (notification, action: PayloadAction<number>) => {
      notification.items = [
        ...notification.items.slice(0, action.payload),
        ...notification.items.slice(action.payload + 1),
      ];
    },
    resetNotificationView: () => {
      return initialState;
    },
  },
});

export const {
  setNotificationView,
  readAllNotificationItems,
  setNotificationVersion,
  addNotificationUnread,
  setNotificationLastRead,
  setNotificationUnread,
  pushNotificationItem,
  unshiftNotificationItem,
  deleteNotificationItem,
  resetNotificationView,
} = notificationViewSlice.actions;
export default notificationViewSlice.reducer;

export const selectNotificationView = createSelector(
  (state: RootState) => state.entities.notification,
  (notification: NotificationState) => notification,
);

export const selectNotificationUnread = createSelector(
  (state: RootState) => state.entities.notification,
  (notification: NotificationState) => notification.unread,
);

export const selectNotificationItem = createSelector(
  (state: RootState) => state.entities.notification,
  (notification: NotificationState) => notification.items,
);

export const isThereAnyNewNotification = createSelector(
  (state: RootState) => state.entities.notification,
  (notification: NotificationState) => notification.lastRead > notification.version,
);
