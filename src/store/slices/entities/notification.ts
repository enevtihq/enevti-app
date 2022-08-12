import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';
import { PaginationStore } from 'enevti-app/types/ui/store/PaginationStore';
import { NotificationItem, NotificationState } from 'enevti-app/types/ui/store/Notification';

const initialState: NotificationState = {
  notificationPagination: {
    checkpoint: 0,
    version: 0,
  },
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
      Object.assign(notification, action.payload);
    },
    setNotificationVersion: (notification, action: PayloadAction<number>) => {
      notification.version = action.payload;
    },
    setNotificationLastRead: (notification, action: PayloadAction<number>) => {
      notification.lastRead = action.payload;
    },
    setNotificationUnread: (notification, action: PayloadAction<number>) => {
      notification.unread = action.payload;
    },
    setNotificationPagination: (notification, action: PayloadAction<PaginationStore>) => {
      notification.notificationPagination = { ...action.payload };
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
  setNotificationVersion,
  setNotificationLastRead,
  setNotificationUnread,
  setNotificationPagination,
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

export const selectNotificationItem = createSelector(
  (state: RootState) => state.entities.notification,
  (notification: NotificationState) => notification.items,
);

export const isThereAnyNewNotification = createSelector(
  (state: RootState) => state.entities.notification,
  (notification: NotificationState) => notification.lastRead > notification.version,
);
