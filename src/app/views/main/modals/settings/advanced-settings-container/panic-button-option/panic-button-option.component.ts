import { Component, Input } from "@angular/core";
import { AdvancedSetting, AdvancedSettingsService } from "~/app/core/account";
import { getLogger, Logger } from "~/app/core/utils/logger";

@Component({
    selector: "SymPanicButtonOption",
    templateUrl: "./panic-button-option.component.html",
    styleUrls: ["./panic-button-option.component.scss"],
})
export class PanicButtonOptionComponent {
    @Input() marginBottom: number;
    @Input() bold = false;
    @Input() italic = false;

    panicButtonActive: boolean;

    private logger: Logger;

    constructor(private advancedSettingsService: AdvancedSettingsService) {
        this.logger = getLogger("PanicButtonOptionComponent");
        this.panicButtonActive = this.advancedSettingsService.getBoolean(
            AdvancedSetting.PanicButton
        );
    }

    onDataSharingCheckChange(checked: boolean) {
        this.advancedSettingsService
            .setBoolean(AdvancedSetting.PanicButton, checked)
            .catch((e) =>
                this.logger.error(
                    `Could not update panic button active status. Reason: ${e}`
                )
            );
    }
}
