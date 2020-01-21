const NotificationManagerCompat = androidx.core.app.NotificationManagerCompat;

export enum AndroidNotification {
    BehaviorTracking
}

// FIXME: Add text translations
const NOTIFICATION_CHANNELS: Map<
    AndroidNotification,
    NotificationChannel
> = new Map([
    [
        AndroidNotification.BehaviorTracking,
        {
            id: 'BEHAVIOR_TRACKING',
            name: 'Behavior analysis',
            description:
                'Indicates when a background behavior analysis is running',
            priority: NotificationManagerCompat.IMPORTANCE_LOW
        }
    ]
]);

export function setupNotificationChannels(context: android.content.Context) {
    const sdkInt = android.os.Build.VERSION.SDK_INT;
    if (sdkInt < android.os.Build.VERSION_CODES.O) {
        return;
    }
    for (const channel of NOTIFICATION_CHANNELS.values()) {
        setupNotificationChannel(context, channel);
    }
}

export function createNotification(
    context: android.content.Context,
    type: AndroidNotification
): android.app.Notification {
    let notificationBuilder: androidx.core.app.NotificationCompat.Builder;
    switch (type) {
        // TODO: Add a pending intent to open the app in the welcome screen
        case AndroidNotification.BehaviorTracking:
            notificationBuilder = initializeNotificationBuilder(
                context,
                type,
                'Checking location', // FIXME: Add text translations
                ''
            );

            break;
    }

    return notificationBuilder ? notificationBuilder.build() : null;
}

function setupNotificationChannel(
    context: android.content.Context,
    channel: NotificationChannel
) {
    const notificationManager = context.getSystemService(
        android.app.NotificationManager.class
    ) as android.app.NotificationManager;
    if (!notificationManager) {
        return;
    }

    const { id, name, description, priority } = channel;
    const ch = new android.app.NotificationChannel(id, name, priority);
    ch.setDescription(description);

    if (priority === NotificationManagerCompat.IMPORTANCE_HIGH) {
        ch.enableLights(true);
        ch.setLightColor(android.graphics.Color.RED);
        ch.enableVibration(true);
        ch.setVibrationPattern([100, 200, 300, 400, 500, 400, 300, 200, 400]);
    }

    notificationManager.createNotificationChannel(ch);
}

function initializeNotificationBuilder(
    context: android.content.Context,
    type: AndroidNotification,
    title: string,
    content: string
) {
    const { id, priority } = NOTIFICATION_CHANNELS.get(type);
    const iconId = context
        .getResources()
        .getIdentifier(
            'icon',
            'drawable',
            context.getApplicationInfo().packageName
        );

    return new androidx.core.app.NotificationCompat.Builder(context, id)
        .setSmallIcon(iconId)
        .setContentTitle(title)
        .setContentText(content)
        .setPriority(priority);
}

interface NotificationChannel {
    id: string;
    name: string;
    description: string;
    priority: number;
}
