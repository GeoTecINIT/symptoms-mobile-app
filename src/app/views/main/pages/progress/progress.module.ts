import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { ProgressRoutingModule } from "./progress-routing.module";
import {
    NativeScriptCommonModule,
    registerElement,
} from "@nativescript/angular";

import { CommonMainModule } from "../../common/common-main.module";
import { CommonComponentsModule } from "~/app/views/common/common-components.module";
import { FeedbackModule } from "../../modals/feedback/feedback.module";

import { ProgressContainerComponent } from "./progress-container.component";
import { IdleProgressComponent } from "./idle-progress/idle-progress.component";
import { ProgressSectionComponent } from "./idle-progress/progress-section/progress-section.component";
import { UnderExposureComponent } from "./under-exposure/under-exposure.component";
import { RecordsListComponent } from "./pages/records-list/records-list.component";
import { AggregateListComponent } from "./pages/aggregate-list/aggregate-list.component";
import { BarChartComponent, LineChartComponent } from "./common/charts";
import { BaseCardComponent } from "./common/cards/base-card/base-card.component";
import { IconTextCardComponent } from "./common/cards/icon-text-card/icon-text-card.component";
import { TitleContentCardComponent } from "./common/cards/title-content-card/title-content-card.component";
import { ChartCardComponent } from "./common/cards/chart-card/chart-card.component";

registerElement(
    "LineChart",
    () => require("@nativescript-community/ui-chart").LineChart
);
registerElement(
    "BarChart",
    () => require("@nativescript-community/ui-chart").BarChart
);

@NgModule({
    imports: [
        ProgressRoutingModule,
        NativeScriptCommonModule,
        CommonMainModule,
        CommonComponentsModule,
        FeedbackModule,
    ],
    declarations: [
        ProgressContainerComponent,
        IdleProgressComponent,
        ProgressSectionComponent,
        UnderExposureComponent,
        RecordsListComponent,
        AggregateListComponent,
        LineChartComponent,
        BarChartComponent,
        BaseCardComponent,
        IconTextCardComponent,
        TitleContentCardComponent,
        ChartCardComponent,
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ProgressModule {}
