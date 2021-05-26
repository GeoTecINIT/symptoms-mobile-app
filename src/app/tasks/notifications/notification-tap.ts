import { TapAction } from "@geotecinit/emai-framework/notifications";
import { NotificationEvtBaseRecord } from "./base-notification-record";

export class NotificationTapRecord extends NotificationEvtBaseRecord {
    constructor(
        notificationId: number,
        tapAction: TapAction,
        timestamp?: Date
    ) {
        super("notification-tap", notificationId, tapAction, timestamp);
    }
}
