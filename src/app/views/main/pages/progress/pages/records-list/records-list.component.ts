import { Component, HostListener, NgZone, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { Record, Change } from "@awarns/core/entities";
import { PatientDataService } from "~/app/views/patient-data.service";
import { RecordType } from "~/app/core/record-type";
import { takeUntil } from "rxjs/operators";
import { AreaOfInterest, areasOfInterest } from "@awarns/geofencing";
import { ActivatedRoute } from "@angular/router";
import { Logger, getLogger } from "~/app/core/utils/logger";
import { QueryCondition } from "~/app/core/framework/patient-data";

export const PLACE_ID_KEY = "placeId";

@Component({
    selector: "SymRecordsList",
    templateUrl: "./records-list.component.html",
    styleUrls: ["./records-list.component.scss"],
})
export class RecordsListComponent implements OnInit {
    records: Array<Record>;
    placeId?: string;
    aoi?: AreaOfInterest;

    private unloaded$ = new Subject<void>();
    private logger: Logger;

    constructor(
        private patientDataService: PatientDataService,
        private activeRoute: ActivatedRoute,
        private ngZone: NgZone
    ) {
        this.logger = getLogger("RecordsListComponent");
    }

    ngOnInit() {
        const routeParams = this.activeRoute.snapshot.paramMap;
        if (!routeParams.has(PLACE_ID_KEY)) return;
        this.placeId = routeParams.get(PLACE_ID_KEY);
        this.retrieveAoIData().catch((err) => {
            this.logger.error(
                `Could not retrieve aoi (${this.placeId}) data. Reason: ${err}`
            );
        });
    }

    @HostListener("loaded")
    onLoaded() {
        this.subscribeToRecordChanges();
    }

    @HostListener("unloaded")
    onUnloaded() {
        this.unloaded$.next();
    }

    private async retrieveAoIData() {
        const aois = await areasOfInterest.getAll();
        this.aoi = aois.find((aoi) => aoi.id === this.placeId);
    }

    private subscribeToRecordChanges() {
        const conditions: Array<QueryCondition> = [
            { property: "change", comparison: "=", value: Change.END },
            { property: "successful", comparison: "=", value: true },
        ];
        if (this.placeId) {
            conditions.push({
                property: "place.id",
                comparison: "=",
                value: this.placeId,
            });
        }

        this.patientDataService
            .observeRecordsByType(RecordType.ExposureChange, conditions)
            .pipe(takeUntil(this.unloaded$))
            .subscribe((records) => {
                this.ngZone.run(() => {
                    this.records = records;
                });
            });
    }
}
