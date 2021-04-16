import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { QuestionsRoutingModule } from "./questions-routing.module";
import { NativeScriptCommonModule } from "@nativescript/angular";
import { CommonComponentsModule } from "~/app/views/common/common-components.module";

import { QuestionsModalComponent } from "./questions-modal.component";
import { QuestionsContainerComponent } from "./questions-container/questions-container.component";

@NgModule({
    imports: [
        QuestionsRoutingModule,
        NativeScriptCommonModule,
        CommonComponentsModule,
    ],
    declarations: [QuestionsModalComponent, QuestionsContainerComponent],
    entryComponents: [QuestionsModalComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class QuestionsModule {}
