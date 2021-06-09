import { ExposureChange } from "~/app/tasks/exposure";
import { Change } from "@geotecinit/emai-framework/entities";
import {
    CuttingLines,
    YAxisDataRange,
} from "~/app/views/main/pages/progress/common/charts";
import { ChartDescription } from "~/app/core/charts/chart-description";

export type DataGenerator = () => ExposureChange;
export function createFakeDataGenerator(): DataGenerator {
    let index = 0;
    const entries = [...FAKE_RECORDS_LIST].reverse();

    return (): ExposureChange => {
        if (index === entries.length) return null;
        const elem = entries[index++];

        const timestamp = new Date(
            (elem.chart.data[0].values[0].x as Date).getTime() - 5 * 60 * 1000
        );
        const placeName = elem.title.split("En ")[1];

        return new ExposureChange(
            Change.END,
            timestamp,
            {
                id: placeName.toLowerCase(),
                name: placeName,
                latitude: 0,
                longitude: 0,
                radius: 100,
            },
            elem.chart.data[0].values.map((value) => ({
                timestamp: value.x as Date,
                value: value.y,
            })),
            true
        );
    };
}

const Y_AXIS_DATA_RANGE: YAxisDataRange = {
    min: 0,
    max: 10,
};

const CUTTING_LINES: CuttingLines = [
    { label: "Leve", value: 2 },
    { label: "Moderada", value: 5 },
    { label: "Alta", value: 8 },
];

