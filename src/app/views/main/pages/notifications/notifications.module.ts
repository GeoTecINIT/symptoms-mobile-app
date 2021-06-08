import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { NotificationsRoutingModule } from "./notifications-routing.module";
import { NativeScriptCommonModule } from "@nativescript/angular";

import { CommonComponentsModule } from "~/app/views/common/common-components.module";
import { CommonMainModule } from "../../common/common-main.module";
import { NotificationsListComponent } from "./notifications-list.component";
import { NotificationsListItemComponent } from "./notifications-list-item/notifications-list-item.component";

@NgModule({
    declarations: [NotificationsListComponent, NotificationsListItemComponent],
    imports: [
        NotificationsRoutingModule,
        NativeScriptCommonModule,
        CommonComponentsModule,
        CommonMainModule,
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class NotificationsModule {}
