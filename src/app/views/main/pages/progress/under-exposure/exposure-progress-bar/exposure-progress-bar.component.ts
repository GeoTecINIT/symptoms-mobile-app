import { Component, Input } from "@angular/core";
import { BarSegment } from "./segment";

@Component({
    selector: "SymExposureProgressBar",
    templateUrl: "./exposure-progress-bar.component.html",
    styleUrls: ["./exposure-progress-bar.component.scss"],
})
export class ExposureProgressBarComponent {
    @Input() progress: number;
    @Input() segments: Array<BarSegment>;

    get activeSegments(): Array<BarSegment> {
        return this.segments.filter(
            (segment) =>
                this.progress >= segment.from ||
                segment.defaultVisibility === "visible"
        );
    }

    get segmentsColumns(): string {
        const segmentSizes = this.activeSegments.map(
            (segment) => segment.to - segment.from
        );
        const totalSize = segmentSizes.reduce((prev, curr) => prev + curr);
        const segmentPercents = segmentSizes.map(
            (size) => (size / totalSize) * 100
        );

        return segmentPercents.map((percent) => `${percent}*`).join(",");
    }

    get segmentsNotes(): Array<string> {
        return this.activeSegments.map((segment) => segment.note ?? "");
    }

    get segmentsPercentages(): Array<SegmentProgress> {
        const globalProgress = this.progress;

        return this.activeSegments.map((segment) => {
            const {
                from,
                to,
                progressColorClass,
                backgroundColorClass,
            } = segment;
            const total = to - from;
            const projectedProgress = Math.min(
                Math.max(globalProgress - from, 0),
                total
            );

            return {
                progress: (projectedProgress / total) * 100,
                progressColorClass,
                backgroundColorClass,
            };
        });
    }
}

interface SegmentProgress {
    progress: number;
    progressColorClass: string;
    backgroundColorClass: string;
}
