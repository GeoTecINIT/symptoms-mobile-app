import { Component, OnInit } from '@angular/core';
import { externalEventHandler } from './core/events/external-event-handler';

@Component({
    selector: 'ns-app',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
    constructor() {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        externalEventHandler.init();
    }
}
