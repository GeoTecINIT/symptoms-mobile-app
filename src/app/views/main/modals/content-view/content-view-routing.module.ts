import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { ContentViewContainerComponent } from "./content-view-container/content-view-container.component";

const routes: Routes = [{ path: "", component: ContentViewContainerComponent }];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
})
export class ContentViewRoutingModule {}
