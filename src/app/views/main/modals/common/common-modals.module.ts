import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { NativeScriptCommonModule } from "@nativescript/angular";
import { ModalBodyComponent } from "./modal-body/modal-body.component";
import { CommonComponentsModule } from "~/app/views/common/common-components.module";
import { CompletionScreenComponent } from "./completion-screen/completion-screen.component";
import { ContextualConditionsComplianceDialogComponent } from "./modal-body/contextual-conditions-compliance-dialog/contextual-conditions-compliance-dialog.component";

@NgModule({
    imports: [NativeScriptCommonModule, CommonComponentsModule],
    declarations: [
        ModalBodyComponent,
        CompletionScreenComponent,
        ContextualConditionsComplianceDialogComponent,
    ],
    entryComponents: [ContextualConditionsComplianceDialogComponent],
    schemas: [NO_ERRORS_SCHEMA],
    exports: [ModalBodyComponent, CompletionScreenComponent],
})
export class CommonModalsModule {}
