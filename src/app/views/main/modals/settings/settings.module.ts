import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { SettingsRoutingModule } from "./settings-routing.module";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { CommonComponentsModule } from "~/app/views/common/common-components.module";

import { SettingsModalComponent } from "./settings-modal.component";
import { SettingsContainerComponent } from "./settings-container/settings-container.component";

@NgModule({
    imports: [
        SettingsRoutingModule,
        NativeScriptCommonModule,
        CommonComponentsModule,
    ],
    declarations: [SettingsModalComponent, SettingsContainerComponent],
    entryComponents: [SettingsModalComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class SettingsModule {}
