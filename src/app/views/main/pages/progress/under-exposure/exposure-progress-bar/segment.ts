export interface BarSegment {
    from: number;
    to: number;
    note?: string;
    progressColorClass: string;
    backgroundColorClass: string;
    defaultVisibility: "visible" | "hidden";
}
