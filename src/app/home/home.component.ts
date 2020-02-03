import { Component, OnInit } from '@angular/core';
import { android as androidApp } from 'tns-core-modules/application/application';

import { DataService, DataItem } from '../shared/data.service';
import { AndroidAlarmManager } from '../core/tasks/scheduler/android/alarms/alarm-manager.android';
import { setupNotificationChannels } from '../core/notification-manager.android';
import { taskScheduler } from '../core/tasks/scheduler';

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

        const scheduler = taskScheduler();
        Promise.all([
            scheduler.schedule({
                name: 'fastTask',
                interval: 60,
                recurrent: true,
                params: {}
            }),
            scheduler.schedule({
                name: 'mediumTask',
                interval: 120,
                recurrent: true,
                params: {}
            }),
            scheduler.schedule({
                name: 'slowTask',
                interval: 240,
                recurrent: true,
                params: {}
            })
        ])
            .then((plannedTasks) => {
                plannedTasks.forEach((plannedTask) => {
                    console.log(
                        `Task successfully scheduled: ${JSON.stringify(
                            plannedTask
                        )}`
                    );
                });

                if (!this.alarmManager.alarmUp) {
                    console.log('Alarm was not up! Scheduling...');
                    this.alarmManager.set(plannedTasks[0].interval);
                }
            })
            .catch((err) => {
                console.log(
                    `An error occurred while trying to schedule a task: ${err}`
                );
            });
    }
}
