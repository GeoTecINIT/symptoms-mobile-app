import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { MainActionBarComponent } from "./main-action-bar/main-action-bar.component";

import { SettingsModule } from "../settings/settings.module";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptRouterModule,
        SettingsModule,
    ],
    declarations: [MainActionBarComponent],
    exports: [MainActionBarComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class CommonMainModule {}
