import { Component, OnInit } from "@angular/core";
import { DialogsService } from "~/app/views/common/dialogs.service";
import { FeedbackModalService } from "../../../modals/feedback";
import { ProgressViewService } from "../progress-view.service";

@Component({
    selector: "SymUnderExposure",
    templateUrl: "./under-exposure.component.html",
    styleUrls: ["./under-exposure.component.scss"],
})
export class UnderExposureComponent implements OnInit {
    inDanger = false;

    constructor(
        private dialogsService: DialogsService,
        private feedbackModalService: FeedbackModalService,
        private progressViewService: ProgressViewService
    ) {
        // Initialize dependencies here
    }

    ngOnInit() {
        // Use initialized dependencies
    }

    onSwitchStatus() {
        this.inDanger = !this.inDanger;
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
                if (feelsBetter) {
                    this.inDanger = false;
                }
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
                if (wantsToLeave) {
                    this.feedbackModalService
                        .askFeedback({
                            title: "En otro momento entonces",
                            feedbackScreen: {
                                body: {
                                    emoji: "👋",
                                    text:
                                        "No te preocupes, lo importante es ser constante. ¡Hasta pronto!",
                                },
                                question:
                                    "¿Podrías indicar el motivo de tu salida?",
                                options: [
                                    {
                                        type: "predefined",
                                        answer: "Mi nivel de ansiedad no baja",
                                    },
                                    {
                                        type: "predefined",
                                        answer:
                                            "No consigo manejar la situación",
                                    },
                                    {
                                        type: "predefined",
                                        answer: "No dispongo de más tiempo",
                                    },
                                    {
                                        type: "free-text",
                                        hint: "Otro",
                                        helpText:
                                            "Tu terapeuta podrá leer este mensaje",
                                    },
                                ],
                            },
                        })
                        .then((feedback) => {
                            console.log("Feedback:", feedback);
                            if (feedback) {
                                this.progressViewService.setAsIdle();
                            }
                        });
                }
            });
    }
}
