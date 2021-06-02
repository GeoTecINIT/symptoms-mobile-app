import { Record } from "@geotecinit/emai-framework/entities";
import { Observable } from "rxjs";
import {
    RecordsStore,
    recordsStore,
} from "@geotecinit/emai-framework/storage/records";
import { map } from "rxjs/operators";

export interface PatientData {
    getLastByRecordType<T extends Record>(
        recordType: string,
        conditions?: Array<QueryCondition>
    );
}

export interface QueryCondition {
    property: string;
    comparison: "=";
    value: any;
}

const INT_MAX_VALUE = Math.pow(2, 31) - 1;

// FIXME: Update EMA/I framework with better support for these queries
class PatientDataStore implements PatientData {
    constructor(private store: RecordsStore = recordsStore) {}

    getLastByRecordType<T extends Record>(
        recordType: string,
        conditions: Array<QueryCondition> = []
    ): Observable<T> {
        return this.store.list(INT_MAX_VALUE).pipe(
            map((records) => {
                for (const record of records) {
                    if (
                        record.type === recordType &&
                        meetsConditions(record, conditions)
                    ) {
                        return record as T;
                    }
                }

                return null;
            })
        );
    }
}

export const patientData = new PatientDataStore();

function meetsConditions(
    record: any,
    conditions: Array<QueryCondition>
): boolean {
    for (const condition of conditions) {
        const propertyValue = record[condition.property];
        if (propertyValue === undefined) {
            return false;
        }
        switch (condition.comparison) {
            case "=":
                if (propertyValue !== condition.value) {
                    return false;
                } else {
                    console.log("Meets condition!", condition);
                    continue;
                }
            default:
                throw new Error(
                    `Unknown condition comparison: ${condition.comparison}`
                );
        }
    }

    return true;
}
