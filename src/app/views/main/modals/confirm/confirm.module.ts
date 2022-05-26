import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { ConfirmRoutingModule } from "./confirm-routing.module";
import { NativeScriptCommonModule } from "@nativescript/angular";

import { CommonComponentsModule } from "~/app/views/common/common-components.module";

import { ConfirmModalComponent } from "./confirm-modal.component";
import { CommonModalsModule } from "../common/common-modals.module";

@NgModule({
    imports: [
        ConfirmRoutingModule,
        NativeScriptCommonModule,
        CommonComponentsModule,
        CommonModalsModule,
    ],
    declarations: [ConfirmModalComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ConfirmModule {}
