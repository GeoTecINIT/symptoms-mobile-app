import {
    DispatchableEvent,
    TaskOutcome,
    TaskParams,
    TraceableTask,
} from "@geotecinit/emai-framework/tasks";
import { patientData, PatientData } from "~/app/core/framework/patient-data";
import { ExposureChange } from "~/app/tasks/exposure";
import { RecordType } from "~/app/core/record-type";
import {
    ExposureAggregate,
    ExposureAggregatePoint,
} from "~/app/tasks/visualizations/exposure-aggregate";
import { take } from "rxjs/operators";
import { calculateEmotionValuesAvg } from "~/app/tasks/visualizations/common";

export class CalculateExposureAggregate extends TraceableTask {
    constructor(private store: PatientData = patientData) {
        super("calculateExposureAggregate", {
            outputEventNames: ["exposureAggregateCalculated"],
        });
    }

    protected async onTracedRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<TaskOutcome> {
        const exposureChange = invocationEvent.data as ExposureChange;

        const { timestamp, emotionValues } = exposureChange;
        const { id, name } = exposureChange.place;

        const newEntry: ExposureAggregatePoint = {
            timestamp,
            place: { id, name },
            value: calculateEmotionValuesAvg(emotionValues),
        };

        const prevAggregate = await this.store
            .observeLastByRecordType<ExposureAggregate>(
                RecordType.ExposureAggregate
            )
            .pipe(take(1))
            .toPromise();

        const data = prevAggregate
            ? [...prevAggregate.data, newEntry]
            : [newEntry];

        const aggregate = new ExposureAggregate(data);

        return { result: aggregate };
    }
}
