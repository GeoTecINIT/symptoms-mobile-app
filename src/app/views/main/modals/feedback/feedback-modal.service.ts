import { Injectable } from "@angular/core";

import { NavigationService } from "~/app/views/navigation.service";

import { FeedbackModalOptions } from "~/app/core/modals/feedback";
import { UserFeedback } from "@awarns/notifications";
import { emitPatientFeedbackAcquiredEvent } from "~/app/core/framework/events";
import { filter, firstValueFrom, Subject, map, tap } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class FeedbackModalService {
    private feedbackEvents = new Subject<FeedbackEvent>();

    constructor(private navigationService: NavigationService) {}

    askFeedback(
        feedbackId: string,
        options: FeedbackModalOptions,
        notificationId?: number
    ): Promise<string> {
        const instanceId = Date.now();

        this.navigationService.navigate(["/main/feedback", instanceId], {
            transition: "fade",
            duration: 200,
            state: options,
        });

        return firstValueFrom(
            this.feedbackEvents.pipe(
                filter((evt) => evt.instanceId === instanceId),
                map((evt) => evt.answer),
                tap((feedback) => {
                    if (feedback === undefined) return;
                    emitPatientFeedbackAcquiredEvent(
                        new UserFeedback(
                            feedbackId,
                            options.feedbackScreen.question,
                            feedback,
                            notificationId
                        )
                    );
                })
            )
        );
    }

    gotFeedback(instanceId: number, answer: string) {
        this.feedbackEvents.next({ instanceId, answer });
    }
}

interface FeedbackEvent {
    instanceId: number;
    answer: string;
}
