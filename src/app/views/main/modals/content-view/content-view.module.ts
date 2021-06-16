import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { NativeScriptCommonModule } from "@nativescript/angular";
import { CommonComponentsModule } from "~/app/views/common/common-components.module";

import { ContentViewRoutingModule } from "./content-view-routing.module";

import { ContentViewContainerComponent } from "./content-view-container/content-view-container.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        CommonComponentsModule,
        ContentViewRoutingModule,
    ],
    declarations: [ContentViewContainerComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ContentViewModule {}
