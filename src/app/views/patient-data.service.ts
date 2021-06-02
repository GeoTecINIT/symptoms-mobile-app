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
    getLastByRecordType<T extends Record>(recordType: string): Observable<T> {
        return recordsStore.list(INT_MAX_VALUE).pipe(
            map((records) => {
                for (const record of records) {
                    if (record.type === recordType) {
                        return record as T;
                    }
                }

                return null;
            })
        );
    }
}
