import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { SettingsModule } from "../modals/settings/settings.module";
import { NotificationsModule } from "../modals/notifications/notifications.module";
import { ContentViewModule } from "../modals/content-view/content-view.module";

import { MainActionBarComponent } from "./main-action-bar/main-action-bar.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        SettingsModule,
        NotificationsModule,
        ContentViewModule,
    ],
    declarations: [MainActionBarComponent],
    exports: [MainActionBarComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class CommonMainModule {}
