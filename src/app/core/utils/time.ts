export function formatAsDate(date: Date): string {
    const day = twoDigit(date.getDate());
    const month = twoDigit(date.getMonth() + 1);

    return `${day}/${month}`;
}

export function formatAsHour(date: Date): string {
    const hour = twoDigit(date.getHours());
    const minute = twoDigit(date.getMinutes());

    return `${hour}:${minute}`;
}

export function formatAsDateHour(date: Date): string {
    const formattedDate = formatAsDate(date);
    const formattedHour = formatAsHour(date);

    return `${formattedDate} ${formattedHour}`;
}

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

function twoDigit(n: number): string {
    const z = n < 10 ? "0" : "";

    return `${z}${n}`;
}
