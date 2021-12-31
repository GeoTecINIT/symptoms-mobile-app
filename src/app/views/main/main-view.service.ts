import { Injectable, ViewContainerRef, Type } from "@angular/core";
import { ModalDialogService, ModalDialogOptions } from "@nativescript/angular";

export enum NavigationTab {
    Progress,
    Content,
    Notifications,
}

export type TabSelectionCallback = (tab: NavigationTab) => void;

@Injectable({
    providedIn: "root",
})
export class MainViewService {
    get selectedTab(): NavigationTab {
        return this._selectedTab;
    }

    private viewContainerRef: ViewContainerRef;
    private _selectedTab = NavigationTab.Progress;
    private tabSelectionCallback: TabSelectionCallback;

    constructor(private modalService: ModalDialogService) {}

    setViewContainerRef(vcRef: ViewContainerRef) {
        this.viewContainerRef = vcRef;
    }

    setSelectedTab(tab: NavigationTab) {
        this._selectedTab = tab;
        if (this.tabSelectionCallback) this.tabSelectionCallback(tab);
    }

    onTabSelected(cb: TabSelectionCallback) {
        this.tabSelectionCallback = cb;
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
