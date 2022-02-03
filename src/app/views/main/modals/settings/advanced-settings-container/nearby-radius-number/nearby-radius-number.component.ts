import { Component, Input } from "@angular/core";
import { getLogger, Logger } from "~/app/core/utils/logger";
import { AdvancedSetting, AdvancedSettingsService } from "~/app/core/account";

@Component({
    selector: "SymNearbyRadiusNumber",
    templateUrl: "./nearby-radius-number.component.html",
    styleUrls: ["./nearby-radius-number.component.scss"],
})
export class NearbyRadiusNumberComponent {
    @Input() marginBottom: number;
    @Input() bold = false;
    @Input() italic = false;

    nearbyExposureRadius: number;

    private logger: Logger;

    constructor(private advancedSettingsService: AdvancedSettingsService) {
        this.logger = getLogger("NearbyRadiusNumberComponent");
        this.nearbyExposureRadius = this.advancedSettingsService.getNumber(
            AdvancedSetting.NearbyExposureRadius
        );
    }

    onNearbyExposureRadiusChange(value: number) {
        this.advancedSettingsService
            .setNumber(AdvancedSetting.NearbyExposureRadius, value)
            .catch((e) =>
                this.logger.error(
                    `Could not update nearby exposure radius value. Reason: ${e}`
                )
            );
    }
}
