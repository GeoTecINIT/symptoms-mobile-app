import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { ProgressRoutingModule } from "./progress-routing.module";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { ProgressContainerComponent } from "./progress-container.component";
import { CommonMainModule } from "~/app/views/main/common/common-main.module";

@NgModule({
    declarations: [ProgressContainerComponent],
    imports: [
        ProgressRoutingModule,
        NativeScriptCommonModule,
        CommonMainModule,
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ProgressModule {}
