import { Record, Change } from "@geotecinit/emai-framework/entities";
import { RecordType } from "~/app/core/record-type";

export class PatientFeedback extends Record {
    constructor(
        public feedbackId: string,
        public question: string,
        public feedback: string,
        public notificationId?: number,
        obtainedAt: Date = new Date()
    ) {
        super(RecordType.PatientFeedback, obtainedAt, Change.NONE);
    }
}
