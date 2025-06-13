"use client";

import { useState } from "react";
import { usePushNotifications } from "@/hooks/use-push-notifications";

export function useNotificationSwitch() {
    const {
        isSupported,
        isSubscribed,
        permissionStatus,
        subscribeToPush,
        unsubscribe,
    } = usePushNotifications();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const enableNotifications = async () => {
        setError(null);
        if (!isSupported) return false;
        setLoading(true);
        try {
            let permission = permissionStatus;
            if (permission !== "granted") {
                permission = await Notification.requestPermission();
            }
            if (permission === "granted") {
                subscribeToPush();
                setLoading(false);
                return true;
            } else {
                setError("You have denied notifications in your browser settings.");
                setLoading(false);
                return false;
            }
        } catch (e) {
            setError("Error enabling notifications.");
            setLoading(false);
            return false;
        }
    };

    const disableNotifications = async () => {
        setError(null);
        setLoading(true);
        try {
            await unsubscribe?.();
        } finally {
            setLoading(false);
        }
    };

    return {
        isSupported,
        isSubscribed,
        permissionStatus,
        loading,
        error,
        enableNotifications,
        disableNotifications,
    };
}