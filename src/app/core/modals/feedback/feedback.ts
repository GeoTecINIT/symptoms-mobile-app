import { Record, Change } from "@geotecinit/emai-framework/entities";

export class PatientFeedback extends Record {
    constructor(
        public feedbackId: string,
        public question: string,
        public feedback: string,
        public notificationId?: number,
        obtainedAt: Date = new Date()
    ) {
        super("patient-feedback", obtainedAt, Change.NONE);
    }
}
