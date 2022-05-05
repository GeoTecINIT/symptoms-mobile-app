import { Record } from "@awarns/core/entities";
import { Observable } from "rxjs";
import { RecordsStore, recordsStore } from "@awarns/persistence";
import { distinctUntilChanged, map } from "rxjs/operators";

export interface PatientData {
    observeLastByRecordType<T extends Record>(
        recordType: string,
        conditions?: Array<QueryCondition>
    ): Observable<T>;
    observeRecordsByType<T extends Record>(
        recordType: string,
        conditions?: Array<QueryCondition>
    ): Observable<Array<T>>;
    observeLatestGroupedRecordsByType<T extends Record>(
        recordType: string,
        groupByProperty: string,
        conditions?: Array<QueryCondition>
    ): Observable<Array<T>>;
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

    observeLastByRecordType<T extends Record>(
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
            }),
            distinctUntilChanged(areEqual)
        );
    }

    observeRecordsByType<T extends Record>(
        recordType: string,
        conditions: Array<QueryCondition> = []
    ): Observable<Array<T>> {
        return this.store.list(INT_MAX_VALUE).pipe(
            map((records) => {
                const filteredRecords: Array<T> = [];
                for (const record of records) {
                    if (
                        record.type === recordType &&
                        meetsConditions(record, conditions)
                    ) {
                        filteredRecords.push(record as T);
                    }
                }

                return filteredRecords;
            }),
            distinctUntilChanged(areEqual)
        );
    }

    observeLatestGroupedRecordsByType<T extends Record>(
        recordType: string,
        groupByProperty: string,
        conditions: Array<QueryCondition> = []
    ): Observable<Array<T>> {
        return this.store.list(INT_MAX_VALUE).pipe(
            map((records) => {
                const groups = new Set<string>();
                for (const record of records) {
                    const groupedProperty = record[groupByProperty];
                    if (
                        record.type === recordType &&
                        groupedProperty &&
                        meetsConditions(record, conditions)
                    ) {
                        groups.add(groupedProperty);
                    }
                }

                const filteredRecords: Array<T> = [];
                for (const group of groups) {
                    for (const record of records) {
                        if (
                            record.type === recordType &&
                            record[groupByProperty] === group &&
                            meetsConditions(record, conditions)
                        ) {
                            filteredRecords.push(record as T);
                            break;
                        }
                    }
                }

                return filteredRecords.sort(
                    (r1, r2) => r2.timestamp.getTime() - r1.timestamp.getTime()
                );
            }),
            distinctUntilChanged(areEqual)
        );
    }
}

export const patientData = new PatientDataStore();

function meetsConditions(
    record: any,
    conditions: Array<QueryCondition>
): boolean {
    for (const condition of conditions) {
        const propertyValue = getPropertyValue(record, condition.property);
        if (propertyValue === undefined) {
            return false;
        }
        switch (condition.comparison) {
            case "=":
                if (propertyValue !== condition.value) {
                    return false;
                } else {
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

function areEqual(obj1: any, obj2: any) {
    // Naive equality comparison, will fail if object properties are reordered
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

function getPropertyValue(object: any, path: string) {
    const segments = path.split(".");
    let property = object;
    for (const segment of segments) {
        property = property[segment];
    }

    return property;
}
