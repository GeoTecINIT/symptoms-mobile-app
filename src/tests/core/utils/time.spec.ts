import { approximateDiff } from "~/app/core/utils/time";

describe("Time utils", () => {
    it("returns a difference of 0 minutes for two dates close by less than 1 minute", () => {
        const target = new Date(2021, 4, 10, 10, 50);
        const from = new Date(2021, 4, 10, 10, 50, 59, 999);
        const diff = approximateDiff(target, from);

        expect(diff.amount).toBe(0);
        expect(diff.units).toEqual("minutes");
    });

    it("returns a difference of 59 minutes for two dates close by less than 1 hour", () => {
        const target = new Date(2021, 4, 10, 10, 50);
        const from = new Date(2021, 4, 10, 11, 49, 59, 999);
        const diff = approximateDiff(target, from);

        expect(diff.amount).toBe(59);
        expect(diff.units).toEqual("minutes");
    });
    it("returns a difference of 23 hours for two dates close by less than 1 day", () => {
        const target = new Date(2021, 4, 10, 10, 50);
        const from = new Date(2021, 4, 11, 10, 49, 59, 999);
        const diff = approximateDiff(target, from);

        expect(diff.amount).toBe(23);
        expect(diff.units).toEqual("hours");
    });
    it("returns a difference of 1 day for two dates with an exact 1-day difference", () => {
        const target = new Date(2021, 4, 10, 10, 50);
        const from = new Date(2021, 4, 11, 10, 50);
        const diff = approximateDiff(target, from);

        expect(diff.amount).toBe(1);
        expect(diff.units).toEqual("days");
    });
});
