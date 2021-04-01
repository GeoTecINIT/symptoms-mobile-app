import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { SimulationRoutingModule } from "./simulation-routing.module";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { SimulationActionsComponent } from "./simulation-actions.component";
import { CommonMainModule } from "~/app/views/main/common/common-main.module";

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
