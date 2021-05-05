import { Component, Input } from "@angular/core";

import { AppSettingsService } from "~/app/views/app-settings.service";
import { getLogger, Logger } from "~/app/core/utils/logger";

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

    private logger: Logger;

    constructor(private appSettingsService: AppSettingsService) {
        this.logger = getLogger("ReportUsageOptionComponent");

        this.appSettingsService
            .getReportUsageConsent()
            .then((consents) => (this.reportUsageConsent = consents));
    }

    onReportUsageCheckChange(checked: boolean) {
        this.appSettingsService
            .setReportUsageConsent(checked)
            .catch((e) =>
                this.logger.error(
                    `Could not update report usage consent. Reason: ${e}`
                )
            );
    }
}
