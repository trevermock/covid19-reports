export interface NotificationEvent {
  name: string,
  displayName: string,
}

export const AllNotificationEvents: NotificationEvent[] = [
  {
    name: 'accessRequest',
    displayName: 'Access Requests',
  },
];
