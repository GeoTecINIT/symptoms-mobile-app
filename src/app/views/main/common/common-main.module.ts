import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "@nativescript/angular";

import { SettingsModule } from "../modals/settings/settings.module";
import { NotificationsModule } from "../modals/notifications/notifications.module";
import { ContentViewModule } from "../modals/content-view/content-view.module";
import { ConfirmModule } from "../modals/confirm/confirm.module";
import { QuestionsModule } from "../modals/questions/questions.module";
import { FeedbackModule } from "../modals/feedback/feedback.module";

import { MainActionBarComponent } from "./main-action-bar/main-action-bar.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        SettingsModule,
        NotificationsModule,
        ContentViewModule,
        ConfirmModule,
        QuestionsModule,
        FeedbackModule,
    ],
    declarations: [MainActionBarComponent],
    exports: [MainActionBarComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class CommonMainModule {}
