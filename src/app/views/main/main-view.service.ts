import { Injectable } from "@angular/core";

export enum NavigationTab {
    Progress,
    Places,
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

    get isBusy(): boolean {
        return this._isBusy;
    }

    private _selectedTab = NavigationTab.Progress;
    private _isBusy = false;
    private tabSelectionCallback: TabSelectionCallback;

    setSelectedTab(tab: NavigationTab) {
        this._selectedTab = tab;
        if (this.tabSelectionCallback) this.tabSelectionCallback(tab);
    }

    onTabSelected(cb: TabSelectionCallback) {
        this.tabSelectionCallback = cb;
    }

    showActivityIndicator() {
        this._isBusy = true;
    }

    hideActivityIndicator() {
        this._isBusy = false;
    }
}
