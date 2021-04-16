import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { ConfirmRoutingModule } from "./confirm-routing.module";
import { NativeScriptCommonModule } from "@nativescript/angular";

import { CommonComponentsModule } from "~/app/views/common/common-components.module";

import { ConfirmModalComponent } from "./confirm-modal.component";
import { ConfirmContainerComponent } from "./confirm-container/confirm-container.component";

@NgModule({
    imports: [
        ConfirmRoutingModule,
        NativeScriptCommonModule,
        CommonComponentsModule,
    ],
    declarations: [ConfirmModalComponent, ConfirmContainerComponent],
    entryComponents: [ConfirmModalComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ConfirmModule {}
