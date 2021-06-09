import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { SimulationRoutingModule } from "./simulation-routing.module";
import { NativeScriptCommonModule } from "@nativescript/angular";

import { SimulationModalComponent } from "./simulation-modal.component";
import { CommonComponentsModule } from "~/app/views/common/common-components.module";
import { SimulationActionsComponent } from "./simulation-actions/simulation-actions.component";
import { SimulationSectionComponent } from "./simulation-actions/simulation-section/simulation-section.component";

@NgModule({
    imports: [
        SimulationRoutingModule,
        NativeScriptCommonModule,
        CommonComponentsModule,
    ],
    declarations: [
        SimulationModalComponent,
        SimulationActionsComponent,
        SimulationSectionComponent,
    ],
    entryComponents: [SimulationModalComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class SimulationModule {}