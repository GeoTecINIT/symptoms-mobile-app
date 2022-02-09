import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import {
    NativeScriptCommonModule,
    NativeScriptRouterModule,
} from "@nativescript/angular";

import { GenericSettingsOptionComponent } from "./generic-settings-option/generic-settings-option.component";
import { DataSharingOptionComponent } from "./data-sharing-option/data-sharing-option.component";
import { ReportUsageOptionComponent } from "./report-usage-option/report-usage-option.component";
import { GenericSettingsNumberComponent } from "./generic-settings-number/generic-settings-number.component";

@NgModule({
    imports: [NativeScriptCommonModule, NativeScriptRouterModule],
    declarations: [
        GenericSettingsOptionComponent,
        DataSharingOptionComponent,
        ReportUsageOptionComponent,
        GenericSettingsNumberComponent,
    ],
    schemas: [NO_ERRORS_SCHEMA],
    exports: [
        GenericSettingsOptionComponent,
        DataSharingOptionComponent,
        ReportUsageOptionComponent,
        GenericSettingsNumberComponent,
    ],
})
export class AppSettingsOptionsModule {}
