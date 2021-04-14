import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { SimulationRoutingModule } from "./simulation-routing.module";
import { NativeScriptCommonModule } from "@nativescript/angular";

import { CommonMainModule } from "../../common/common-main.module";

import { SimulationActionsComponent } from "./simulation-actions.component";

@NgModule({
    declarations: [SimulationActionsComponent],
    imports: [
        SimulationRoutingModule,
        NativeScriptCommonModule,
        CommonMainModule,
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class SimulationModule {}
