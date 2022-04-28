import {
    DispatchableEvent,
    TaskOutcome,
    TaskParams,
    TraceableTask,
} from "@awarns/core/tasks";
import { patientData, PatientData } from "~/app/core/framework/patient-data";
import { ExposureChange } from "~/app/tasks/exposure";
import { RecordType } from "~/app/core/record-type";
import {
    ExposureAggregate,
    ExposureAggregatePoint,
} from "~/app/tasks/visualizations/exposure-aggregate";
import { firstValueFrom } from "rxjs";
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

        const newEmotionValue = {
            timestamp,
            value: calculateEmotionValuesAvg(emotionValues),
        };
        const newEntry: ExposureAggregatePoint = {
            placeId: id,
            placeName: name,
            emotionValues: [newEmotionValue],
        };

        const prevAggregate = await firstValueFrom(
            this.store.observeLastByRecordType<ExposureAggregate>(
                RecordType.ExposureAggregate
            )
        );

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
