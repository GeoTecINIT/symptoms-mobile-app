import { Component } from "@angular/core";
import { ModalDialogParams } from "@nativescript/angular";
import { Switch } from "@nativescript/core";
import { DialogsService } from "~/app/views/common/dialogs.service";
import { AppSettingsService } from "~/app/views/app-settings.service";

@Component({
    selector: "SymSettingsContainer",
    templateUrl: "./settings-container.component.html",
    styleUrls: ["./settings-container.component.scss"],
})
export class SettingsContainerComponent {
    dataSharingConsent: boolean;

    get version(): string {
        return this.appSettingsService.version;
    }

    constructor(
        private params: ModalDialogParams,
        private dialogsService: DialogsService,
        private appSettingsService: AppSettingsService
    ) {
        this.appSettingsService
            .getDataSharingConsent()
            .then((consents) => (this.dataSharingConsent = consents));
    }

    onClose() {
        this.params.closeCallback();
    }

    onUnlinkTap() {
        this.dialogsService
            .askConfirmationWithDestructiveAction(
                "¿Desvincular dispositivo?",
                "Salir",
                "Volver",
                "Si desvinculas este dispositivo perderás todo el progreso almacenado localmente (p. ej. contenido psicoeducativo visto, etc.) y tendrás que volver a configurar la app en caso de reinstalación"
            )
            .then((unlink) => {
                if (unlink) {
                    this.appSettingsService
                        .unlink()
                        .then(() => this.onClose())
                        .catch((e) =>
                            console.error("Could not unlink. Reason: ", e)
                        );
                }
            });
    }

    onDataSharingCheckChange(args: any) {
        const sw = args.object as Switch;
        this.dataSharingConsent = sw.checked;
        this.appSettingsService
            .setDataSharingConsent(sw.checked)
            .catch((e) =>
                console.error(
                    "Could not update data sharing consent. Reason:",
                    e
                )
            );
    }
}
