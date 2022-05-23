import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { ProgressRoutingModule } from "./progress-routing.module";
import { NativeScriptCommonModule } from "@nativescript/angular";

import { CommonComponentsModule } from "~/app/views/common/common-components.module";
import { CommonProgressModule } from "./common/common-progress.module";

import { ProgressContainerComponent } from "./progress-container.component";
import { IdleProgressComponent } from "./idle-progress/idle-progress.component";
import { UnderExposureComponent } from "./under-exposure/under-exposure.component";
import { ExposureProgressBarComponent } from "./under-exposure/exposure-progress-bar/exposure-progress-bar.component";

@NgModule({
    imports: [
        ProgressRoutingModule,
        NativeScriptCommonModule,
        CommonComponentsModule,
        CommonProgressModule,
    ],
    declarations: [
        ProgressContainerComponent,
        IdleProgressComponent,
        UnderExposureComponent,
        ExposureProgressBarComponent,
    ],
    schemas: [NO_ERRORS_SCHEMA],
    exports: [ProgressContainerComponent],
})
export class ProgressModule {}
