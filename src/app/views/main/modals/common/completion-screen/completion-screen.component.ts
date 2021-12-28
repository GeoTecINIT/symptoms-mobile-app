import { Component, EventEmitter, Input, Output } from "@angular/core";
import { animate, style, transition, trigger } from "@angular/animations";
import { CompletionScreenOptions } from "~/app/core/modals/common";

@Component({
    selector: "SymCompletionScreen",
    templateUrl: "./completion-screen.component.html",
    styleUrls: ["./completion-screen.component.scss"],
    animations: [
        trigger("slideUp", [
            transition(":enter", [
                style({ transform: "translateY(600%)" }),
                animate(
                    "300ms ease-in-out",
                    style({ transform: "translateY(0)" })
                ),
            ]),
        ]),
    ],
})
export class CompletionScreenComponent {
    @Input() options: CompletionScreenOptions;
    @Output() confirmTapped = new EventEmitter<void>();

    onConfirmTap() {
        this.confirmTapped.emit();
    }
}
