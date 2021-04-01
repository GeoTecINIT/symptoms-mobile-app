import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { ProgressContainerComponent } from "./progress-container.component";

const routes: Routes = [{ path: "", component: ProgressContainerComponent }];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
})
export class ProgressRoutingModule {}
