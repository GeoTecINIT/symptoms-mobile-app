import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";

import {
    FeedbackModalComponent,
    INSTANCE_ID_KEY,
} from "./feedback-modal.component";

const routes: Routes = [
    { path: `:${INSTANCE_ID_KEY}`, component: FeedbackModalComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
})
export class FeedbackRoutingModule {}
