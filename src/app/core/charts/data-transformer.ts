import { Record } from "@geotecinit/emai-framework/entities";
import { ChartDescription } from "~/app/core/charts/chart-description";
import { RecordType } from "~/app/core/record-type";
import { ExposureChange } from "~/app/tasks/exposure";
import { formatAsDate } from "~/app/core/utils/time";
import {
    CuttingLines,
    YAxisDataRange,
} from "~/app/views/main/pages/progress/common/charts";

export const ANXIETY_LEVEL_RANGE: YAxisDataRange = {
    min: 0,
    max: 10,
};

export const ANXIETY_THRESHOLDS: CuttingLines = [
    { label: "Leve", value: 2 },
    { label: "Moderada", value: 5 },
    { label: "Alta", value: 8 },
];

export function transformIntoChartDescription(
    record: Record
): ChartDescription {
    switch (record.type) {
        case RecordType.ExposureChange:
            return transformExposureChangeIntoChartDescription(
                record as ExposureChange
            );
        default:
            throw new Error(
                `Cannot transform ${record.type} record type. Reason: transformation process is unknown.`
            );
    }
}

function transformExposureChangeIntoChartDescription(
    exposureChange: ExposureChange
): ChartDescription {
    return {
        iconCode: "\ue55e",
        title: `En ${exposureChange.place.name}`,
        subtitle: `(${formatAsDate(
            exposureChange.timestamp
        )}) Nivel de ansidedad`,
        chart: {
            yAxisDataRange: ANXIETY_LEVEL_RANGE,
            cuttingLines: ANXIETY_THRESHOLDS,
            data: [
                {
                    label: "Nivel de ansiedad",
                    values: exposureChange.emotionValues.map(
                        (emotionValue) => ({
                            x: emotionValue.timestamp,
                            y: emotionValue.value,
                        })
                    ),
                },
            ],
        },
    };
}
