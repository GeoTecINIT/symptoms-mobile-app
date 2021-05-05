import { AxisBase } from "@nativescript-community/ui-chart/components/AxisBase";

import { AxisValueFormatter } from "./common";
import { ChartData2D, InternalChartData2D } from "../common";

enum Resolution {
    Date,
    DateHour,
    Hour,
}

export class AxisDateFormatter implements AxisValueFormatter {
    private readonly data: Array<InternalChartData2D>;
    private readonly resolution: Resolution;
    private dates: Array<Date>;

    constructor(data: Array<ChartData2D>) {
        this.data = this.processData(data);
        this.resolution = this.calculateResolution();
    }

    getAxisLabel(value: any, axis: AxisBase): string {
        const date = this.getClosestDate(value);
        switch (this.resolution) {
            case Resolution.Date:
                return formatAsDate(date);
            case Resolution.DateHour:
                return formatAsDateHour(date);
            case Resolution.Hour:
                return formatAsHour(date);
        }
    }

    getProcessedData(): Array<InternalChartData2D> {
        return this.data;
    }

    private processData(data: Array<ChartData2D>): Array<InternalChartData2D> {
        this.dates = flattenAndSortDates(data);

        return data.map((dataSet) => this.processDataSet(dataSet));
    }

    private calculateResolution(): Resolution {
        const resolutions = this.data.map((dataSet) =>
            this.calculateDataSetResolution(dataSet)
        );
        const hasMultipleDays = resolutions.some(
            (resolution) => resolution === Resolution.Date
        );
        const hasSameDayData = resolutions.some(
            (resolution) => resolution === Resolution.Hour
        );
        const hasMultipleDaysAndSameDayData = resolutions.some(
            (resolution) => resolution === Resolution.DateHour
        );
        if (
            (hasMultipleDays && hasSameDayData) ||
            hasMultipleDaysAndSameDayData
        ) {
            return Resolution.DateHour;
        }
        if (hasMultipleDays) {
            return Resolution.Date;
        }

        return Resolution.Hour;
    }

    private calculateDataSetResolution(
        dataSet: InternalChartData2D
    ): Resolution {
        const dayTicks = this.calculateDayTicks(dataSet);
        const dayTicksValues = [...dayTicks.values()];
        if (dayTicksValues.length === 1) {
            if (dayTicksValues[0] > 1) {
                return Resolution.Hour;
            } else {
                return Resolution.Date;
            }
        }
        if (dayTicksValues.some((value) => value > 1)) {
            return Resolution.DateHour;
        }

        return Resolution.Date;
    }

    private calculateDayTicks(
        dataSet: InternalChartData2D
    ): Map<string, number> {
        const dayTicks = new Map<string, number>();
        const indexes = dataSet.values.map((value) => value.x);
        for (const i of indexes) {
            const day = new Date(this.dates[i]);
            day.setHours(0, 0, 0, 0);
            const dayStr = day.toJSON();
            if (!dayTicks.has(dayStr)) {
                dayTicks.set(dayStr, 0);
            }
            dayTicks.set(dayStr, dayTicks.get(dayStr) + 1);
        }

        return dayTicks;
    }

    private processDataSet(dataSet: ChartData2D): InternalChartData2D {
        if (dataSet.values.length === 0) {
            return dataSet as InternalChartData2D;
        }

        const values = dataSet.values.map((value) => {
            const { y } = value;
            const x = this.dates.indexOf(value.x as Date);

            return { x, y };
        });

        return {
            label: dataSet.label,
            values,
        };
    }

    private getClosestDate(inexactIndex: number): Date {
        let indexDiff = Number.POSITIVE_INFINITY;
        let closestDate = null;
        for (let index = 0; index < this.dates.length; index++) {
            const currentDiff = Math.abs(inexactIndex - index);
            if (currentDiff < indexDiff) {
                indexDiff = currentDiff;
                closestDate = this.dates[index];
            }
            if (currentDiff > indexDiff) {
                break;
            }
        }

        return closestDate;
    }
}

function formatAsDate(date: Date): string {
    const day = twoDigit(date.getDate());
    const month = twoDigit(date.getMonth() + 1);

    return `${day}/${month}`;
}

function formatAsHour(date: Date): string {
    const hour = twoDigit(date.getHours());
    const minute = twoDigit(date.getMinutes());

    return `${hour}:${minute}`;
}

function formatAsDateHour(date: Date): string {
    const formattedDate = formatAsDate(date);
    const formattedHour = formatAsHour(date);

    return `${formattedDate} ${formattedHour}`;
}

function twoDigit(n: number): string {
    const z = n < 10 ? "0" : "";

    return `${z}${n}`;
}

function flattenAndSortDates(data: Array<ChartData2D>): Array<Date> {
    if (data.length === 0) {
        return;
    }
    const dates: Array<Date> = [];
    for (const dataSet of data) {
        for (const value of dataSet.values) {
            if (!(value.x instanceof Date)) {
                throw new Error(
                    "Values must be Date objects to use a date formatter!"
                );
            }
            dates.push(value.x);
        }
    }
    dates.sort((d1, d2) => d1.getTime() - d2.getTime());

    return dates;
}
