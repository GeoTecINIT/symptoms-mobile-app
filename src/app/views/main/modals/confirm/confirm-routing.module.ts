import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";

import { NativeScriptRouterModule } from "@nativescript/angular";

import {
    ConfirmModalComponent,
    INSTANCE_ID_KEY,
} from "./confirm-modal.component";

const routes: Routes = [
    { path: `:${INSTANCE_ID_KEY}`, component: ConfirmModalComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
})
export class ConfirmRoutingModule {}
