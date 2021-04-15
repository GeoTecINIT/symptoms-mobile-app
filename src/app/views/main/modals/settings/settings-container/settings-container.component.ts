import { Component } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { DialogsService } from "~/app/views/common/dialogs.service";
import { AuthService } from "~/app/views/auth.service";

@Component({
    selector: "SymSettingsContainer",
    templateUrl: "./settings-container.component.html",
    styleUrls: ["./settings-container.component.scss"],
})
export class SettingsContainerComponent {
    constructor(
        private params: ModalDialogParams,
        private dialogsService: DialogsService,
        private authService: AuthService
    ) {}

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
                    this.authService
                        .logout()
                        .then(() => this.onClose())
                        .catch((e) =>
                            console.error("Could not logout. Reason: ", e)
                        );
                }
            });
    }
}
