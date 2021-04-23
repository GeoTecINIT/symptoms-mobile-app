import { AxisDateFormatter } from "~/app/views/main/pages/progress/common/charts/formatters/axis-date-formatter";
import {
    ChartData2D,
    InternalChartData2D,
} from "~/app/views/main/pages/progress/common/charts/line-chart/line-chart.component";

describe("Axis date formatter", () => {
    const exampleData: Array<ChartData2D> = [
        {
            label: "First dataset",
            values: [
                { x: new Date(2021, 3, 23, 13, 35), y: 0 },
                { x: new Date(2021, 3, 23, 13, 40), y: 1 },
                { x: new Date(2021, 3, 23, 13, 45), y: 2 },
                { x: new Date(2021, 3, 23, 13, 50), y: 3 },
                { x: new Date(2021, 3, 23, 13, 55), y: 4 },
                { x: new Date(2021, 3, 23, 14, 0), y: 5 },
            ],
        },
        {
            label: "Second dataset",
            values: [
                { x: new Date(2021, 3, 23, 14, 0), y: 5 },
                { x: new Date(2021, 3, 23, 14, 5), y: 4 },
                { x: new Date(2021, 3, 23, 14, 10), y: 3 },
                { x: new Date(2021, 3, 23, 14, 15), y: 2 },
                { x: new Date(2021, 3, 23, 14, 20), y: 1 },
                { x: new Date(2021, 3, 23, 14, 25), y: 0 },
            ],
        },
    ];
    const expectedData: Array<InternalChartData2D> = [
        {
            label: "First dataset",
            values: [
                { x: 0, y: 0 },
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 },
                { x: 4, y: 4 },
                { x: 5, y: 5 },
            ],
        },
        {
            label: "Second dataset",
            values: [
                { x: 6, y: 5 },
                { x: 7, y: 4 },
                { x: 8, y: 3 },
                { x: 9, y: 2 },
                { x: 10, y: 1 },
                { x: 11, y: 0 },
            ],
        },
    ];

    it("processes dates as timestamps", () => {
        const formatter = new AxisDateFormatter(exampleData);
        const processedData = formatter.getProcessedData();
        expect(processedData).toEqual(expectedData);
    });

    it("formats timestamps belonging to the same day as hours", () => {
        const formatter = new AxisDateFormatter(exampleData);
        const formattedValue = formatter.getAxisLabel(0, null);
        expect(formattedValue).toEqual("13:35");
    });

    it("formats timestamps belonging each one to a different day as dates", () => {
        const data: Array<ChartData2D> = [
            {
                label: "First dataset",
                values: [
                    { x: new Date(2021, 3, 23), y: 0 },
                    { x: new Date(2021, 3, 24), y: 1 },
                    { x: new Date(2021, 3, 25), y: 2 },
                ],
            },
            {
                label: "Second dataset",
                values: [
                    { x: new Date(2021, 3, 25), y: 5 },
                    { x: new Date(2021, 3, 26), y: 4 },
                    { x: new Date(2021, 3, 27), y: 3 },
                ],
            },
        ];
        const formatter = new AxisDateFormatter(data);
        const formattedValue = formatter.getAxisLabel(5, null);
        expect(formattedValue).toEqual("27/04");
    });

    it("formats timestamps belonging different days (repeating) and times as dates and hours", () => {
        const data: Array<ChartData2D> = [
            {
                label: "First dataset",
                values: [
                    { x: new Date(2021, 3, 23), y: 0 },
                    { x: new Date(2021, 3, 24), y: 1 },
                    { x: new Date(2021, 3, 25), y: 2 },
                ],
            },
            {
                label: "Second dataset",
                values: [
                    { x: new Date(2021, 3, 25), y: 5 },
                    { x: new Date(2021, 3, 26, 14, 25), y: 4 },
                    { x: new Date(2021, 3, 26, 15, 25), y: 3 },
                ],
            },
        ];
        const formatter = new AxisDateFormatter(data);
        const formattedValue = formatter.getAxisLabel(5, null);
        expect(formattedValue).toEqual("26/04 15:25");
    });
});
