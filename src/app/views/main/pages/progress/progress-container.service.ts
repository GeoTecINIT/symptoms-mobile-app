import { Injectable } from "@angular/core";
import { getString, setString } from "@nativescript/core/application-settings";
import { ProgressStatus } from "./progress-container.component";

@Injectable({
    providedIn: "root",
})
export class ProgressContainerService {
    setTimerInitialized(initialized: boolean) {
        setString("timerInitialized", JSON.stringify(initialized));
    }

    isTimerInitialized(): boolean {
        const result = getString("timerInitialized");
        return result ? JSON.parse(result) : false;
    }

    setProgressStatus(status: ProgressStatus) {
        setString("progressStatus", JSON.stringify(status));
    }

    getProgressStatus(): ProgressStatus {
        const result = getString("progressStatus");
        return result ? JSON.parse(result) : ProgressStatus.IDLE;
    }

    setPreviousProgressStatus(status: ProgressStatus) {
        setString("previousProgressStatus", JSON.stringify(status));
    }

    getPreviousProgressStatus(): ProgressStatus {
        const result = getString("previousProgressStatus");
        return result ? JSON.parse(result) : null;
    }
}
