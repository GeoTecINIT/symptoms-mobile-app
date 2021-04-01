import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { ProgressRoutingModule } from "./progress-routing.module";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { CommonMainModule } from "../../common/common-main.module";

import { ProgressContainerComponent } from "./progress-container.component";
import { IdleProgressComponent } from "./idle-progress/idle-progress.component";
import { UnderExposureComponent } from "./under-exposure/under-exposure.component";

@NgModule({
    imports: [
        ProgressRoutingModule,
        NativeScriptCommonModule,
        CommonMainModule,
    ],
    declarations: [
        ProgressContainerComponent,
        IdleProgressComponent,
        UnderExposureComponent,
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ProgressModule {}
