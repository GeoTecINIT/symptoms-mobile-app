import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { ProgressRoutingModule } from "./progress-routing.module";
import { NativeScriptCommonModule } from "@nativescript/angular";

import { CommonMainModule } from "../../common/common-main.module";
import { CommonComponentsModule } from "~/app/views/common/common-components.module";

import { ProgressContainerComponent } from "./progress-container.component";
import { IdleProgressComponent } from "./idle-progress/idle-progress.component";
import { UnderExposureComponent } from "./under-exposure/under-exposure.component";
import { RecordsListComponent } from "./pages/records-list/records-list.component";
import { AggregateListComponent } from "./pages/aggregate-list/aggregate-list.component";

@NgModule({
    imports: [
        ProgressRoutingModule,
        NativeScriptCommonModule,
        CommonMainModule,
        CommonComponentsModule,
    ],
    declarations: [
        ProgressContainerComponent,
        IdleProgressComponent,
        UnderExposureComponent,
        RecordsListComponent,
        AggregateListComponent,
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ProgressModule {}
