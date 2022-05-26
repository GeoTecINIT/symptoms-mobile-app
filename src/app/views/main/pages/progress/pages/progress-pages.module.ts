import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { ProgressPagesRoutingModule } from "./progress-pages-routing.module";
import { NativeScriptCommonModule } from "@nativescript/angular";

import { CommonComponentsModule } from "~/app/views/common/common-components.module";
import { CommonProgressModule } from "../common/common-progress.module";

import { RecordsListComponent } from "./records-list/records-list.component";
import { AggregateListComponent } from "./aggregate-list/aggregate-list.component";

@NgModule({
    imports: [
        ProgressPagesRoutingModule,
        NativeScriptCommonModule,
        CommonComponentsModule,
        CommonProgressModule,
    ],
    declarations: [RecordsListComponent, AggregateListComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ProgressPagesModule {}
