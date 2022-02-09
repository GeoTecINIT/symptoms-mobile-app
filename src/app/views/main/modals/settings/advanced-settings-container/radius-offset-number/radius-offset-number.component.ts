import { Component, Input } from "@angular/core";
import { getLogger, Logger } from "~/app/core/utils/logger";
import { AdvancedSetting, AdvancedSettingsService } from "~/app/core/account";

@Component({
    selector: "SymRadiusOffsetNumber",
    templateUrl: "./radius-offset-number.component.html",
    styleUrls: ["./radius-offset-number.component.scss"],
})
export class RadiusOffsetNumberComponent {
    @Input() marginBottom: number;
    @Input() bold = false;
    @Input() italic = false;

    radiusOffset: number;

    private logger: Logger;

    constructor(private advancedSettingsService: AdvancedSettingsService) {
        this.logger = getLogger("RadiusOffsetNumberComponent");
        this.radiusOffset = this.advancedSettingsService.getNumber(
            AdvancedSetting.ExposureRadiusOffset
        );
    }

    onExposureRadiusOffsetChange(value: number) {
        this.advancedSettingsService
            .setNumber(AdvancedSetting.ExposureRadiusOffset, value)
            .catch((e) =>
                this.logger.error(
                    `Could not update exposure radius offset value. Reason: ${e}`
                )
            );
    }
}
