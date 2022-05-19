import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { Record } from "@awarns/core/entities";
import { patientData, QueryCondition } from "~/app/core/framework/patient-data";

@Injectable({
    providedIn: "root",
})
export class PatientDataService {
    observeLastByRecordType<T extends Record>(
        recordType: string,
        conditions: Array<QueryCondition> = []
    ): Observable<T> {
        return patientData.observeLastByRecordType<T>(recordType, conditions);
    }

    observeRecordsByType<T extends Record>(
        recordType: string,
        conditions: Array<QueryCondition> = []
    ): Observable<Array<T>> {
        return patientData.observeRecordsByType<T>(recordType, conditions);
    }
}
