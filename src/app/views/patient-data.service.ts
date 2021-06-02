import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { Record } from "@geotecinit/emai-framework/entities";
import { patientData, QueryCondition } from "~/app/core/framework/patient-data";

@Injectable({
    providedIn: "root",
})
export class PatientDataService {
    getLastByRecordType<T extends Record>(
        recordType: string,
        conditions: Array<QueryCondition> = []
    ): Observable<T> {
        return patientData.getLastByRecordType<T>(recordType, conditions);
    }
}
