import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { SimulationRoutingModule } from "./simulation-routing.module";
import { NativeScriptCommonModule } from "@nativescript/angular";

import { CommonComponentsModule } from "~/app/views/common/common-components.module";
import { CommonMainModule } from "../../common/common-main.module";

import { SimulationActionsComponent } from "./simulation-actions.component";
import { SimulationSectionComponent } from "./simulation-section/simulation-section.component";

@NgModule({
    declarations: [SimulationActionsComponent, SimulationSectionComponent],
    imports: [
        SimulationRoutingModule,
        NativeScriptCommonModule,
        CommonComponentsModule,
        CommonMainModule,
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class SimulationModule {}
