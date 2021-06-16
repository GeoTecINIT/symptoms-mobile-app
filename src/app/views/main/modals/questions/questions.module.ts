import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { QuestionsRoutingModule } from "./questions-routing.module";
import { NativeScriptCommonModule } from "@nativescript/angular";
import { CommonComponentsModule } from "~/app/views/common/common-components.module";
import { CommonModalsModule } from "../common/common-modals.module";

import { QuestionsContainerComponent } from "./questions-container/questions-container.component";
import { QuestionStepComponent } from "./questions-container/question-step/question-step.component";

@NgModule({
    imports: [
        QuestionsRoutingModule,
        NativeScriptCommonModule,
        CommonComponentsModule,
        CommonModalsModule,
    ],
    declarations: [QuestionsContainerComponent, QuestionStepComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class QuestionsModule {}
