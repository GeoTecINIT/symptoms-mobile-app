import { Injectable } from "@angular/core";
import { dial, requestCallPermission } from "nativescript-phone";
import { getLogger, Logger } from "~/app/core/utils/logger";
import { DialogsService } from "~/app/views/common/dialogs.service";
import { confirmWantsToMakeEmergencyCall } from "~/app/core/dialogs/confirm";

@Injectable({
    providedIn: "root",
})
export class SeekHelpService {
    private readonly therapistPhone: string;

    private logger: Logger;

    constructor(private dialogsService: DialogsService) {
        this.logger = getLogger("PanicButtonService");
        this.therapistPhone = `${global.ENV_THERAPIST_PHONE}`;
    }

    intendsToMakeEmergencyCall() {
        this.dialogsService
            .askConfirmationWithPositiveAction(confirmWantsToMakeEmergencyCall)
            .then((wantsToMakeCall) =>
                this.handleWantsToMakeCall(wantsToMakeCall)
            );
    }

    async performEmergencyCall(): Promise<boolean> {
        const phoneNumber = this.therapistPhone;
        try {
            await requestCallPermission(
                "Necesitamos este permiso para poder realizar una llamada de emergencia"
            );

            return this.dial(phoneNumber, false);
        } catch (e) {
            this.logger.error(`Call permission request failed. Reason: ${e}`);

            return this.dial(phoneNumber, true);
        }
    }

    private async handleWantsToMakeCall(wantsToMakeCall: boolean) {
        if (!wantsToMakeCall) return;
        await this.performEmergencyCall();
    }

    private dial(phone: string, askPermission: boolean): boolean {
        try {
            dial(phone, askPermission);

            return true;
        } catch (e) {
            this.logger.error(`Could not call therapist. Reason: ${e}`);

            return false;
        }
    }
}
