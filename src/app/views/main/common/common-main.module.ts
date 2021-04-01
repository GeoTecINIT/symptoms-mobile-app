import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { MainActionBarComponent } from "./main-action-bar/main-action-bar.component";

import { SettingsModule } from "../modals/settings/settings.module";
import { NotificationsModule } from "../modals/notifications/notifications.module";

@NgModule({
    imports: [NativeScriptCommonModule, SettingsModule, NotificationsModule],
    declarations: [MainActionBarComponent],
    exports: [MainActionBarComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class CommonMainModule {}
