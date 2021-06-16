import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { ConfirmRoutingModule } from "./confirm-routing.module";
import { NativeScriptCommonModule } from "@nativescript/angular";

import { CommonComponentsModule } from "~/app/views/common/common-components.module";

import { ConfirmContainerComponent } from "./confirm-container/confirm-container.component";
import { CommonModalsModule } from "../common/common-modals.module";

@NgModule({
    imports: [
        ConfirmRoutingModule,
        NativeScriptCommonModule,
        CommonComponentsModule,
        CommonModalsModule,
    ],
    declarations: [ConfirmContainerComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ConfirmModule {}
