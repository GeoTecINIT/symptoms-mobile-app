import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";

import { ProgressContainerComponent } from "./progress-container.component";

const routes: Routes = [
    { path: "", redirectTo: "overall-progress", pathMatch: "full" },
    { path: "overall-progress", component: ProgressContainerComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
})
export class ProgressRoutingModule {}
