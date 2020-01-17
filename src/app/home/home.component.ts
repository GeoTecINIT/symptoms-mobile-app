import { Component, OnInit } from "@angular/core";

import { DataService, DataItem } from "../shared/data.service";
import { schedule } from "../core/schedulers";

@Component({
    selector: "Home",
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
    items: Array<DataItem>;

    constructor(private _itemService: DataService) {}

    ngOnInit(): void {
        this.items = this._itemService.getItems();
        schedule(60, "simpleTask")
            .then(scheduledTask => {
                console.log(
                    `Task successfully scheduled: ${JSON.stringify(
                        scheduledTask
                    )}`
                );
            })
            .catch(err => {
                console.log(
                    `An error occurred while trying to schedule a task: ${err}`
                );
            });
    }
}
