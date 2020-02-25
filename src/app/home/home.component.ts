import { Component, OnInit } from '@angular/core';

import { DataService, DataItem } from '../shared/data.service';
import { taskGraph } from '../core/tasks/graph/loader';
import { emit, createEvent } from '../core/events';

@Component({
    selector: 'Home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
    items: Array<DataItem>;

    constructor(private _itemService: DataService) {}

    ngOnInit(): void {
        this.items = this._itemService.getItems();
    }

    onTapStart() {
        this.emitStartEvent();
    }

    onTapStop() {
        emit(createEvent('stopEvent'));
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
