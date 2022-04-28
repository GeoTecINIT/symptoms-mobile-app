import {
    DispatchableEvent,
    TaskOutcome,
    TaskParams,
    TraceableTask,
} from "@awarns/core/tasks";
import { patientData, PatientData } from "~/app/core/framework/patient-data";
import { ExposureChange } from "~/app/tasks/exposure";
import { EmotionValue } from "~/app/core/persistence/exposures";
import { calculateEmotionValuesAvg } from "~/app/tasks/visualizations/common";
import { ExposurePlaceAggregate } from "~/app/tasks/visualizations/exposure-place-aggregate";
import { RecordType } from "~/app/core/record-type";
import { firstValueFrom } from "rxjs";

export class CalculateExposurePlaceAggregate extends TraceableTask {
    constructor(private store: PatientData = patientData) {
        super("calculateExposurePlaceAggregate", {
            outputEventNames: ["exposurePlaceAggregateCalculated"],
        });
    }

    protected async onTracedRun(
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

        const prevAggregate = await firstValueFrom(
            this.store.observeLastByRecordType<ExposurePlaceAggregate>(
                RecordType.ExposurePlaceAggregate,
                [{ property: "placeId", comparison: "=", value: id }]
            )
        );

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
