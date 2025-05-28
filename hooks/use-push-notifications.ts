"use client"

import { useEffect, useState } from "react"
import { subscribeUser, unsubscribeUser } from '@/app/pushNotificationActions'
import { useCurrentUser } from '@/hooks/useCurrentUser'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [permissionChecked, setPermissionChecked] = useState(false)
  const [subscriptionSetup, setSubscriptionSetup] = useState(false)
  const { user, isAuthenticated } = useCurrentUser()

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      })
      console.log('Service Worker registered with scope:', registration.scope);
      const sub = await registration.pushManager.getSubscription()
      setSubscription(sub)
      if (sub) {
        console.log('Existing subscription found:', sub);
      } else {
        console.log('No existing subscription found.');
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      setIsSupported(false);
    }
  }

  async function subscribeToPush() {
    if (!isAuthenticated || !user?.id || !VAPID_PUBLIC_KEY) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      setSubscription(sub);
      console.log('User automatically subscribed:', sub);

      const serializedSub = sub.toJSON();
      await subscribeUser(serializedSub, user.id);
      console.log('Push subscription saved to database');
    } catch (error) {
      console.error('Failed to automatically subscribe user:', error);
    }
  }

  useEffect(() => {
    if (permissionChecked && subscriptionSetup) return;

    async function handleAutomaticNotificationSetup() {
      if (!VAPID_PUBLIC_KEY) {
        console.error('VAPID public key not configured.');
        setIsSupported(false);
        setPermissionChecked(true);
        return;
      }

      if (!('serviceWorker' in navigator && 'PushManager' in window)) {
        setIsSupported(false);
        setPermissionChecked(true);
        return;
      }

      setIsSupported(true);

      if (!subscription) {
        await registerServiceWorker();
      }

      if (!isAuthenticated || !user?.id) {
        return;
      }

      if (subscriptionSetup) return;

      const permission = Notification.permission;

      if (permission === 'default' && !permissionChecked) {
        try {
          const result = await Notification.requestPermission();
          setPermissionChecked(true);
          if (result === 'granted') {
            await subscribeToPush();
            setSubscriptionSetup(true);
          }
        } catch (error) {
          console.error('Error requesting notification permission:', error);
          setPermissionChecked(true);
        }
      } else if (permission === 'granted' && !subscription) {
        await subscribeToPush();
        setSubscriptionSetup(true);
      } else if (permission === 'denied') {
        setPermissionChecked(true);
        setSubscriptionSetup(true);
      }
    }

    handleAutomaticNotificationSetup();
  }, [isAuthenticated, user?.id, subscription, permissionChecked, subscriptionSetup]);

  async function unsubscribe() {
    if (!subscription) return;

    const endpoint = subscription.endpoint;
    try {
      await subscription.unsubscribe();
      setSubscription(null);
      await unsubscribeUser(endpoint);
      console.log('Successfully unsubscribed from push notifications');
    } catch (error) {
      console.error('Error unsubscribing:', error);
    }
  }

  return {
    isSupported,
    subscription,
    isSubscribed: !!subscription,
    permissionStatus: typeof window !== 'undefined' ? Notification.permission : 'default',
    unsubscribe,
  };
}
