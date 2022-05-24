import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";

import { SettingsModalComponent } from "./settings-modal.component";
import { AdvancedSettingsContainerComponent } from "./advanced-settings-container/advanced-settings-container.component";

const routes: Routes = [
    { path: "", component: SettingsModalComponent },
    { path: "advanced", component: AdvancedSettingsContainerComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
})
export class SettingsRoutingModule {}
