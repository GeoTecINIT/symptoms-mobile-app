import { Injectable } from "@angular/core";
import { Record } from "@geotecinit/emai-framework/entities";
import { Observable } from "rxjs";
import { recordsStore } from "@geotecinit/emai-framework/storage/records";
import { map } from "rxjs/operators";

const INT_MAX_VALUE = Math.pow(2, 31) - 1;

// FIXME: Update EMA/I framework with better support for these queries
@Injectable({
    providedIn: "root",
})
export class PatientDataService {
    getLastByRecordType<T extends Record>(
        recordType: string,
        conditions: Array<QueryCondition> = []
    ): Observable<T> {
        return recordsStore.list(INT_MAX_VALUE).pipe(
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

export interface QueryCondition {
    property: string;
    comparison: "=";
    value: any;
}
