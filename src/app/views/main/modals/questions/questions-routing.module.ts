import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";

import {
    INSTANCE_ID_KEY,
    QuestionsModalComponent,
} from "./questions-modal.component";

const routes: Routes = [
    { path: `:${INSTANCE_ID_KEY}`, component: QuestionsModalComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
})
export class QuestionsRoutingModule {}
