import {
    DispatchableEvent,
    TaskOutcome,
    TaskParams,
    TraceableTask,
} from "@geotecinit/emai-framework/tasks";
import { patientData, PatientData } from "~/app/core/framework/patient-data";
import { ExposureChange } from "~/app/tasks/exposure";
import { EmotionValue } from "~/app/core/persistence/exposures";
import { calculateEmotionValuesAvg } from "~/app/tasks/visualizations/common";
import { ExposurePlaceAggregate } from "~/app/tasks/visualizations/exposure-place-aggregate";
import { RecordType } from "~/app/core/record-type";
import { take } from "rxjs/operators";

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

        const prevAggregate = await this.store
            .observeLastByRecordType<ExposurePlaceAggregate>(
                RecordType.ExposurePlaceAggregate,
                [{ property: "placeId", comparison: "=", value: id }]
            )
            .pipe(take(1))
            .toPromise();

        const updatedEmotionValues = prevAggregate
            ? [...prevAggregate.emotionValues, newEntry]
            : [newEntry];

        const aggregate = new ExposurePlaceAggregate(
            id,
            name,
            updatedEmotionValues
        );

        // FIXME: Temporal workaround for multiple concurrent record writes
        await returnIn(500);

        return { result: aggregate };
    }
}

function returnIn(ms: number): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
