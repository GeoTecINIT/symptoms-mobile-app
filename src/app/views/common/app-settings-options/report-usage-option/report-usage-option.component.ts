import { Component, Input } from "@angular/core";

import { AppSettingsService } from "~/app/views/app-settings.service";

@Component({
    selector: "SymReportUsageOption",
    templateUrl: "./report-usage-option.component.html",
    styleUrls: ["./report-usage-option.component.scss"],
})
export class ReportUsageOptionComponent {
    @Input() marginBottom: number;
    @Input() bold = false;
    @Input() italic = false;

    reportUsageConsent: boolean;

    constructor(private appSettingsService: AppSettingsService) {
        this.appSettingsService
            .getDataSharingConsent()
            .then((consents) => (this.reportUsageConsent = consents));
    }

    onReportUsageCheckChange(checked: boolean) {
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
