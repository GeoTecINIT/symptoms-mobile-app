import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map, share } from "rxjs/operators";

import { PatientDataService } from "~/app/views/patient-data.service";
import { ExposureChange } from "~/app/tasks/exposure";
import { RecordType } from "~/app/core/record-type";
import { Change } from "@geotecinit/emai-framework/entities";

@Component({
    selector: "SymProgressContainer",
    templateUrl: "./progress-container.component.html",
    styleUrls: ["./progress-container.component.scss"],
})
export class ProgressContainerComponent implements OnInit {
    hasData = false;

    idle$: Observable<boolean>;

    constructor(private patientDataService: PatientDataService) {
        this.idle$ = this.patientDataService
            .observeLastByRecordType<ExposureChange>(RecordType.ExposureChange)
            .pipe(
                map(
                    (exposureChange) =>
                        !exposureChange || exposureChange.change === Change.END
                ),
                share()
            );
    }

    ngOnInit() {
        // Use initialized dependencies
    }

    switchDataAvailabilityState() {
        this.hasData = !this.hasData;
    }
}
