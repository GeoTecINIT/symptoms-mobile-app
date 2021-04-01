import { Injectable, ViewContainerRef, Type } from "@angular/core";
import {
    ModalDialogService,
    ModalDialogOptions,
} from "nativescript-angular/modal-dialog";

@Injectable({
    providedIn: "root",
})
export class MainViewService {
    private viewContainerRef: ViewContainerRef;

    constructor(private modalService: ModalDialogService) {}

    setViewContainerRef(vcRef: ViewContainerRef) {
        this.viewContainerRef = vcRef;
    }

    showFullScreenAnimatedModal(
        modalComponent: Type<any>,
        params?: any
    ): Promise<any> {
        const options: ModalDialogOptions = {
            viewContainerRef: this.viewContainerRef,
            fullscreen: true,
            animated: true,
            context: params,
        };

        return this.modalService.showModal(modalComponent, options);
    }
}
