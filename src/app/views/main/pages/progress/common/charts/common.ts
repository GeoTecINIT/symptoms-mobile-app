export interface ChartData2D {
    label: string;
    values: Array<ChartEntry2D>;
}

interface ChartEntry2D {
    x: number | Date;
    y: number;
}

export interface InternalChartData2D {
    label: string;
    values: Array<InternalChartEntry2D>;
}

export interface InternalChartEntry2D {
    x: number;
    y: number;
}

export type CuttingLines = Array<CuttingLine>;

interface CuttingLine {
    value: number;
    label: string;
}

export interface YAxisDataRange {
    min: number;
    max: number;
}
