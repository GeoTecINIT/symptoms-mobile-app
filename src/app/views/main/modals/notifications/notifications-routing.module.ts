import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { NotificationsListComponent } from "./notifications-list/notifications-list.component";

const routes: Routes = [{ path: "", component: NotificationsListComponent }];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
})
export class NotificationsRoutingModule {}
