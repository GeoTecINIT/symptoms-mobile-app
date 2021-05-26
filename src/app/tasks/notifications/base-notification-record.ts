import { Change, Record } from "@geotecinit/emai-framework/entities";
import { TapAction } from "@geotecinit/emai-framework/notifications";

export abstract class NotificationEvtBaseRecord extends Record {
    protected constructor(
        name: string,
        public notificationId: number,
        public tapAction: TapAction,
        timestamp: Date = new Date()
    ) {
        super(name, timestamp, Change.NONE);
    }
}
