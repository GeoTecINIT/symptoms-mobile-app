import { Component, HostListener, NgZone } from "@angular/core";
import { NavigationService } from "~/app/views/navigation.service";
import { ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs";

import { Record } from "@awarns/core/entities";
import { recordsStore } from "@awarns/persistence";
import { AppRecordType } from "~/app/core/app-record-type";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "SymAggregateList",
    templateUrl: "./aggregate-list.component.html",
    styleUrls: ["./aggregate-list.component.scss"],
})
export class AggregateListComponent {
    aggregates: Array<Record>;

    private unloaded$ = new Subject<void>();

    constructor(
        private navigationService: NavigationService,
        private activeRoute: ActivatedRoute,
        private ngZone: NgZone
    ) {}

    @HostListener("loaded")
    onLoaded() {
        this.subscribeToAggregateChanges();
    }

    @HostListener("unloaded")
    onUnloaded() {
        this.unloaded$.next();
    }

    private subscribeToAggregateChanges() {
        recordsStore
            .listLastGroupedBy(AppRecordType.ExposurePlaceAggregate, "placeId")
            .pipe(takeUntil(this.unloaded$))
            .subscribe((aggregates) => {
                this.ngZone.run(() => {
                    this.aggregates = aggregates;
                });
            });
    }

    onSeeMoreTap(placeId: string) {
        this.navigate("../records-list", placeId);
    }

    private navigate(route: string, param?: any) {
        const url = [route];
        if (param !== undefined && param !== null) url.push(param);
        this.navigationService.navigate(url, this.activeRoute);
    }
}
