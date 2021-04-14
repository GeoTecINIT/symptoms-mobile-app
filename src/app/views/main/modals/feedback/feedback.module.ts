import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { FeedbackRoutingModule } from "./feedback-routing.module";
import { NativeScriptCommonModule } from "@nativescript/angular";
import { CommonComponentsModule } from "~/app/views/common/common-components.module";

import { FeedbackModalComponent } from "./feedback-modal.component";
import { FeedbackContainerComponent } from "./feedback-container/feedback-container.component";

@NgModule({
    imports: [
        FeedbackRoutingModule,
        NativeScriptCommonModule,
        CommonComponentsModule,
    ],
    declarations: [FeedbackModalComponent, FeedbackContainerComponent],
    entryComponents: [FeedbackModalComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class FeedbackModule {}
