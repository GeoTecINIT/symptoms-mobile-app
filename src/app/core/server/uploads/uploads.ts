import {
    UploadRecordsRequest,
    UploadsPromiseClient,
    UploadTelemetryRequest,
} from "@symptoms/api-client/uploads";
import { GRPCServiceOptions } from "~/app/core/server/common";
import { Change, Record } from "@geotecinit/emai-framework/entities";
import {
    Trace,
    TraceType,
    TraceResult,
} from "@geotecinit/emai-framework/storage/traces";
import { Record as PBRecord, RecordSource } from "@symptoms/api-client/records";
import { Trace as PBTrace } from "@symptoms/api-client/traces";
import { Timestamp } from "google-protobuf/google/protobuf/timestamp_pb";
import { jsonDateReplacer } from "@geotecinit/emai-framework/internal/utils/date";

export type ApiRecord = Record & UploadMetadata;
export type ApiTrace = Trace & UploadMetadata;
interface UploadMetadata {
    deviceId: string;
}

export class UploadsApiAdapter {
    private readonly client: UploadsPromiseClient;

    constructor(url: string, options: GRPCServiceOptions) {
        this.client = new UploadsPromiseClient(url, null, options);
    }

    async uploadRecords(
        patientId: string,
        studyId: string,
        records: Array<ApiRecord>
    ): Promise<Array<string>> {
        const pbRecords = pbRecordsFrom(records);

        const request = new UploadRecordsRequest();
        request.setPatientId(patientId);
        request.setStudyId(studyId);
        request.setSource(RecordSource.PATIENT);
        request.setRecordsList(pbRecords);

        const resp = await this.client.uploadRecords(request);

        return resp.getIdsList();
    }

    async uploadTraces(
        patientId: string,
        studyId: string,
        traces: Array<ApiTrace>
    ): Promise<void> {
        const pbTraces = pbTracesFrom(traces);

        const request = new UploadTelemetryRequest();
        request.setPatientId(patientId);
        request.setStudyId(studyId);
        request.setTracesList(pbTraces);

        await this.client.uploadTelemetry(request);
    }
}

function pbRecordsFrom(records: Array<ApiRecord>): Array<PBRecord> {
    return records.map((record) => {
        const {
            timestamp,
            type,
            change,
            deviceId,
            ...extraProperties
        } = record;

        const pbRecord = new PBRecord();
        pbRecord.setType(type);
        pbRecord.setTimestamp(pbTimestampFrom(timestamp));
        pbRecord.setTzOffset(timestamp.getTimezoneOffset());
        pbRecord.setDeviceId(deviceId);
        pbRecord.setChange(pbRecordChangeFrom(change));
        pbRecord.setPayload(JSON.stringify(extraProperties, jsonDateReplacer));

        return pbRecord;
    });
}

function pbRecordChangeFrom(change: Change): PBRecord.Change {
    switch (change) {
        case Change.NONE:
            return PBRecord.Change.NONE;
        case Change.START:
            return PBRecord.Change.START;
        case Change.END:
            return PBRecord.Change.END;
        default:
            throw new Error(`Unknown record change type: ${change}`);
    }
}

function pbTracesFrom(traces: Array<ApiTrace>): Array<PBTrace> {
    return traces.map((trace) => {
        const {
            deviceId,
            timestamp,
            chainId,
            name,
            type,
            result,
            content,
        } = trace;

        const apiTrace = new PBTrace();
        apiTrace.setDeviceId(deviceId);
        apiTrace.setTimestamp(pbTimestampFrom(timestamp));
        apiTrace.setTzOffset(timestamp.getTimezoneOffset());
        apiTrace.setChainId(chainId);
        apiTrace.setObservationName(name);
        apiTrace.setType(pbTraceTypeFrom(type));
        apiTrace.setResult(pbTraceResultFrom(result));
        apiTrace.setPayload(JSON.stringify(content, jsonDateReplacer));

        return apiTrace;
    });
}

function pbTraceTypeFrom(type: TraceType): PBTrace.Type {
    switch (type) {
        case TraceType.EVENT:
            return PBTrace.Type.EVENT;
        case TraceType.TASK:
            return PBTrace.Type.TASK;
        default:
            throw new Error(`Unknown trace type: ${type}`);
    }
}

function pbTraceResultFrom(result: TraceResult): PBTrace.Result {
    switch (result) {
        case TraceResult.OK:
            return PBTrace.Result.OK;
        case TraceResult.ERROR:
            return PBTrace.Result.ERROR;
        default:
            throw new Error(`Unknown trace result: ${result}`);
    }
}

function pbTimestampFrom(date: Date) {
    const pbTimestamp = new Timestamp();
    pbTimestamp.fromDate(date);

    return pbTimestamp;
}