const FAKE_RECORDS_LIST: Array<ChartDescription> = [
    {
        iconCode: "\ue55e",
        title: "En Lugar 1",
        subtitle: "(30/04) Nivel de ansidedad",
        chart: {
            yAxisDataRange: Y_AXIS_DATA_RANGE,
            cuttingLines: CUTTING_LINES,
            data: [
                {
                    label: "Nivel de ansiedad",
                    values: [
                        { x: new Date(2021, 3, 30, 13, 35), y: 2 },
                        { x: new Date(2021, 3, 30, 13, 40), y: 2 },
                        { x: new Date(2021, 3, 30, 13, 45), y: 4 },
                        { x: new Date(2021, 3, 30, 13, 50), y: 7 },
                        { x: new Date(2021, 3, 30, 13, 55), y: 8 },
                        { x: new Date(2021, 3, 30, 14, 0), y: 7 },
                        { x: new Date(2021, 3, 30, 14, 5), y: 6 },
                        { x: new Date(2021, 3, 30, 14, 10), y: 5 },
                        { x: new Date(2021, 3, 30, 14, 15), y: 6 },
                        { x: new Date(2021, 3, 30, 14, 20), y: 5 },
                        { x: new Date(2021, 3, 30, 14, 25), y: 5 },
                        { x: new Date(2021, 3, 30, 14, 30), y: 3 },
                    ],
                },
            ],
        },
    },
    {
        iconCode: "\ue55e",
        title: "En Lugar 3",
        subtitle: "(28/04) Nivel de ansidedad",
        chart: {
            yAxisDataRange: Y_AXIS_DATA_RANGE,
            cuttingLines: CUTTING_LINES,
            data: [
                {
                    label: "Nivel de ansiedad",
                    values: [
                        { x: new Date(2021, 3, 28, 11, 54), y: 7 },
                        { x: new Date(2021, 3, 28, 11, 59), y: 8 },
                        { x: new Date(2021, 3, 28, 12, 4), y: 9 },
                        { x: new Date(2021, 3, 28, 12, 9), y: 8 },
                        { x: new Date(2021, 3, 28, 12, 14), y: 9 },
                        { x: new Date(2021, 3, 28, 12, 19), y: 8 },
                        { x: new Date(2021, 3, 28, 12, 24), y: 7 },
                        { x: new Date(2021, 3, 28, 12, 29), y: 7 },
                        { x: new Date(2021, 3, 28, 12, 34), y: 6 },
                        { x: new Date(2021, 3, 28, 12, 39), y: 6 },
                        { x: new Date(2021, 3, 28, 12, 44), y: 5 },
                        { x: new Date(2021, 3, 28, 12, 49), y: 5 },
                    ],
                },
            ],
        },
    },
    {
        iconCode: "\ue55e",
        title: "En Lugar 3",
        subtitle: "(27/04) Nivel de ansidedad",
        chart: {
            yAxisDataRange: Y_AXIS_DATA_RANGE,
            cuttingLines: CUTTING_LINES,
            data: [
                {
                    label: "Nivel de ansiedad",
                    values: [
                        { x: new Date(2021, 3, 27, 14, 35), y: 7 },
                        { x: new Date(2021, 3, 27, 14, 40), y: 8 },
                        { x: new Date(2021, 3, 27, 14, 45), y: 9 },
                        { x: new Date(2021, 3, 27, 14, 50), y: 8 },
                        { x: new Date(2021, 3, 27, 14, 55), y: 9 },
                        { x: new Date(2021, 3, 27, 15, 0), y: 8 },
                        { x: new Date(2021, 3, 27, 15, 5), y: 7 },
                        { x: new Date(2021, 3, 27, 15, 10), y: 8 },
                        { x: new Date(2021, 3, 27, 15, 15), y: 7 },
                        { x: new Date(2021, 3, 27, 15, 20), y: 8 },
                        { x: new Date(2021, 3, 27, 15, 25), y: 7 },
                        { x: new Date(2021, 3, 27, 15, 30), y: 7 },
                    ],
                },
            ],
        },
    },
    {
        iconCode: "\ue55e",
        title: "En Lugar 1",
        subtitle: "(26/04) Nivel de ansidedad",
        chart: {
            yAxisDataRange: Y_AXIS_DATA_RANGE,
            cuttingLines: CUTTING_LINES,
            data: [
                {
                    label: "Nivel de ansiedad",
                    values: [
                        { x: new Date(2021, 3, 26, 19, 3), y: 4 },
                        { x: new Date(2021, 3, 26, 19, 8), y: 5 },
                        { x: new Date(2021, 3, 26, 19, 13), y: 7 },
                        { x: new Date(2021, 3, 26, 19, 18), y: 7 },
                        { x: new Date(2021, 3, 26, 19, 23), y: 7 },
                        { x: new Date(2021, 3, 26, 19, 28), y: 6 },
                        { x: new Date(2021, 3, 26, 19, 33), y: 6 },
                        { x: new Date(2021, 3, 26, 19, 38), y: 6 },
                        { x: new Date(2021, 3, 26, 19, 43), y: 5 },
                        { x: new Date(2021, 3, 26, 19, 48), y: 4 },
                        { x: new Date(2021, 3, 26, 19, 53), y: 3 },
                        { x: new Date(2021, 3, 26, 19, 58), y: 3 },
                    ],
                },
            ],
        },
    },
    {
        iconCode: "\ue55e",
        title: "En Lugar 2",
        subtitle: "(23/04) Nivel de ansidedad",
        chart: {
            yAxisDataRange: Y_AXIS_DATA_RANGE,
            cuttingLines: CUTTING_LINES,
            data: [
                {
                    label: "Nivel de ansiedad",
                    values: [
                        { x: new Date(2021, 3, 23, 13, 2), y: 4 },
                        { x: new Date(2021, 3, 23, 13, 7), y: 6 },
                        { x: new Date(2021, 3, 23, 13, 12), y: 7 },
                        { x: new Date(2021, 3, 23, 13, 17), y: 8 },
                        { x: new Date(2021, 3, 23, 13, 22), y: 7 },
                        { x: new Date(2021, 3, 23, 13, 27), y: 6 },
                        { x: new Date(2021, 3, 23, 13, 32), y: 6 },
                        { x: new Date(2021, 3, 23, 13, 37), y: 5 },
                        { x: new Date(2021, 3, 23, 13, 42), y: 5 },
                        { x: new Date(2021, 3, 23, 13, 47), y: 4 },
                        { x: new Date(2021, 3, 23, 13, 52), y: 4 },
                        { x: new Date(2021, 3, 23, 13, 57), y: 3 },
                    ],
                },
            ],
        },
    },
    {
        iconCode: "\ue55e",
        title: "En Lugar 2",
        subtitle: "(22/04) Nivel de ansidedad",
        chart: {
            yAxisDataRange: Y_AXIS_DATA_RANGE,
            cuttingLines: CUTTING_LINES,
            data: [
                {
                    label: "Nivel de ansiedad",
                    values: [
                        { x: new Date(2021, 3, 22, 12, 36), y: 6 },
                        { x: new Date(2021, 3, 22, 12, 41), y: 7 },
                        { x: new Date(2021, 3, 22, 12, 46), y: 8 },
                        { x: new Date(2021, 3, 22, 12, 51), y: 9 },
                        { x: new Date(2021, 3, 22, 12, 56), y: 8 },
                        { x: new Date(2021, 3, 22, 13, 1), y: 8 },
                        { x: new Date(2021, 3, 22, 13, 6), y: 7 },
                        { x: new Date(2021, 3, 22, 13, 11), y: 7 },
                        { x: new Date(2021, 3, 22, 13, 16), y: 6 },
                        { x: new Date(2021, 3, 22, 13, 21), y: 6 },
                        { x: new Date(2021, 3, 22, 13, 26), y: 5 },
                        { x: new Date(2021, 3, 22, 13, 31), y: 4 },
                    ],
                },
            ],
        },
    },
    {
        iconCode: "\ue55e",
        title: "En Lugar 1",
        subtitle: "(20/04) Nivel de ansidedad",
        chart: {
            yAxisDataRange: Y_AXIS_DATA_RANGE,
            cuttingLines: CUTTING_LINES,
            data: [
                {
                    label: "Nivel de ansiedad",
                    values: [
                        { x: new Date(2021, 3, 20, 12, 56), y: 6 },
                        { x: new Date(2021, 3, 20, 13, 1), y: 7 },
                        { x: new Date(2021, 3, 20, 13, 6), y: 8 },
                        { x: new Date(2021, 3, 20, 13, 11), y: 8 },
                        { x: new Date(2021, 3, 20, 13, 16), y: 9 },
                        { x: new Date(2021, 3, 20, 13, 21), y: 8 },
                        { x: new Date(2021, 3, 20, 13, 26), y: 9 },
                        { x: new Date(2021, 3, 20, 13, 31), y: 8 },
                        { x: new Date(2021, 3, 20, 13, 36), y: 9 },
                        { x: new Date(2021, 3, 20, 13, 41), y: 8 },
                        { x: new Date(2021, 3, 20, 13, 46), y: 7 },
                        { x: new Date(2021, 3, 20, 13, 51), y: 6 },
                    ],
                },
            ],
        },
    },
];
