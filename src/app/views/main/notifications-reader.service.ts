import { Injectable } from "@angular/core";

import { Observable, ReplaySubject } from "rxjs";
import { Notification } from "@geotecinit/emai-framework/notifications";

// FIXME: Replace with external API once declared
import { notificationsStoreDB } from "@geotecinit/emai-framework/internal/persistence/stores/notifications";

import { map } from "rxjs/operators";
import { approximateDiff, ApproximateTimeDiff } from "~/app/core/utils/time";

@Injectable({
    providedIn: "root",
})
export class NotificationsReaderService {
    get unread$(): Observable<boolean> {
        return this.notificationUpdates.pipe(
            map((notifications) => notifications.length > 0)
        );
    }

    get notifications$(): Observable<Array<NotificationViewModel>> {
        return this.notificationUpdates.asObservable();
    }

    private notificationUpdates = new ReplaySubject<
        Array<NotificationViewModel>
    >(1);

    constructor() {
        notificationsStoreDB.list().subscribe((notifications) => {
            const timeRef = new Date();

            const processedNotifications = notifications.map((notification) =>
                viewModelFrom(notification, timeRef)
            );
            this.notificationUpdates.next(processedNotifications);
        });
    }
}

export interface NotificationViewModel {
    title: string;
    body: string;
    age: string;
    notification: Notification;
}

function viewModelFrom(
    notification: Notification,
    timeRef: Date
): NotificationViewModel {
    const { title, body } = notification;
    const diff = approximateDiff(notification.timestamp, timeRef);
    const age = notificationAgeFromDiff(diff);

    return { title, body, age, notification };
}

function notificationAgeFromDiff({
    amount,
    units,
}: ApproximateTimeDiff): string {
    if (units === "minutes" && amount === 0) {
        return "Ahora";
    }
    switch (units) {
        case "minutes":
            return `Hace ${amount} min.`;
        case "hours":
            return `Hace ${amount} h.`;
        case "days":
            return `Hace ${amount} d.`;
    }
}
