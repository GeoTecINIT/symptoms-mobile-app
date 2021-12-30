import { Injectable } from "@angular/core";
import { combineLatest, Observable, ReplaySubject, timer } from "rxjs";
import { Exposure, exposures } from "~/app/core/persistence/exposures";
import { map } from "rxjs/internal/operators";

const DANGER_THRESHOLD = 8;
const MS_IN_MINUTE = 60000;

@Injectable({
    providedIn: "root",
})
export class UnderExposureService {
    get ongoingExposure$(): Observable<Exposure> {
        return this.lastUnfinishedExposure$.asObservable();
    }

    get inDanger$(): Observable<boolean> {
        return this.ongoingExposure$.pipe(
            map((exposure) => isInDanger(exposure))
        );
    }

    get exposureProgress$(): Observable<number> {
        return combineLatest([
            this.ongoingExposure$,
            timer(0, MS_IN_MINUTE),
        ]).pipe(
            map(([ongoingExposure]) => {
                if (!ongoingExposure) return undefined;
                const diffMinutes =
                    (Date.now() - ongoingExposure.startTime.getTime()) /
                    MS_IN_MINUTE;

                return Math.floor(diffMinutes);
            })
        );
    }

    private readonly lastUnfinishedExposure$ = new ReplaySubject<Exposure>(
        /* keep */ 1
    );

    constructor() {
        this.subscribeToLastUnfinishedExposureChanges();
    }

    private subscribeToLastUnfinishedExposureChanges() {
        this.takeAndBroadcastLastUnfinishedExposure();
        exposures.changes.subscribe(() => {
            this.takeAndBroadcastLastUnfinishedExposure();
        });
    }

    private takeAndBroadcastLastUnfinishedExposure() {
        exposures
            .getLastUnfinished(true)
            .then((exposure) => this.lastUnfinishedExposure$.next(exposure));
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
