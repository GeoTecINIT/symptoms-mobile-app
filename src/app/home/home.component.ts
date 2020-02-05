import { Component, OnInit } from '@angular/core';
import { android as androidApp } from 'tns-core-modules/application/application';

import { DataService, DataItem } from '../shared/data.service';
import { AndroidAlarmManager } from '../core/tasks/scheduler/android/alarms/alarm-manager.android';
import { setupNotificationChannels } from '../core/android/notification-manager.android';
import { on, emit, createEvent } from '../core/events';
import { run } from '../core/tasks';
import { plannedTasksDB } from '../core/persistence/planned-tasks-store';
import { PlanningType } from '../core/tasks/planner/planned-task';

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

        on('startEvent', run('fastTask').every(60));
        on('startEvent', run('mediumTask').every(120));
        on('startEvent', run('slowTask').every(240));

        on('slowTaskFinished', run('mediumTask').now());
        on('mediumTaskFinished', run('fastTask').now());

        emit(createEvent('startEvent'));

        this.checkAlarm();
    }

    private async checkAlarm() {
        await this.setupTimeout();

        if (!this.alarmManager.alarmUp) {
            console.log('Alarm was not up! Scheduling...');
            const plannedTasks = await plannedTasksDB.getAllSortedByInterval(
                PlanningType.Alarm
            );
            this.alarmManager.set(plannedTasks[0].interval);
        }
    }

    private setupTimeout() {
        return new Promise((resolve) => setTimeout(() => resolve(), 2000));
    }
}
