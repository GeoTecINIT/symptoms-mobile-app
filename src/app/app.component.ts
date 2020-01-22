import { Component, OnInit, OnDestroy } from '@angular/core';
import * as app from 'tns-core-modules/application';
// import { on, resumeEvent, LaunchEventData } from 'tns-core-modules/application';

@Component({
    selector: 'ns-app',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
    listener;

    constructor() {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        this.listener = (args: app.AndroidActivityEventData) => {
            const intent = args.activity.getIntent();
            console.log(intent);
            console.log(intent.getStringExtra('action'));
        };
        app.android.on(
            app.AndroidApplication.activityResumedEvent,
            this.listener
        );
        /*on(resumeEvent, (args: LaunchEventData) => {
            if (args.android) {
                console.log(args.android);
                // const intent = args.android.activity.getIntent();
                // console.log(intent);
                // console.log(intent.getStringExtra('action'));
            }
        });*/
    }

    ngOnDestroy(): void {
        app.android.off(
            app.AndroidApplication.activityResumedEvent,
            this.listener
        );
    }
}
