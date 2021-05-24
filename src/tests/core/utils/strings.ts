import { embedModel } from "~/app/core/utils/strings";

describe("Strings utils", () => {
    const templateString =
        "[{{id}}] You have reached: {{aoi.name}} (type={{aoi.category}}). Distance: {{aoi.distance.value}} {{aoi.distance.units}}";

    it("embeds a model inside a template string", () => {
        const model = {
            id: 0,
            aoi: {
                name: "AoI1",
                category: "Park",
                distance: {
                    value: 10,
                    units: "meters",
                },
            },
        };
        const output = embedModel(templateString, model);
        expect(output).toEqual(
            "[0] You have reached: AoI1 (type=Park). Distance: 10 meters"
        );
    });

    it("skips embedding a property when it does not exist", () => {
        const model = {
            aoi: {
                name: "AoI1",
                category: "Park",
                distance: {
                    value: 10,
                    units: "meters",
                },
            },
        };
        const output = embedModel(templateString, model);
        expect(output).toEqual(
            "[{{id}}] You have reached: AoI1 (type=Park). Distance: 10 meters"
        );
    });

    it("leaves the template as it is when no property matches", () => {
        const model = {};
        const output = embedModel(templateString, model);
        expect(output).toEqual(templateString);
    });
});
