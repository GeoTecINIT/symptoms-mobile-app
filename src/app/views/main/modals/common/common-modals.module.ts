import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { NativeScriptCommonModule } from "@nativescript/angular";
import { ModalBodyComponent } from "./modal-body/modal-body.component";

@NgModule({
    imports: [NativeScriptCommonModule],
    declarations: [ModalBodyComponent],
    schemas: [NO_ERRORS_SCHEMA],
    exports: [ModalBodyComponent],
})
export class CommonModalsModule {}
