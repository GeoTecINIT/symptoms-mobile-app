import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { Record } from "@geotecinit/emai-framework/entities";
import { PatientDataService } from "~/app/views/patient-data.service";
import { RecordType } from "~/app/core/record-type";
import { Change } from "@geotecinit/emai-framework/internal/providers";

@Component({
    selector: "SymRecordsList",
    templateUrl: "./records-list.component.html",
    styleUrls: ["./records-list.component.scss"],
})
export class RecordsListComponent {
    records$: Observable<Array<Record>>;

    constructor(private patientDataService: PatientDataService) {
        this.records$ = this.patientDataService.observeRecordsByType(
            RecordType.ExposureChange,
            [
                { property: "change", comparison: "=", value: Change.END },
                { property: "successful", comparison: "=", value: true },
            ]
        );
    }
}
