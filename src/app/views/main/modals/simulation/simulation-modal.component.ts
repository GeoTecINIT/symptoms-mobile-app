import { Component } from "@angular/core";
import { NavigationService } from "../../../navigation.service";
import { getLogger, Logger } from "~/app/core/utils/logger";
import { awarns } from "@awarns/core";
import { ServerApiService } from "~/app/core/server";
import { AccountService } from "~/app/core/account";

import { Utils } from "@nativescript/core";

@Component({
    selector: "SymSimulationModal",
    templateUrl: "./simulation-modal.component.html",
    styleUrls: ["./simulation-modal.component.scss"],
})
export class SimulationModalComponent {
    btnMargin = 4;

    private logger: Logger;

    constructor(
        private navigationService: NavigationService,
        private serverClientService: ServerApiService,
        private accountService: AccountService
    ) {
        this.logger = getLogger("SimulationModalComponent");
    }

    onCloseTap() {
        this.navigationService.goBack();
    }

    emitAwarnsFrameworkEvent(eventName: string, data?: any) {
        awarns.emitEvent(eventName, data);
    }

    // emitActivityTransitionEvent() {
    //     console.log("JIJI");
    //     const intent = new android.content.Intent(
    //         "com.example.app.ACTION_PROCESS_ACTIVITY_TRANSITIONS"
    //     );
    //     intent.setPackage(
    //         Utils.android.getApplicationContext().getPackageName()
    //     );

    //     const event = new (<any>(
    //         com.google.android
    //     )).gms.location.ActivityTransitionEvent(
    //         (<any>com.google.android).gms.location.DetectedActivity.WALKING,
    //         (<any>(
    //             com.google.android
    //         )).gms.location.ActivityTransition.ACTIVITY_TRANSITION_ENTER,
    //         new Date().getTime()
    //     );
    //     console.log("JEJE");
    // }

    // doesn't throw JNI Crash
    // emitActivityTransitionEvent() {
    //     console.log("Emitting fake ActivityTransitionEvent");

    //     const ctx = Utils.android.getApplicationContext();

    //     // Must match the action your real PendingIntent / receiver listens for
    //     const intent = new android.content.Intent(
    //         "es.uji.geotec.alert.symptomsapp.TRANSITIONS_RECEIVER_ACTION"
    //     );
    //     intent.setPackage(ctx.getPackageName());

    //     // Use elapsedRealtimeNanos like the Java example
    //     const elapsedRealtimeNanos =
    //         android.os.SystemClock.elapsedRealtimeNanos();

    //     const ActivityTransitionEvent = (<any>com.google.android).gms.location
    //         .ActivityTransitionEvent;
    //     const DetectedActivity = (<any>com.google.android).gms.location
    //         .DetectedActivity;
    //     const ActivityTransition = (<any>com.google.android).gms.location
    //         .ActivityTransition;
    //     const ActivityTransitionResult = (<any>com.google.android).gms.location
    //         .ActivityTransitionResult;
    //     const SafeParcelableSerializer = (<any>com.google.android).gms.common
    //         .internal.safeparcel.SafeParcelableSerializer;

    //     // One fake event: WALKING + ENTER
    //     const event = new ActivityTransitionEvent(
    //         DetectedActivity.WALKING,
    //         ActivityTransition.ACTIVITY_TRANSITION_ENTER,
    //         elapsedRealtimeNanos
    //     );

    //     // Wrap it in a List<ActivityTransitionEvent>
    //     const events = new java.util.ArrayList();
    //     events.add(event);

    //     const result = new ActivityTransitionResult(events);

    //     // Put it in the Intent exactly like Play Services does
    //     SafeParcelableSerializer.serializeToIntentExtra(
    //         result,
    //         intent,
    //         "com.google.android.location.internal.EXTRA_ACTIVITY_TRANSITION_RESULT"
    //     );

    //     // Fire it
    //     ctx.sendBroadcast(intent);
    // }

    // throws JNI Crash
    emitActivityTransitionEvent() {
        console.log("Emitting fake ActivityTransitionEvent");

        const ctx = Utils.android.getApplicationContext();

        // Explicit intent to the receiver class (no action needed)
        const intent = new android.content.Intent();
        intent.setClassName(
            ctx,
            "es.uji.geotec.contextapis.activityrecognition.ActivityTransitionReceiver"
        );
        intent.setPackage(ctx.getPackageName());

        const elapsedRealtimeNanos =
            android.os.SystemClock.elapsedRealtimeNanos();

        const ActivityTransitionEvent = (<any>com.google.android).gms.location
            .ActivityTransitionEvent;
        const DetectedActivity = (<any>com.google.android).gms.location
            .DetectedActivity;
        const ActivityTransition = (<any>com.google.android).gms.location
            .ActivityTransition;
        const ActivityTransitionResult = (<any>com.google.android).gms.location
            .ActivityTransitionResult;
        const SafeParcelableSerializer = (<any>com.google.android).gms.common
            .internal.safeparcel.SafeParcelableSerializer;

        // One fake event: WALKING + ENTER
        const event = new ActivityTransitionEvent(
            DetectedActivity.WALKING,
            ActivityTransition.ACTIVITY_TRANSITION_ENTER,
            elapsedRealtimeNanos
        );

        const events = new java.util.ArrayList();
        events.add(event);

        const result = new ActivityTransitionResult(events);

        SafeParcelableSerializer.serializeToIntentExtra(
            result,
            intent,
            "com.google.android.location.internal.EXTRA_ACTIVITY_TRANSITION_RESULT"
        );

        ctx.sendBroadcast(intent);
    }

    async loadPreviousExposures() {
        await this.serverClientService.queries.getAllRequest(
            this.accountService.deviceProfile.patientId,
            this.accountService.deviceProfile.studyId
        );
    }
}
