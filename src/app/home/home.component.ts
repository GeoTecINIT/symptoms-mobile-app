import { Component, OnInit } from "@angular/core";

import { firebaseManager } from "../core/utils/firebase";

import { Experiment, currentExperiment } from "../experiment";
import { taskDispatcher } from "nativescript-task-dispatcher";
import { Logger, getLogger } from "../core/utils/logger";

@Component({
    selector: "SymHome",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
    experiment: Experiment;
    logger: Logger;

    ngOnInit(): void {
        this.logger = getLogger("HomeComponent");
        this.experiment = currentExperiment.get();
        // FIXME: Ask user consent before doing this
        if (!firebaseManager.dataCollectionEnabled) {
            firebaseManager.enableUsageDataCollection();
        }
        this.checkTasksReadiness();
    }

    onTapStart() {
        if (!this.experiment.name) {
            alert("Please, introduce a name for the experiment");

            return;
        }
        this.experiment = currentExperiment.start(this.experiment.name);
    }

    onTapStop() {
        this.experiment = currentExperiment.finish();
    }

    private async checkTasksReadiness() {
        const isReady = await taskDispatcher.isReady();
        if (!isReady) {
            const tasksToPrepare = await taskDispatcher.tasksNotReady;
            this.logger.info(
                `Up to prepare: ${tasksToPrepare.map((task) => task.name)}`
            );
            await taskDispatcher.prepare();
        }
    }
}
