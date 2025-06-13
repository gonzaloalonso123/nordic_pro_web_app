import { Switch } from "@/components/ui/switch";
import { useNotificationSwitch } from "@/hooks/useNotificationSwitch";

interface NotificationSwitchProps {
    className?: string;
}

export function NotificationSwitch({ className }: NotificationSwitchProps) {
    const {
        isSupported,
        isSubscribed,
        permissionStatus,
        loading,
        error,
        enableNotifications,
        disableNotifications,
    } = useNotificationSwitch();

    const handleSwitch = async (checked: boolean) => {
        if (!isSupported) return;
        if (checked) {
            await enableNotifications();
        } else {
            await disableNotifications();
        }
    };

    const isDisabled = !isSupported || loading;

    return (
        <div className={`flex flex-col gap-2 ${className ?? ""}`}>
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Notifications</span>
                <Switch
                    checked={isSubscribed}
                    disabled={isDisabled}
                    onCheckedChange={handleSwitch}
                />
            </div>
            {!isSupported && (
                <span className="text-xs text-gray-400">Not supported in this browser</span>
            )}
            {isSupported && permissionStatus === "denied" && (
                <span className="text-xs text-red-500">
                    You have denied notifications in your browser settings.
                </span>
            )}
            {error && (
                <span className="text-xs text-red-500">{error}</span>
            )}
        </div>
    );
}