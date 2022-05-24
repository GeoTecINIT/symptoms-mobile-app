import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import {
    NativeScriptCommonModule,
    NativeScriptRouterModule,
} from "@nativescript/angular";

import { ContentViewModalComponent } from "./content-view/content-view-modal.component";
import { FeedbackModalComponent } from "./feedback/feedback-modal.component";
import { QuestionsModalComponent } from "./questions/questions-modal.component";
import { PanicButtonModalComponent } from "./panic-button/panic-button-modal.component";

const MODAL_COMPONENTS = [
    ContentViewModalComponent,
    FeedbackModalComponent,
    QuestionsModalComponent,
    PanicButtonModalComponent,
];

@NgModule({
    imports: [NativeScriptCommonModule, NativeScriptRouterModule],
    declarations: [...MODAL_COMPONENTS],
    entryComponents: [...MODAL_COMPONENTS],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ModalsModule {}
