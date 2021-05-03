import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { NativeScriptCommonModule } from "@nativescript/angular";
import { ModalBodyComponent } from "./modal-body/modal-body.component";
import { CommonComponentsModule } from "~/app/views/common/common-components.module";

@NgModule({
    imports: [NativeScriptCommonModule, CommonComponentsModule],
    declarations: [ModalBodyComponent],
    schemas: [NO_ERRORS_SCHEMA],
    exports: [ModalBodyComponent],
})
export class CommonModalsModule {}
