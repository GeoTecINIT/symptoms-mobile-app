import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";

import { SimulationModalComponent } from "./simulation-modal.component";

const routes: Routes = [{ path: "", component: SimulationModalComponent }];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
})
export class SimulationRoutingModule {}
