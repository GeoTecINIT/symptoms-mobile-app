import {
    AGGREGATE_DATA,
    ChartDescription,
    CUTTING_LINES,
    Y_AXIS_DATA_RANGE,
} from "../common";

export const FAKE_AGGREGATES_LIST: Array<ChartDescription> = [
    {
        iconCode: "\ue26b",
        title: "En Lugar 1",
        subtitle: "Nivel de ansiedad medio",
        chart: {
            yAxisDataRange: Y_AXIS_DATA_RANGE,
            cuttingLines: CUTTING_LINES,
            data: [AGGREGATE_DATA[0]],
        },
    },
    {
        iconCode: "\ue26b",
        title: "En Lugar 3",
        subtitle: "Nivel de ansiedad medio",
        chart: {
            yAxisDataRange: Y_AXIS_DATA_RANGE,
            cuttingLines: CUTTING_LINES,
            data: [AGGREGATE_DATA[2]],
        },
    },
    {
        iconCode: "\ue26b",
        title: "En Lugar 2",
        subtitle: "Nivel de ansiedad medio",
        chart: {
            yAxisDataRange: Y_AXIS_DATA_RANGE,
            cuttingLines: CUTTING_LINES,
            data: [AGGREGATE_DATA[1]],
        },
    },
];
