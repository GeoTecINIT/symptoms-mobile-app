import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import {
    NativeScriptCommonModule,
    registerElement,
} from "@nativescript/angular";

import { ProgressSectionComponent } from "./progress-section/progress-section.component";
import { BarChartComponent, LineChartComponent } from "./charts";
import {
    BaseCardComponent,
    IconTextCardComponent,
    TitleContentCardComponent,
    ChartCardComponent,
} from "./cards";
import { CommonComponentsModule } from "~/app/views/common/common-components.module";

registerElement(
    "LineChart",
    () => require("@nativescript-community/ui-chart").LineChart
);
registerElement(
    "BarChart",
    () => require("@nativescript-community/ui-chart").BarChart
);

@NgModule({
    imports: [NativeScriptCommonModule, CommonComponentsModule],
    declarations: [
        ProgressSectionComponent,
        LineChartComponent,
        BarChartComponent,
        BaseCardComponent,
        IconTextCardComponent,
        TitleContentCardComponent,
        ChartCardComponent,
    ],
    exports: [
        ProgressSectionComponent,
        LineChartComponent,
        BarChartComponent,
        IconTextCardComponent,
        TitleContentCardComponent,
        ChartCardComponent,
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class CommonProgressModule {}
