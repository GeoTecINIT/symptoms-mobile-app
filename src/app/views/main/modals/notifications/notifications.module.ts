import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { NotificationsRoutingModule } from "./notifications-routing.module";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { NotificationsModalComponent } from "./notifications-modal.component";
import { NotificationsListComponent } from "./notifications-list/notifications-list.component";

import { CommonComponentsModule } from "~/app/views/common/common-components.module";

@NgModule({
    imports: [
        NotificationsRoutingModule,
        NativeScriptCommonModule,
        CommonComponentsModule,
    ],
    declarations: [NotificationsModalComponent, NotificationsListComponent],
    entryComponents: [NotificationsModalComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class NotificationsModule {}
