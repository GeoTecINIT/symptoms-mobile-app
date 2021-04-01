import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { MainActionBarComponent } from "./main-action-bar/main-action-bar.component";

import { SettingsModule } from "../modals/settings/settings.module";

@NgModule({
    imports: [NativeScriptCommonModule, SettingsModule],
    declarations: [MainActionBarComponent],
    exports: [MainActionBarComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class CommonMainModule {}
