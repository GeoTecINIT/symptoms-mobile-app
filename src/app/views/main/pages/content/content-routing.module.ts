import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";

import { ContentListComponent } from "./content-list.component";

const routes: Routes = [{ path: "", component: ContentListComponent }];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
})
export class ContentRoutingModule {}