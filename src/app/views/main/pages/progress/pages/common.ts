import { ChartData2D, CuttingLines, YAxisDataRange } from "../common/charts";
import { interval, Observable } from "rxjs";
import { map } from "rxjs/internal/operators";

export const SESSION_DATA: Array<ChartData2D> = [
    {
        label: "Nivel de ansiedad",
        values: [
            { x: new Date(2021, 3, 23, 13, 35), y: 2 },
            { x: new Date(2021, 3, 23, 13, 40), y: 2 },
            { x: new Date(2021, 3, 23, 13, 45), y: 4 },
            { x: new Date(2021, 3, 23, 13, 50), y: 7 },
            { x: new Date(2021, 3, 23, 13, 55), y: 8 },
            { x: new Date(2021, 3, 23, 14, 0), y: 7 },
            { x: new Date(2021, 3, 23, 14, 5), y: 6 },
            { x: new Date(2021, 3, 23, 14, 10), y: 5 },
            { x: new Date(2021, 3, 23, 14, 15), y: 6 },
            { x: new Date(2021, 3, 23, 14, 20), y: 5 },
            { x: new Date(2021, 3, 23, 14, 25), y: 5 },
            { x: new Date(2021, 3, 23, 14, 30), y: 3 },
        ],
    },
];

export const AGGREGATE_DATA: Array<ChartData2D> = [
    {
        label: "Lugar 1",
        values: [
            { x: new Date(2021, 3, 20), y: 8 },
            { x: new Date(2021, 3, 25), y: 7 },
            { x: new Date(2021, 3, 26), y: 5 },
            { x: new Date(2021, 3, 29), y: 3 },
            { x: new Date(2021, 3, 30), y: 3 },
        ],
    },
    {
        label: "Lugar 2",
        values: [
            { x: new Date(2021, 3, 22), y: 8 },
            { x: new Date(2021, 3, 23), y: 7 },
            { x: new Date(2021, 3, 27), y: 7 },
            { x: new Date(2021, 3, 28), y: 5 },
        ],
    },
];

export const Y_AXIS_DATA_RANGE: YAxisDataRange = {
    min: 0,
    max: 10,
};

export const CUTTING_LINES: CuttingLines = [
    { label: "Leve", value: 2 },
    { label: "Moderada", value: 5 },
    { label: "Alta", value: 8 },
];

export function fakeUpdates(
    source: Array<ChartData2D>,
    updateMs: number
): Observable<Array<ChartData2D>> {
    return interval(updateMs).pipe(
        map((it) => {
            if (source.length === 0) return [];
            const cutAt = it % source[0].values.length;

            return source.map((dataSet) => {
                const length = dataSet.values.length;

                return {
                    label: dataSet.label,
                    values: dataSet.values.slice(
                        0,
                        cutAt <= length ? cutAt : length
                    ),
                };
            });
        })
    );
}
