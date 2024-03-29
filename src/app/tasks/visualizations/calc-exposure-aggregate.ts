import {
    DispatchableEvent,
    Task,
    TaskOutcome,
    TaskParams,
} from "@awarns/core/tasks";
import { recordsStore, RecordsStore } from "@awarns/persistence";
import { ExposureChange } from "~/app/tasks/exposure";
import { AppRecordType } from "~/app/core/app-record-type";
import {
    ExposureAggregate,
    ExposureAggregatePoint,
} from "~/app/tasks/visualizations/exposure-aggregate";
import { firstValueFrom } from "rxjs";
import { calculateEmotionValuesAvg } from "~/app/tasks/visualizations/common";

export class CalculateExposureAggregate extends Task {
    constructor(private store: RecordsStore = recordsStore) {
        super("calculateExposureAggregate", {
            outputEventNames: ["exposureAggregateCalculated"],
        });
    }

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<TaskOutcome> {
        const exposureChange = invocationEvent.data as ExposureChange;

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
            this.store.listLast(AppRecordType.ExposureAggregate)
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

        const aggregate = new ExposureAggregate(aggregatePoints);

        return { result: aggregate };
    }
}
