import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";

import {
    CONTENT_ID_KEY,
    ContentViewModalComponent,
} from "./content-view-modal.component";

const routes: Routes = [
    { path: `:${CONTENT_ID_KEY}`, component: ContentViewModalComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
})
export class ContentViewRoutingModule {}
