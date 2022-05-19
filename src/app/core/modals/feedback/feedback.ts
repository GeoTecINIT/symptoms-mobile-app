import { Record, Change } from "@awarns/core/entities";
import { AppRecordType } from "~/app/core/app-record-type";

export class PatientFeedback extends Record {
    constructor(
        public feedbackId: string,
        public question: string,
        public feedback: string,
        public notificationId?: number,
        obtainedAt: Date = new Date()
    ) {
        super(AppRecordType.PatientFeedback, obtainedAt, Change.NONE);
    }
}
