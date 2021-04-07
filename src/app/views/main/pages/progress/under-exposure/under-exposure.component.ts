import { Component, OnInit } from "@angular/core";
import { DialogsService } from "~/app/views/common/dialogs.service";

@Component({
    selector: "SymUnderExposure",
    templateUrl: "./under-exposure.component.html",
    styleUrls: ["./under-exposure.component.scss"],
})
export class UnderExposureComponent implements OnInit {
    constructor(private dialogsService: DialogsService) {
        // Initialize dependencies here
    }

    ngOnInit() {
        // Use initialized dependencies
    }

    onProgressGoneTap() {
        this.dialogsService.showInfo(
            "¿Dónde ha ido mi progreso?",
            "Vale",
            "Mientras realizas una exposición la información sobre tu progreso se oculta temporalmente. Volverá a estar disponible en cuanto finalices la exposición."
        );
    }

    onWantsToLeaveTap() {
        this.dialogsService.showInfo(
            "¿Por qué no debería irme?",
            "Vale",
            "Consulta el contenido Z para revisar el papel de la evitación"
        );
    }

    onAskForMoodTap() {
        this.dialogsService
            .askConfirmation("¿Te sientes mejor?", "Sí", "No")
            .then((feelsBetter) => {
                // TODO: Manage this
                console.log("Feels better:", feelsBetter);
            });
    }

    onEndExposureTap() {
        this.dialogsService
            .askConfirmationWithPositiveAction(
                "¿Te vas?",
                "Me quedo",
                "Salir",
                "No deberías abandonar una exposición salvo por causa mayor. Recuerda el papel negativo de la evitación. Es normal que tengas picos de ansiedad. Si te quedas, acabarás controlándolos."
            )
            .then((wantsToLeave) => {
                // TODO: Manage this
                console.log("Wants to leave:", wantsToLeave);
            });
    }
}
