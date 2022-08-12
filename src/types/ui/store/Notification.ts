export type NotificationItem = {
  type: string;
  date: number;
  text: string;
  read: boolean;
};

export type NotificationState = {
  version: number;
  lastRead: number;
  unread: number;
  items: NotificationItem[];
};
