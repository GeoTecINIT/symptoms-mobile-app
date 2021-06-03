import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map, share } from "rxjs/operators";

import { PatientDataService } from "~/app/views/patient-data.service";
import { ExposureChange } from "~/app/tasks/exposure";
import { RecordType } from "~/app/core/record-type";
import { Change } from "@geotecinit/emai-framework/entities";
import { emaiFramework } from "@geotecinit/emai-framework";
import { createFakeDataGenerator, DataGenerator } from "./data";

@Component({
    selector: "SymProgressContainer",
    templateUrl: "./progress-container.component.html",
    styleUrls: ["./progress-container.component.scss"],
})
export class ProgressContainerComponent implements OnInit {
    idle$: Observable<boolean>;
    private readonly generateData: DataGenerator;

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
        this.generateData = createFakeDataGenerator();
    }

    ngOnInit() {
        // Use initialized dependencies
    }

    switchDataAvailabilityState() {
        const exposureChange = this.generateData();
        if (exposureChange) {
            emaiFramework.emitEvent("exposureFinished", exposureChange);
        }
    }
}
