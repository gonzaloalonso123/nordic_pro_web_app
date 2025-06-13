'use server'

import webpush from 'web-push'
import { serverData } from '@/utils/data/server'
import type { SendNotificationOptions} from '@/types/notifications'

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL || 'dev@nordicpro.se'}`,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function subscribeUser(sub: any, userId: string) {
  try {
    await serverData.pushSubscriptions.upsert({
      endpoint: sub.endpoint,
      keys: sub.keys!,
      user_id: userId
    });

    return { success: true }
  } catch (error) {
    console.error('Error storing push subscription:', error)
    return { success: false, error: 'Failed to store subscription' }
  }
}

export async function unsubscribeUser(endpoint: string) {
  try {
    await serverData.pushSubscriptions.deleteByEndpoint(endpoint);
    return { success: true }
  } catch (error) {
    console.error('Error removing push subscription:', error)
    return { success: false, error: 'Failed to remove subscription' }
  }
}

export async function sendNotification(
  options: SendNotificationOptions,
  userId?: string
) {
  try {
    let subscriptions;

    if (userId) {
      subscriptions = await serverData.pushSubscriptions.getByUserId(userId);
    } else {
      subscriptions = await serverData.pushSubscriptions.getAll();
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('No subscriptions found for user:', userId);
      return { success: false, error: 'No subscriptions available' }
    }

    const payload = JSON.stringify({
      title: options.title,
      body: options.body,
      icon: options.icon || '/icon.png',
      tag: options.tag || options.type,
      data: { ...options.data, type: options.type },
    })

    const notificationPromises = subscriptions.map(async subscription => {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: subscription.keys as any
          },
          payload
        );
        return ({ success: true, endpoint: subscription.endpoint });
      } catch (error: any) {
        console.error(`Error sending notification to ${subscription.endpoint}:`, error);
        if (error.statusCode === 404 || error.statusCode === 410) {
          console.log(`Subscription ${subscription.endpoint} has expired or is no longer valid. Removing...`);
          try {
            await serverData.pushSubscriptions.deleteByEndpoint(subscription.endpoint);
            console.log(`Successfully removed subscription ${subscription.endpoint}`);
          } catch (deleteError) {
            console.error(`Failed to remove subscription ${subscription.endpoint}:`, deleteError);
          }
        }
        return { success: false, endpoint: subscription.endpoint, error: error.message };
      }
    });

    const results = await Promise.all(notificationPromises);

    const successCount = results.filter(result => result.success).length;
    const failedCount = results.length - successCount;

    if (failedCount > 0) {
      console.log(`${failedCount} notifications failed to send.`);
    }

    return {
      success: successCount > 0,
      sentCount: successCount,
      failedCount: failedCount,
      results
    }
  } catch (error) {
    console.error('Error in sendNotification function:', error);
    return { success: false, error: 'Failed to send notification globally' };
  }
}

export async function clearChatNotifications(
  roomId: string,
  userId?: string
) {
  try {
    let subscriptions;

    if (userId) {
      subscriptions = await serverData.pushSubscriptions.getByUserId(userId);
    } else {
      subscriptions = await serverData.pushSubscriptions.getAll();
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('No subscriptions found for clearing notifications for user:', userId);
      return { success: false, error: 'No subscriptions available' }
    }

    // Send a special message to clear notifications with the specific tag
    const payload = JSON.stringify({
      action: 'clear',
      tag: `chat-message-${roomId}`,
    })

    const clearPromises = subscriptions.map(async subscription => {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: subscription.keys as any
          },
          payload
        );
        return ({ success: true, endpoint: subscription.endpoint });
      } catch (error: any) {
        console.error(`Error clearing notifications for ${subscription.endpoint}:`, error);
        if (error.statusCode === 404 || error.statusCode === 410) {
          try {
            await serverData.pushSubscriptions.deleteByEndpoint(subscription.endpoint);
          } catch (deleteError) {
            console.error(`Failed to remove subscription ${subscription.endpoint}:`, deleteError);
          }
        }
        return { success: false, endpoint: subscription.endpoint, error: error.message };
      }
    });

    const results = await Promise.all(clearPromises);
    const successCount = results.filter(result => result.success).length;

    return {
      success: successCount > 0,
      clearedCount: successCount,
      results
    }
  } catch (error) {
    console.error('Error in clearChatNotifications function:', error);
    return { success: false, error: 'Failed to clear notifications' };
  }
}
