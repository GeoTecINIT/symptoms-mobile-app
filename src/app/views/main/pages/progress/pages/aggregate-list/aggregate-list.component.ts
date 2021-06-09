import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { Record } from "@geotecinit/emai-framework/entities";
import { PatientDataService } from "~/app/views/patient-data.service";
import { RecordType } from "~/app/core/record-type";

@Component({
    selector: "SymAggregateList",
    templateUrl: "./aggregate-list.component.html",
    styleUrls: ["./aggregate-list.component.scss"],
})
export class AggregateListComponent {
    records$: Observable<Array<Record>>;

    constructor(private patientDataService: PatientDataService) {
        this.records$ = this.patientDataService.observeLatestGroupedRecordsByType(
            RecordType.ExposurePlaceAggregate,
            "placeId"
        );
    }
}
