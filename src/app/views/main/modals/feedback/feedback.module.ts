import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { FeedbackRoutingModule } from "./feedback-routing.module";
import { NativeScriptCommonModule } from "@nativescript/angular";
import { CommonComponentsModule } from "~/app/views/common/common-components.module";

import { FeedbackModalComponent } from "./feedback-modal.component";
import { FeedbackContainerComponent } from "./feedback-container/feedback-container.component";
import { CommonModalsModule } from "../common/common-modals.module";
import { FeedbackButtonOptionComponent } from "./options/feedback-button-option/feedback-button-option.component";
import { FeedbackTextOptionComponent } from "./options/feedback-text-option/feedback-text-option.component";

@NgModule({
    imports: [
        FeedbackRoutingModule,
        NativeScriptCommonModule,
        CommonComponentsModule,
        CommonModalsModule,
    ],
    declarations: [
        FeedbackModalComponent,
        FeedbackContainerComponent,
        FeedbackButtonOptionComponent,
        FeedbackTextOptionComponent,
    ],
    entryComponents: [FeedbackModalComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class FeedbackModule {}
