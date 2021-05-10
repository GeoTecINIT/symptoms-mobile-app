export function approximateDiff(target: Date, from: Date): ApproximateTimeDiff {
    const diffMs = from.getTime() - target.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);

    if (diffMinutes < 60) {
        return {
            amount: diffMinutes,
            units: "minutes",
        };
    }

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
        return {
            amount: diffHours,
            units: "hours",
        };
    }

    const diffDays = Math.floor(diffHours / 24);

    return {
        amount: diffDays,
        units: "days",
    };
}

export interface ApproximateTimeDiff {
    amount: number;
    units: "minutes" | "hours" | "days";
}
