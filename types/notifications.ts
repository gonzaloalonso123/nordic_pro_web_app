export const NotificationType = {
  NEW_EVENT_INVITATION: 'new_event_invitation',
  NEW_CHAT_MESSAGE: 'new_chat_message',
  CALENDAR_EVENT_REMINDER: 'calendar_event_reminder',
  NEW_FORM_AVAILABLE: 'new_form_available',
  GENERIC: 'generic',
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

export interface NotificationPayloadData {
  url?: string;
  [key: string]: any;
}

export interface SendNotificationOptions {
  type: NotificationType;
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  data?: NotificationPayloadData;
}
