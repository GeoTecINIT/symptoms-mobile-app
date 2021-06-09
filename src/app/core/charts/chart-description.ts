import {
    ChartData2D,
    CuttingLines,
    YAxisDataRange,
} from "~/app/views/main/pages/progress/common/charts";

export interface ChartDescription {
    iconCode: string;
    title: string;
    subtitle: string;
    chart: {
        yAxisDataRange: YAxisDataRange;
        cuttingLines: CuttingLines;
        data: Array<ChartData2D>;
    };
}
