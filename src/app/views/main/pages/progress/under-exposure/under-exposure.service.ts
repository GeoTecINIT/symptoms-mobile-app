import { Injectable } from "@angular/core";
import { Observable, of, merge } from "rxjs";
import { Exposure, exposures } from "~/app/core/persistence/exposures";
import { share, switchMap } from "rxjs/operators";
import { map } from "rxjs/internal/operators";

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

    private readonly _ongoingExposure$: Observable<Exposure>;
    private readonly _inDanger$: Observable<boolean>;

    constructor() {
        this._ongoingExposure$ = merge(of([]), exposures.changes).pipe(
            switchMap(() => exposures.getLastUnfinished()),
            share()
        );
        this._inDanger$ = this._ongoingExposure$.pipe(
            map((exposure) => isInDanger(exposure))
        );
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
