import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { SettingsRoutingModule } from "./settings-routing.module";
import { NativeScriptCommonModule } from "@nativescript/angular";

import { CommonComponentsModule } from "~/app/views/common/common-components.module";
import { AppSettingsOptionsModule } from "~/app/views/common/app-settings-options/app-settings-options.module";

import { SettingsModalComponent } from "./settings-modal.component";
import { SettingsContainerComponent } from "./settings-container/settings-container.component";
import { SettingsSectionComponent } from "./settings-container/settings-section/settings-section.component";

@NgModule({
    imports: [
        SettingsRoutingModule,
        NativeScriptCommonModule,
        CommonComponentsModule,
        AppSettingsOptionsModule,
    ],
    declarations: [
        SettingsModalComponent,
        SettingsContainerComponent,
        SettingsSectionComponent,
    ],
    entryComponents: [SettingsModalComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class SettingsModule {}
