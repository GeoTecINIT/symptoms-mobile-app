import { IAxisValueFormatter } from "@nativescript-community/ui-chart/formatter/IAxisValueFormatter";
import { InternalChartData2D } from "~/app/views/main/pages/progress/common/charts";

export interface AxisValueFormatter extends IAxisValueFormatter {
    getProcessedData(): Array<InternalChartData2D>;
}
