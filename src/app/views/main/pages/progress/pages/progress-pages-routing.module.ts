import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";

import {
    PLACE_ID_KEY,
    RecordsListComponent,
} from "./records-list/records-list.component";
import { AggregateListComponent } from "./aggregate-list/aggregate-list.component";

const routes: Routes = [
    { path: "aggregate-list", component: AggregateListComponent },
    { path: "records-list", component: RecordsListComponent },
    { path: `records-list/:${PLACE_ID_KEY}`, component: RecordsListComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
})
export class ProgressPagesRoutingModule {}
