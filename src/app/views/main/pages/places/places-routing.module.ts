import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";

import { PlacesContainerComponent } from "./places-container.component";

const routes: Routes = [{ path: "", component: PlacesContainerComponent }];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
})
export class PlacesRoutingModule {}
