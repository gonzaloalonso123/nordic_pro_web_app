"use server";

import { sendNotification } from '@/app/pushNotificationActions';
import { NotificationType, SendNotificationOptions } from '@/types/notifications';
import { serverData } from '@/utils/data/server';
import { getUserRoles } from './get-user-roles';

async function sendPreparedNotification(
  recipientUserIds: string[],
  options: SendNotificationOptions
) {
  if (!recipientUserIds || recipientUserIds.length === 0) {
    console.log('No recipients for notification. Skipping.');
    return;
  }

  const notificationPromises = recipientUserIds
    .filter(userId => userId)
    .map(async (userId) => {
      try {
        console.log(`Sending ${options.type} notification to user ${userId}`);
        await sendNotification(options, userId);
      } catch (error) {
        console.error(`Error sending ${options.type} to user ${userId}:`, error);
      }
    });

  await Promise.all(notificationPromises);
}

async function getChatMessageRecipients(
  roomId: string,
  actorUserId: string,
  initialRecipients?: string[]
): Promise<string[] | null> {
  if (initialRecipients && initialRecipients.length > 0) {
    return initialRecipients;
  }

  try {
    const members = await serverData.chatRooms.getChatRoomMembers(roomId);
    return members
      .map(member => member.user_id)
      .filter(id => id !== actorUserId && id !== null);
  } catch (error) {
    console.error(`Error fetching room members for chat message notification (room ${roomId}):`, error);
    return null;
  }
}

async function getActorDetails(
  actorUserId: string
): Promise<{ name: string; avatar: string } | null> {
  try {
    const actor = await serverData.users.getById(actorUserId);
    if (!actor) return null;

    const fullName = `${actor.first_name} ${actor.last_name}`;
    return {
      name: fullName,
      avatar: actor.avatar || '/icon-192x192.png',
    };
  } catch (error) {
    console.error(`Error fetching actor details for user ${actorUserId}:`, error);
    return null;
  }
}

function defaultNotificationOptions(): SendNotificationOptions {
  return {
    type: NotificationType.GENERIC,
    title: 'Notification',
    body: 'You have a new notification.',
    icon: '/icon-192x192.png',
    tag: 'default-notification',
    data: {
      url: '/',
    },
  };
}

interface NewChatMessageNotificationParams {
  actorUserId: string;
  roomId: string;
  messageContent: string;
  recipientUserIds?: string[];
}

export async function triggerNewChatMessageNotification(params: NewChatMessageNotificationParams) {
  const { actorUserId, roomId, messageContent, recipientUserIds: initialRecipients } = params;

  const finalRecipientUserIds = await getChatMessageRecipients(roomId, actorUserId, initialRecipients);

  if (!finalRecipientUserIds || finalRecipientUserIds.length === 0) {
    console.log('No recipients for new chat message notification. Skipping or failed to fetch.');
    return;
  }

  const actorDetails = await getActorDetails(actorUserId);
  if (!actorDetails) {
    console.error(`Failed to get sender details for user ${actorUserId}. Skipping notification.`);
    return;
  }

  const { team: { id: teamId } } = await getUserRoles();

  try {
    const notificationOptions: SendNotificationOptions = {
      ...defaultNotificationOptions(),
      type: NotificationType.NEW_CHAT_MESSAGE,
      title: `New message from ${actorDetails.name}`,
      body: messageContent.substring(0, 100) + (messageContent.length > 100 ? '...' : ''),
      icon: actorDetails.avatar,
      tag: `chat-message-${roomId}`,
      data: {
        url: `/app/team/${teamId}/chat/${roomId}`,
      },
    };

    await sendPreparedNotification(finalRecipientUserIds, notificationOptions);
  } catch (error) {
    console.error(`Error preparing or sending NEW_CHAT_MESSAGE notification for room ${roomId}:`, error);
  }
}

interface NewEventCreatedParams {
  recipientUserIds: string[];
  eventId: string;
}

export async function triggerNewEventCreatedNotification(params: NewEventCreatedParams) {
  const { recipientUserIds, eventId } = params;

  if (!recipientUserIds || recipientUserIds.length === 0) {
    console.log('No recipients for new event created notification. Skipping.');
    return;
  }

  const eventDetails = await serverData.events.getById(eventId);
  if (!eventDetails) {
    console.error(`Event with ID ${eventId} not found. Skipping notification.`);
    return;
  }
  const { name: eventTitle, start_date: eventStartTime, description: eventDescription, } = eventDetails;

  const formattedEventStartTime = new Date(eventStartTime).toLocaleString();
  const { team: { id: teamId } } = await getUserRoles();

  try {
    const notificationOptions: SendNotificationOptions = {
      ...defaultNotificationOptions(),
      type: NotificationType.NEW_EVENT_INVITATION,
      title: `New Event: ${eventTitle}`,
      body: `You have been invited to an event starting ${formattedEventStartTime} ${eventDescription ? ` - ${eventDescription.substring(0, 50)}${eventDescription.length > 50 ? '...' : ''}` : ''}`,
      tag: `new-event-${eventId}`,
      data: {
        url: `app/team/${teamId}/calendar`
      },
    };

    await sendPreparedNotification(recipientUserIds, notificationOptions);
  } catch (error) {
    console.error(`Error sending NEW_EVENT_CREATED notification for event ${eventId}:`, error);
  }
}

interface CalendarEventReminderParams {
  recipientUserIds: string[];
  eventId: string;
  eventTitle: string;
  eventStartTime: string;
}

export async function triggerCalendarEventReminderNotification(params: CalendarEventReminderParams) {
  const { recipientUserIds, eventId, eventTitle, eventStartTime } = params;

  if (!recipientUserIds || recipientUserIds.length === 0) {
    console.log('No recipients for calendar event reminder. Skipping.');
    return;
  }

  try {
    const notificationOptions: SendNotificationOptions = {
      ...defaultNotificationOptions(),
      type: NotificationType.CALENDAR_EVENT_REMINDER,
      title: `Reminder: ${eventTitle}`,
      body: `Starts at ${eventStartTime}`,
      tag: `event-reminder-${eventId}`,
      data: {
        url: `/app/user/calendar?eventId=${eventId}`
      },
    };

    await sendPreparedNotification(recipientUserIds, notificationOptions);
  } catch (error) {
    console.error(`Error sending CALENDAR_EVENT_REMINDER for event ${eventId}:`, error);
  }
}

interface NewFormAvailableParams {
  recipientUserIds: string[];
  formId: string;
}

export async function triggerNewFormAvailableNotification(params: NewFormAvailableParams) {
  const { recipientUserIds, formId } = params;

  if (!recipientUserIds || recipientUserIds.length === 0) {
    console.log('No recipients for new form available notification. Skipping.');
    return;
  }

  const form = await serverData.forms.getById(formId);
  if (!form) {
    console.error(`Form with ID ${formId} not found. Skipping notification.`);
    return;
  }

  try {
    const notificationOptions: SendNotificationOptions = {
      ...defaultNotificationOptions(),
      type: NotificationType.NEW_FORM_AVAILABLE,
      title: `New Form: ${form.title}`,
      body: 'A new form is ready for you to fill out.',
      tag: `new-form-${formId}`,
      data: {
        url: `/`
      },
    };

    await sendPreparedNotification(recipientUserIds, notificationOptions);
  } catch (error) {
    console.error(`Error sending NEW_FORM_AVAILABLE for form ${formId}:`, error);
  }
}
