import { Injectable } from "@angular/core";
import { Observable, ReplaySubject } from "rxjs";
import { Exposure, exposures } from "~/app/core/persistence/exposures";
import { map } from "rxjs/internal/operators";
import { dial, requestCallPermission } from "nativescript-phone";
import { getLogger, Logger } from "~/app/core/utils/logger";

const DANGER_THRESHOLD = 8;

@Injectable({
    providedIn: "root",
})
export class UnderExposureService {
    get ongoingExposure$(): Observable<Exposure> {
        return this.lastUnfinishedExposure$.asObservable();
    }

    get inDanger$(): Observable<boolean> {
        return this.lastUnfinishedExposure$
            .asObservable()
            .pipe(map((exposure) => isInDanger(exposure)));
    }

    private readonly therapistPhone: string;

    private readonly lastUnfinishedExposure$ = new ReplaySubject<Exposure>(
        /* keep */ 1
    );

    private logger: Logger;

    constructor() {
        this.logger = getLogger("UnderExposureService");
        this.subscribeToLastUnfinishedExposureChanges();
        this.therapistPhone = `${global.ENV_THERAPIST_PHONE}`;
    }

    async callTherapist(): Promise<boolean> {
        const phoneNumber = this.therapistPhone;
        try {
            await requestCallPermission(
                "Necesitamos este permiso para poder llamar a tu terapeuta"
            );

            return this.dial(phoneNumber, false);
        } catch (e) {
            this.logger.error(`Call permission request failed. Reason: ${e}`);

            return this.dial(phoneNumber, true);
        }
    }

    private subscribeToLastUnfinishedExposureChanges() {
        this.takeAndBroadcastLastUnfinishedExposure();
        exposures.changes.subscribe(() => {
            this.takeAndBroadcastLastUnfinishedExposure();
        });
    }

    private takeAndBroadcastLastUnfinishedExposure() {
        exposures
            .getLastUnfinished()
            .then((exposure) => this.lastUnfinishedExposure$.next(exposure));
    }

    private dial(phone: string, askPermission: boolean): boolean {
        try {
            dial(phone, askPermission);

            return true;
        } catch (e) {
            this.logger.error(`Could not call therapist. Reason: ${e}`);

            return false;
        }
    }
}

function isInDanger(exposure: Exposure): boolean {
    if (!exposure || exposure.emotionValues.length === 0) {
        return false;
    }
    const lastValue =
        exposure.emotionValues[exposure.emotionValues.length - 1].value;

    return lastValue >= DANGER_THRESHOLD;
}
