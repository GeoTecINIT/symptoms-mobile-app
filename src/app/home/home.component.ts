import { Component, OnInit } from '@angular/core';

import { DataService, DataItem } from '../shared/data.service';
import { schedule } from '../core/schedulers';
import { AndroidAlarmManager } from '../core/schedulers/alarms/alarm-manager.android';

@Component({
    selector: 'Home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
    items: Array<DataItem>;
    private alarmManager: AndroidAlarmManager;

    constructor(private _itemService: DataService) {
        this.alarmManager = new AndroidAlarmManager();
    }

    ngOnInit(): void {
        this.items = this._itemService.getItems();
        schedule(60, 'simpleTask')
            .then((scheduledTask) => {
                console.log(
                    `Task successfully scheduled: ${JSON.stringify(
                        scheduledTask
                    )}`
                );
                if (!this.alarmManager.alarmUp) {
                    console.log('Alarm was not up! Scheduling...');
                    this.alarmManager.set(scheduledTask.interval);
                }
            })
            .catch((err) => {
                console.log(
                    `An error occurred while trying to schedule a task: ${err}`
                );
            });
    }
}
