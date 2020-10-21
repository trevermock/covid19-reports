export interface NotificationEvent {
  name: string,
  displayName: string,
}

export const allNotificationEvents: NotificationEvent[] = [
  {
    name: 'accessRequest',
    displayName: 'Access Requests',
  },
];
