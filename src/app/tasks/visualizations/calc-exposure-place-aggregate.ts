import {
    DispatchableEvent,
    Task,
    TaskOutcome,
    TaskParams,
} from "@awarns/core/tasks";
import { recordsStore, RecordsStore } from "@awarns/persistence";
import { ExposureChange } from "~/app/tasks/exposure";
import { EmotionValue } from "~/app/core/persistence/exposures";
import { calculateEmotionValuesAvg } from "~/app/tasks/visualizations/common";
import { ExposurePlaceAggregate } from "~/app/tasks/visualizations/exposure-place-aggregate";
import { AppRecordType } from "~/app/core/app-record-type";
import { firstValueFrom } from "rxjs";

export class CalculateExposurePlaceAggregate extends Task {
    constructor(private store: RecordsStore = recordsStore) {
        super("calculateExposurePlaceAggregate", {
            outputEventNames: ["exposurePlaceAggregateCalculated"],
        });
    }

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<TaskOutcome> {
        const exposureChange = invocationEvent.data as ExposureChange;

        const { timestamp, emotionValues } = exposureChange;
        const { id, name } = exposureChange.place;

        const newEntry: EmotionValue = {
            timestamp,
            value: calculateEmotionValuesAvg(emotionValues),
        };

        const prevAggregate = (await firstValueFrom(
            this.store.listLast(AppRecordType.ExposurePlaceAggregate, [
                { property: "placeId", comparison: "=", value: id },
            ])
        )) as ExposurePlaceAggregate;

        const updatedEmotionValues = prevAggregate
            ? [...prevAggregate.emotionValues, newEntry]
            : [newEntry];

        const aggregate = new ExposurePlaceAggregate(
            id,
            name,
            updatedEmotionValues
        );

        return { result: aggregate };
    }
}
