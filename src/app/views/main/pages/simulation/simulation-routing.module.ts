import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";

import { SimulationActionsComponent } from "./simulation-actions.component";

const routes: Routes = [{ path: "", component: SimulationActionsComponent }];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
})
export class SimulationRoutingModule {}
