import { Component, OnInit } from '@angular/core';
import { android as androidApp } from 'tns-core-modules/application/application';

import { externalEventHandler } from './core/events/external-event-handler';
import { setupNotificationChannels } from './core/android/notification-manager.android';
import { AndroidAlarmScheduler } from './core/tasks/scheduler/android/alarms/alarm/scheduler.android';

import * as firebase from 'nativescript-plugin-firebase';
import { Logger, getLogger } from './core/utils/logger';

@Component({
    selector: 'ns-app',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
    private logger: Logger;

    constructor() {
        // Use the component constructor to inject providers.
        this.logger = getLogger('AppComponent');
    }

    ngOnInit(): void {
        // TODO: Discuss. Would it be interesting to have a mechanism
        // where things to be done at startup time could be registered?
        if (androidApp) {
            externalEventHandler.init();
            setupNotificationChannels(androidApp.context);
            const alarmScheduler = new AndroidAlarmScheduler();
            alarmScheduler.setup();
        }

        firebase
            .init()
            .then(() => this.logger.debug('Firebase.init done!'))
            .catch((err) => this.logger.error(`Firebase.init failed: ${err}`));
    }
}
