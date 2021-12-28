import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { NativeScriptCommonModule } from "@nativescript/angular";
import { ModalBodyComponent } from "./modal-body/modal-body.component";
import { CommonComponentsModule } from "~/app/views/common/common-components.module";
import { CompletionScreenComponent } from "./completion-screen/completion-screen.component";

@NgModule({
    imports: [NativeScriptCommonModule, CommonComponentsModule],
    declarations: [ModalBodyComponent, CompletionScreenComponent],
    schemas: [NO_ERRORS_SCHEMA],
    exports: [ModalBodyComponent, CompletionScreenComponent],
})
export class CommonModalsModule {}
