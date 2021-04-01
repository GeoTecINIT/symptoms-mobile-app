import { Injectable } from "@angular/core";

import { ContentViewModule } from "./content-view.module";

import { MainViewService } from "../../main-view.service";

import { ContentViewModalComponent } from "./content-view-modal.component";

@Injectable({
    providedIn: ContentViewModule,
})
export class ContentViewModalService {
    constructor(private mainViewService: MainViewService) {}

    showContent(id: string) {
        this.mainViewService
            .showFullScreenAnimatedModal(ContentViewModalComponent, { id })
            .catch((e) => console.log("Could not show content view modal:", e));
    }
}
