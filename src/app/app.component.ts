import { Component, OnInit } from "@angular/core";
import { isAndroid } from "@nativescript/core";

import { externalEventHandler } from "./core/events/external-event-handler";

@Component({
    selector: "SymApp",
    templateUrl: "app.component.html",
})
export class AppComponent implements OnInit {
    constructor() {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        // TODO: Discuss. Would it be interesting to have a mechanism
        // where things to be done at startup time could be registered?
        if (isAndroid) {
            externalEventHandler.init();
            // setupNotificationChannels(androidApp.context);
            // const alarmScheduler = new AndroidAlarmScheduler();
            // alarmScheduler.setup();
        }
    }
}
