import { Record } from "@awarns/core/entities";
import { ChartDescription } from "~/app/core/charts/chart-description";
import { AppRecordType } from "~/app/core/app-record-type";
import { ExposureChange } from "~/app/tasks/exposure";
import { formatAsDate, formatAsDateText } from "~/app/core/utils/time";
import {
    CuttingLines,
    YAxisDataRange,
} from "~/app/views/main/pages/progress/common/charts";
import {
    ExposureAggregate,
    ExposurePlaceAggregate,
} from "~/app/tasks/visualizations";

export function transformIntoChartDescription(
    record: Record,
    showPlaceName?: boolean // This is a variable that only affects to ExposureChange line charts in order to change the title and subtitle content
): ChartDescription {
    switch (record.type) {
        case AppRecordType.ExposureChange:
            return transformExposureChange(
                record as ExposureChange,
                showPlaceName
            );
        case AppRecordType.ExposureAggregate:
            return transformExposureAggregate(record as ExposureAggregate);
        case AppRecordType.ExposurePlaceAggregate:
            return transformExposurePlaceAggregate(
                record as ExposurePlaceAggregate
            );
        default:
            throw new Error(
                `Cannot transform ${record.type} record type. Reason: transformation process is unknown.`
            );
    }
}

function transformExposureChange(
    exposureChange: ExposureChange,
    showPlaceName: boolean
): ChartDescription {
    const chartData = [
        {
            label: `Nivel de ansiedad`,
            values: exposureChange.emotionValues.map((emotionValue) => ({
                x: emotionValue.timestamp,
                y: emotionValue.value,
            })),
            successful: exposureChange.successful,
        },
    ];

    if (
        exposureChange.toleranceValues &&
        exposureChange.toleranceValues.length > 0
    ) {
        chartData.push({
            label: `Nivel de tolerancia`,
            values: exposureChange.toleranceValues.map((toleranceValue) => ({
                x: toleranceValue.timestamp,
                y: toleranceValue.value,
            })),
            successful: exposureChange.successful,
        });
    }

    return {
        iconCode: "\ue55e",
        title: showPlaceName
            ? `En ${exposureChange.place.name}`
            : `${formatAsDateText(exposureChange.timestamp)}`,
        subtitle: getSubtitle(exposureChange, showPlaceName),
        chart: {
            yAxisDataRange: ANXIETY_LEVEL_RANGE,
            cuttingLines: ANXIETY_THRESHOLDS,
            data: chartData,
        },
    };
}

function transformExposureAggregate(
    exposureAggregate: ExposureAggregate
): ChartDescription {
    return {
        iconCode: "\ue26b",
        title: `Últimas exposiciones`,
        subtitle: "Nivel de ansiedad medio",
        chart: {
            yAxisDataRange: ANXIETY_LEVEL_RANGE,
            cuttingLines: ANXIETY_THRESHOLDS,
            data: exposureAggregate.data?.map((placeAggregate) => {
                const obj = {
                    label: placeAggregate.placeName,
                    values: placeAggregate.emotionValues.map(
                        (emotionValue) => ({
                            x: emotionValue.timestamp,
                            y: emotionValue.value,
                        })
                    ),
                    successful: placeAggregate.successful,
                };
                return obj;
            }),
        },
    };
}

function transformExposurePlaceAggregate(
    exposurePlaceAggregate: ExposurePlaceAggregate
): ChartDescription {
    const values = exposurePlaceAggregate.emotionValues.map((emotionValue) => ({
        x: emotionValue.timestamp,
        y: emotionValue.value,
    }));

    return {
        iconCode: "\ue26b",
        title: `En ${exposurePlaceAggregate.placeName}`,
        subtitle: "Nivel de ansiedad medio",
        chart: {
            yAxisDataRange: ANXIETY_LEVEL_RANGE,
            cuttingLines: ANXIETY_THRESHOLDS,
            data: [
                {
                    label: `Nivel de ansiedad medio`,
                    values: exposurePlaceAggregate.emotionValues.map(
                        (emotionValue) => ({
                            x: emotionValue.timestamp,
                            y: emotionValue.value,
                        })
                    ),
                    successful: exposurePlaceAggregate.successful,
                },
            ],
        },
    };
}

const ANXIETY_LEVEL_RANGE: YAxisDataRange = {
    min: 0,
    max: 10,
};

const ANXIETY_THRESHOLDS: CuttingLines = [
    { label: "Leve", value: 2 },
    { label: "Moderada", value: 5 },
    { label: "Alta", value: 8 },
];

function getSubtitle(
    exposureChange: ExposureChange,
    showPlaceName: boolean
): string {
    const subtitle = `${
        exposureChange.emotionValues.length > 1
            ? `Exposición ${
                  exposureChange.successful ? "completada" : "interrumpida"
              }`
            : "No se recogieron suficientes datos"
    }`;

    return showPlaceName
        ? formatAsDateText(exposureChange.timestamp)
        : subtitle;
}
