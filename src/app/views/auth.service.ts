import { Injectable } from "@angular/core";
import { firstValueFrom, Observable, ReplaySubject } from "rxjs";
import { AccountService, AdvancedSettingsService } from "~/app/core/account";
import { getLogger, Logger } from "~/app/core/utils/logger";
import { FirebaseAuthService } from "~/app/core/auth/firebase/firebase-auth.service";
import { ServerApiService } from "~/app/core/server";

import { localRecordsStore } from "@awarns/persistence/internal/stores/timeseries/records/store";
import { ExposureChange } from "../tasks/exposure";
import {
    ExposureAggregate,
    ExposureAggregatePoint,
} from "../tasks/visualizations/exposure-aggregate";
import { AppRecordType } from "../core/app-record-type";
import { calculateEmotionValuesAvg } from "../tasks/visualizations/common";
import { EmotionValue } from "../core/persistence/exposures";
import { ExposurePlaceAggregate } from "../tasks/visualizations/exposure-place-aggregate";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    get loggedIn$(): Observable<boolean> {
        return this.authSubject.asObservable();
    }

    private authSubject = new ReplaySubject<boolean>(1);

    private readonly logger: Logger;

    constructor(
        private accountService: AccountService,
        private advancedSettingsService: AdvancedSettingsService,
        private firebaseAuthService: FirebaseAuthService,
        private serverClientService: ServerApiService
    ) {
        this.authSubject.next(this.accountService.deviceProfile.linked);
        this.logger = getLogger("AuthService");
    }

    async login(accessCode: string): Promise<[boolean, string]> {
        try {
            await this.accountService.deviceProfile.linkApp(accessCode);
            await this.firebaseAuthService.refreshToken();
            this.authSubject.next(true);
        } catch (e) {
            this.logger.warn(`Login error: ${JSON.stringify(e)}`);

            return [false, JSON.stringify(e)];
        }

        try {
            await this.loadPreviousExposures();
        } catch (e) {
            this.logger.warn(`Load previous exposures error: ${e}`);
            return [false, JSON.stringify(e)];
        }

        return [true, ""];
    }

    private async loadPreviousExposures() {
        const [exposureAggregateRecords, changeEndRecords] =
            await this.serverClientService.queries.getAllRequest(
                this.accountService.deviceProfile.patientId,
                this.accountService.deviceProfile.studyId
            );

        const unwantedPlacesIds = ["lugar 1", "lugar 2", "lugar 3"];
        const unwantedRecordsFilter = (ec: ExposureChange) =>
            ec.successful && !unwantedPlacesIds.includes(ec.place.id);

        const records = changeEndRecords.filter(unwantedRecordsFilter);

        console.log("records length 👉👉👉👉", records.length);

        let i = 0;
        for (const cer of records) {
            const exposureAggregate = await this.calculateAggregate(cer);

            if (i === records.length - 1)
                console.log(
                    "final exposureAggregate 👉👉👉",
                    exposureAggregate
                );

            localRecordsStore.insert(exposureAggregate, true);

            const exposurePlaceAggregate = await this.calculatePlaceAggregate(
                cer
            );
            localRecordsStore.insert(exposurePlaceAggregate, true);
            i += 1;
        }

        console.log(
            "localRecordsStore.list 👉👉👉👉👉👉",
            localRecordsStore.list()[0]
        );
    }

    private async calculateAggregate(exposureChange: ExposureChange) {
        const { timestamp, emotionValues } = exposureChange;
        const { id, name } = exposureChange.place;

        const newEmotionValue = {
            timestamp,
            value: calculateEmotionValuesAvg(emotionValues),
        };
        const newEntry: ExposureAggregatePoint = {
            placeId: id,
            placeName: name,
            emotionValues: [newEmotionValue],
        };

        const prevAggregate = (await firstValueFrom(
            localRecordsStore.listLast(AppRecordType.ExposureAggregate)
        )) as ExposureAggregate;

        const samePlace = (placeAggregate) => placeAggregate.placeId === id;

        let aggregatePoints: Array<ExposureAggregatePoint>;
        if (!prevAggregate) {
            aggregatePoints = [newEntry];
        } else if (!prevAggregate.data.find(samePlace)) {
            aggregatePoints = [...prevAggregate.data, newEntry];
        } else {
            aggregatePoints = [...prevAggregate.data];
            const placeIndex = aggregatePoints.findIndex(samePlace);
            aggregatePoints[placeIndex] = {
                ...aggregatePoints[placeIndex],
                placeName: name,
                emotionValues: [
                    ...aggregatePoints[placeIndex].emotionValues,
                    newEmotionValue,
                ],
            };
        }

        return new ExposureAggregate(aggregatePoints);
    }

    private async calculatePlaceAggregate(
        exposureChange: ExposureChange
    ): Promise<ExposurePlaceAggregate> {
        const { timestamp, emotionValues } = exposureChange;
        const { id, name } = exposureChange.place;

        const newEntry: EmotionValue = {
            timestamp,
            value: calculateEmotionValuesAvg(emotionValues),
        };

        const prevAggregate = (await firstValueFrom(
            localRecordsStore.listLast(AppRecordType.ExposurePlaceAggregate, [
                { property: "placeId", comparison: "=", value: id },
            ])
        )) as ExposurePlaceAggregate;

        const updatedEmotionValues = prevAggregate
            ? [...prevAggregate.emotionValues, newEntry]
            : [newEntry];

        return new ExposurePlaceAggregate(id, name, updatedEmotionValues);
    }

    async logout(): Promise<void> {
        await this.accountService.deviceProfile.logout();
        await this.advancedSettingsService.reset();
        await this.firebaseAuthService.clearSession();
        this.authSubject.next(false);
    }
}
