import { Component, OnInit } from '@angular/core';
import { android as androidApp } from 'tns-core-modules/application/application';

import { externalEventHandler } from './core/events/external-event-handler';
import { setupNotificationChannels } from './core/android/notification-manager.android';
import { emit, createEvent } from './core/events';
import { AndroidAlarmScheduler } from './core/tasks/scheduler/android/alarms/alarm-scheduler.android';

@Component({
    selector: 'ns-app',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
    private alarmScheduler: AndroidAlarmScheduler;

    constructor() {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        if (androidApp) {
            externalEventHandler.init();
            setupNotificationChannels(androidApp.context);
            this.alarmScheduler = new AndroidAlarmScheduler();
            this.checkAlarm();
        }

        emit(createEvent('startEvent'));
    }

    private async checkAlarm() {
        await this.setupTimeout();
        await this.alarmScheduler.setup();
    }

    private setupTimeout() {
        return new Promise((resolve) => setTimeout(() => resolve(), 2000));
    }
}
