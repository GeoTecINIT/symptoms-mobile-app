import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { NotificationsRoutingModule } from "./notifications-routing.module";
import { NativeScriptCommonModule } from "@nativescript/angular";

import { NotificationsModalComponent } from "./notifications-modal.component";
import { NotificationsListComponent } from "./notifications-list/notifications-list.component";

import { CommonComponentsModule } from "~/app/views/common/common-components.module";
import { NotificationsListItemComponent } from "./notifications-list/notifications-list-item/notifications-list-item.component";

@NgModule({
    imports: [
        NotificationsRoutingModule,
        NativeScriptCommonModule,
        CommonComponentsModule,
    ],
    declarations: [
        NotificationsModalComponent,
        NotificationsListComponent,
        NotificationsListItemComponent,
    ],
    entryComponents: [NotificationsModalComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class NotificationsModule {}
