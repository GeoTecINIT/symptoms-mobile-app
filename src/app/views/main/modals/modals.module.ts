import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import {
    NativeScriptCommonModule,
    NativeScriptRouterModule,
} from "@nativescript/angular";

import { ConfirmModalComponent } from "./confirm/confirm-modal.component";
import { ContentViewModalComponent } from "./content-view/content-view-modal.component";
import { FeedbackModalComponent } from "./feedback/feedback-modal.component";
import { QuestionsModalComponent } from "./questions/questions-modal.component";
import { SettingsModalComponent } from "./settings/settings-modal.component";
import { PanicButtonModalComponent } from "./panic-button/panic-button-modal.component";
import { SimulationModalComponent } from "./simulation/simulation-modal.component";

const MODAL_COMPONENTS = [
    ConfirmModalComponent,
    ContentViewModalComponent,
    FeedbackModalComponent,
    QuestionsModalComponent,
    SettingsModalComponent,
    PanicButtonModalComponent,
    SimulationModalComponent,
];

@NgModule({
    imports: [NativeScriptCommonModule, NativeScriptRouterModule],
    declarations: [...MODAL_COMPONENTS],
    entryComponents: [...MODAL_COMPONENTS],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ModalsModule {}
