import { Component, OnInit } from '@angular/core';
import { android as androidApp } from 'tns-core-modules/application/application';

import { DataService, DataItem } from '../shared/data.service';
import { setupNotificationChannels } from '../core/android/notification-manager.android';
import { on, emit, createEvent } from '../core/events';
import { run } from '../core/tasks';
import { AndroidAlarmScheduler } from '../core/tasks/scheduler/android/alarms/alarm-scheduler.android';

@Component({
    selector: 'Home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
    items: Array<DataItem>;
    private alarmScheduler: AndroidAlarmScheduler;

    constructor(private _itemService: DataService) {
        this.alarmScheduler = new AndroidAlarmScheduler();
    }

    ngOnInit(): void {
        // TODO: Discuss. Would be interesting to have a mechanism where
        // things to be done at startup time could be registered?
        if (androidApp) {
            setupNotificationChannels(androidApp.context);
        }
        this.items = this._itemService.getItems();

        on('startEvent', run('fastTask').every(60));
        on('startEvent', run('acquireGeolocation').every(60));
        on('startEvent', run('mediumTask').every(120));
        on('startEvent', run('slowTask').every(240));

        on('slowTaskFinished', run('mediumTask').now());
        on('mediumTaskFinished', run('fastTask').now());
        on('geolocationAcquired', run('printGeolocation').now());

        emit(createEvent('startEvent'));

        this.checkAlarm();
    }

    private async checkAlarm() {
        await this.setupTimeout();
        await this.alarmScheduler.setup();
    }

    private setupTimeout() {
        return new Promise((resolve) => setTimeout(() => resolve(), 2000));
    }
}
