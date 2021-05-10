import { Component, Input } from "@angular/core";
import { NotificationViewModel } from "~/app/views/main/notifications-reader.service";

@Component({
    selector: "SymNotificationsListItem",
    templateUrl: "./notifications-list-item.component.html",
    styleUrls: ["./notifications-list-item.component.scss"],
})
export class NotificationsListItemComponent {
    @Input() notification: NotificationViewModel;
}
