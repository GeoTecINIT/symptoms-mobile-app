import { Component, OnInit } from '@angular/core';

import { firebaseManager } from '../core/utils/firebase';

import { Experiment, currentExperiment } from '../experiment';

@Component({
    selector: 'Home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    experiment: Experiment;

    ngOnInit(): void {
        this.experiment = currentExperiment.get();
        // FIXME: Ask user consent before doing this
        if (!firebaseManager.dataCollectionEnabled) {
            firebaseManager.enableUsageDataCollection();
        }
    }

    onTapStart() {
        if (!this.experiment.name) {
            alert('Please, introduce a name for the experiment');

            return;
        }
        this.experiment = currentExperiment.start(this.experiment.name);
    }

    onTapStop() {
        this.experiment = currentExperiment.finish();
    }
}
