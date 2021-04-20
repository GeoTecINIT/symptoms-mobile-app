import { Component, Input } from "@angular/core";

import { AppSettingsService } from "~/app/views/app-settings.service";

@Component({
    selector: "SymDataSharingOption",
    templateUrl: "./data-sharing-option.component.html",
    styleUrls: ["./data-sharing-option.component.scss"],
})
export class DataSharingOptionComponent {
    @Input() marginBottom: number;
    @Input() bold = false;
    @Input() italic = false;

    dataSharingConsent: boolean;

    constructor(private appSettingsService: AppSettingsService) {
        this.appSettingsService
            .getDataSharingConsent()
            .then((consents) => (this.dataSharingConsent = consents));
    }

    onDataSharingCheckChange(checked: boolean) {
        this.appSettingsService
            .setDataSharingConsent(checked)
            .catch((e) =>
                console.error(
                    "Could not update data sharing consent. Reason:",
                    e
                )
            );
    }
}
