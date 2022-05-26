import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { NativeScriptCommonModule } from "@nativescript/angular";
import { CommonComponentsModule } from "~/app/views/common/common-components.module";

import { ContentViewRoutingModule } from "./content-view-routing.module";

import { ContentViewModalComponent } from "./content-view-modal.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        CommonComponentsModule,
        ContentViewRoutingModule,
    ],
    declarations: [ContentViewModalComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ContentViewModule {}
