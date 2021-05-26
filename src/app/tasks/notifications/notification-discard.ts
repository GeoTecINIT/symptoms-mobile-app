import { TapAction } from "@geotecinit/emai-framework/notifications";
import { NotificationEvtBaseRecord } from "./base-notification-record";

export class NotificationDiscardRecord extends NotificationEvtBaseRecord {
    constructor(
        notificationId: number,
        tapAction: TapAction,
        timestamp?: Date
    ) {
        super("notification-discard", notificationId, tapAction, timestamp);
    }
}
