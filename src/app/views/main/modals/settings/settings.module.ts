import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { SettingsRoutingModule } from "./settings-routing.module";
import { NativeScriptCommonModule } from "@nativescript/angular";

import { CommonComponentsModule } from "~/app/views/common/common-components.module";
import { AppSettingsOptionsModule } from "~/app/views/common/app-settings-options/app-settings-options.module";

import { SettingsContainerComponent } from "./settings-container/settings-container.component";
import { SettingsSectionComponent } from "./settings-section/settings-section.component";
import { AdvancedSettingsContainerComponent } from "./advanced-settings-container/advanced-settings-container.component";
import { PanicButtonOptionComponent } from './advanced-settings-container/panic-button-option/panic-button-option.component';

@NgModule({
    imports: [
        SettingsRoutingModule,
        NativeScriptCommonModule,
        CommonComponentsModule,
        AppSettingsOptionsModule,
    ],
    declarations: [
        SettingsContainerComponent,
        SettingsSectionComponent,
        AdvancedSettingsContainerComponent,
        PanicButtonOptionComponent,
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class SettingsModule {}
