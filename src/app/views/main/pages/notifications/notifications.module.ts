import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { NativeScriptCommonModule } from "@nativescript/angular";

import { CommonComponentsModule } from "~/app/views/common/common-components.module";
import { NotificationsListComponent } from "./notifications-list.component";
import { NotificationsListItemComponent } from "./notifications-list-item/notifications-list-item.component";

@NgModule({
    imports: [NativeScriptCommonModule, CommonComponentsModule],
    declarations: [NotificationsListComponent, NotificationsListItemComponent],
    exports: [NotificationsListComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class NotificationsModule {}
