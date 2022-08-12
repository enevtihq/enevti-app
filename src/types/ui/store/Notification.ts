import { PaginationStore } from './PaginationStore';

export type NotificationItem = {
  type: string;
  date: number;
  text: string;
  read: boolean;
};

export type NotificationState = {
  notificationPagination: PaginationStore;
  version: number;
  lastRead: number;
  unread: number;
  items: NotificationItem[];
};
