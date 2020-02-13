import { Component, OnInit } from '@angular/core';
import { android as androidApp } from 'tns-core-modules/application/application';

import { externalEventHandler } from './core/events/external-event-handler';
import { setupNotificationChannels } from './core/android/notification-manager.android';
import { emit, createEvent } from './core/events';
import { AndroidAlarmScheduler } from './core/tasks/scheduler/android/alarms/alarm-scheduler.android';
import { taskGraph } from './core/tasks/graph/loader';

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

        this.emitStartEvent();
    }

    private async checkAlarm() {
        await this.setupTimeout();
        await this.alarmScheduler.setup();
    }

    private setupTimeout() {
        return new Promise((resolve) => setTimeout(() => resolve(), 2000));
    }

    // FIXME: This has to be better handled with a view informing the user
    // about the permissions to be asked
    private async emitStartEvent() {
        const isReady = await taskGraph.isReady();
        if (!isReady) {
            await taskGraph.prepare();
        }
        emit(createEvent('startEvent'));
    }
}
