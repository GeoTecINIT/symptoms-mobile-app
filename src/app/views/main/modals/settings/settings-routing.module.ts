import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";

import { SettingsContainerComponent } from "./settings-container/settings-container.component";
import { AdvancedSettingsContainerComponent } from "./advanced-settings-container/advanced-settings-container.component";

const routes: Routes = [
    { path: "", component: SettingsContainerComponent },
    { path: "advanced", component: AdvancedSettingsContainerComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
})
export class SettingsRoutingModule {}
