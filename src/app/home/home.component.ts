import { Component, OnInit } from '@angular/core';
import { android as androidApp } from 'tns-core-modules/application/application';

import { DataService, DataItem } from '../shared/data.service';
import { schedule } from '../core/schedulers';
import { AndroidAlarmManager } from '../core/schedulers/alarms/alarm-manager.android';
import { setupNotificationChannels } from '../core/notification-manager.android';

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
        if (androidApp) {
            setupNotificationChannels(androidApp.context);
        }
        this.items = this._itemService.getItems();
        Promise.all([
            schedule(60, 'fastTask'),
            schedule(120, 'mediumTask'),
            schedule(240, 'slowTask')
        ])
            .then((scheduledTasks) => {
                scheduledTasks.forEach((scheduledTask) => {
                    console.log(
                        `Task successfully scheduled: ${JSON.stringify(
                            scheduledTask
                        )}`
                    );
                });

                if (!this.alarmManager.alarmUp) {
                    console.log('Alarm was not up! Scheduling...');
                    this.alarmManager.set(scheduledTasks[0].interval);
                }
            })
            .catch((err) => {
                console.log(
                    `An error occurred while trying to schedule a task: ${err}`
                );
            });
    }
}
