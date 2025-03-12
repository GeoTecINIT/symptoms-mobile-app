import { Buffer } from "buffer/";

import {
    RecordQueriesPromiseClient,
    GetAllRequest,
    QueryCondition,
    StringValue,
    QueryOrder,
} from "@symptoms/api-client/queries";
import { Record as PBRecord } from "@symptoms/api-client/records";
import { GRPCServiceOptions } from "../common";
import { Change, Record } from "@awarns/core/entities";
import { Any } from "google-protobuf/google/protobuf/any_pb";
import { ExposureChange } from "~/app/tasks/exposure";
import { AreaOfInterest } from "@awarns/geofencing";
import { ContextualConditions, WeatherSummary } from "../../weather";
import { EmotionValue } from "../../persistence/exposures";
import { getLogger, Logger } from "../../utils/logger";

export class QueriesApiAdapter {
    private readonly client: RecordQueriesPromiseClient;
    private logger: Logger;

    constructor(url: string, options: GRPCServiceOptions) {
        this.client = new RecordQueriesPromiseClient(url, null, options);
    }

    private transformEmotionValues(
        emotionValues: Array<any>
    ): Array<EmotionValue> {
        if (!emotionValues) {
            return [];
        }
        return emotionValues.map((ev) => ({
            value: ev.value,
            timestamp: this.transformTimestamp(ev.timestamp),
        }));
    }

    private transformTimestamp(timestamp: {
        value: number;
        offset: number;
    }): Date {
        const offsetMs = timestamp.offset * 60000;
        return new Date(timestamp.value + offsetMs);
    }

    private recordChangeFrom(pbChange: PBRecord.Change): Change {
        switch (pbChange) {
            case PBRecord.Change.NONE:
                return Change.NONE;
            case PBRecord.Change.START:
                return Change.START;
            case PBRecord.Change.END:
                return Change.END;
            default:
                throw new Error(`Unknown record change type: ${pbChange}`);
        }
    }

    async getAllChangeEnd(
        patientId: string,
        studyId: string
    ): Promise<ExposureChange[]> {
        const request = new GetAllRequest();
        request.setPatientId(patientId);
        request.setStudyId(studyId);
        request.setRecordType("exposure-change");
        request.setOrder(QueryOrder.ASC);

        const condition = new QueryCondition();
        condition.setProperty("change");
        condition.setComparison(QueryCondition.Comparison.EQUAL_TO);

        const numValue = new StringValue();
        numValue.setValue("2");

        const buffer = Buffer.from(numValue.getValue());
        const base64data = buffer.toString("base64");

        const anyValue = new Any();
        anyValue.setTypeUrl("api.queries.StringValue");
        anyValue.setValue(base64data);

        condition.setValue(anyValue);
        request.setConditionsList([condition]);

        let resp;
        try {
            resp = await this.client.getAll(request);
        } catch (e) {
            this.getLogger().error(
                `Something went wrong in getAll exposures-change request for patient ${patientId} and study ${studyId}`
            );
            return [];
        }

        const records: ExposureChange[] = resp
            .getRecordsList()
            .map((record) => {
                const payload = JSON.parse(record.getPayload());
                return {
                    id: record.getId(),
                    type: record.getType(),
                    timestamp: record.getTimestamp()!.toDate(),
                    change: this.recordChangeFrom(record.getChange()),
                    exposureId: payload.id as string,
                    place: payload.place as AreaOfInterest,
                    successful: payload.successful,
                    contextualConditions:
                        payload?.contextualConditions as ContextualConditions,
                    weatherSummary: payload?.weatherSummary as WeatherSummary,
                    emotionValues: this.transformEmotionValues(
                        payload.emotionValues
                    ),
                    toleranceValues: this.transformEmotionValues(
                        payload?.toleranceValues
                    ),
                };
            });

        return records;
    }

    async getAllRequest(
        patientId: string,
        studyId: string
    ): Promise<[Record[], ExposureChange[]]> {
        const [exposureAggregateRecords, changeEndRecords] = await Promise.all([
            // this.getAllExposureAggregate(patientId, studyId),
            [],
            this.getAllChangeEnd(patientId, studyId),
        ]);
        return [exposureAggregateRecords, changeEndRecords];
    }

    private getLogger() {
        if (!this.logger) {
            this.logger = getLogger("QueriesController");
        }

        return this.logger;
    }
}
