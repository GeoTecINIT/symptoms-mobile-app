import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { SettingsContainerComponent } from "./settings-container/settings-container.component";

const routes: Routes = [{ path: "", component: SettingsContainerComponent }];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
})
export class SettingsRoutingModule {}
