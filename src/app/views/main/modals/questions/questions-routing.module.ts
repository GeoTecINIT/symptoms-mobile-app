import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { QuestionsContainerComponent } from "./questions-container/questions-container.component";

const routes: Routes = [{ path: "", component: QuestionsContainerComponent }];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
})
export class QuestionsRoutingModule {}
