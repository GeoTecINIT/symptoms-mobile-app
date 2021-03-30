import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { SimulationRoutingModule } from "./simulation-routing.module";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { SimulationActionsComponent } from "./simulation-actions.component";

@NgModule({
    declarations: [SimulationActionsComponent],
    imports: [SimulationRoutingModule, NativeScriptCommonModule],
    schemas: [NO_ERRORS_SCHEMA],
})
export class SimulationModule {}
