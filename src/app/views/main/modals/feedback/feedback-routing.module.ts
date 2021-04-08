import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { FeedbackContainerComponent } from "./feedback-container/feedback-container.component";

const routes: Routes = [{ path: "", component: FeedbackContainerComponent }];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
})
export class FeedbackRoutingModule {}
