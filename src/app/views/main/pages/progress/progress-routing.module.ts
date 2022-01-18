import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";

import { ProgressContainerComponent } from "./progress-container.component";
import {
    PLACE_ID_KEY,
    RecordsListComponent,
} from "./pages/records-list/records-list.component";
import { AggregateListComponent } from "./pages/aggregate-list/aggregate-list.component";

const routes: Routes = [
    { path: "", redirectTo: "overall-progress", pathMatch: "full" },
    { path: "overall-progress", component: ProgressContainerComponent },
    { path: "aggregate-list", component: AggregateListComponent },
    { path: "records-list", component: RecordsListComponent },
    { path: `records-list/:${PLACE_ID_KEY}`, component: RecordsListComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
})
export class ProgressRoutingModule {}
