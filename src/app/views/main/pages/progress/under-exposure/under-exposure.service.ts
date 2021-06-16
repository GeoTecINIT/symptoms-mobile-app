import { Injectable } from "@angular/core";
import { Observable, of, merge } from "rxjs";
import { Exposure, exposures } from "~/app/core/persistence/exposures";
import { share, switchMap } from "rxjs/operators";
import { map } from "rxjs/internal/operators";
import { requestCallPermission, dial } from "nativescript-phone";
import { getLogger, Logger } from "~/app/core/utils/logger";

const DANGER_THRESHOLD = 8;

@Injectable({
    providedIn: "root",
})
export class UnderExposureService {
    get ongoingExposure$(): Observable<Exposure> {
        return this._ongoingExposure$;
    }

    get inDanger$(): Observable<boolean> {
        return this._inDanger$;
    }

    private readonly therapistPhone: string;

    private readonly _ongoingExposure$: Observable<Exposure>;
    private readonly _inDanger$: Observable<boolean>;
    private logger: Logger;

    constructor() {
        this.logger = getLogger("UnderExposureService");
        this._ongoingExposure$ = merge(of([]), exposures.changes).pipe(
            switchMap(() => exposures.getLastUnfinished()),
            share()
        );
        this._inDanger$ = this._ongoingExposure$.pipe(
            map((exposure) => isInDanger(exposure))
        );
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
