import { TestBed } from "@angular/core/testing";

import { ContentModule } from "~/app/views/main/pages/content/content.module";

import { TreatmentContentService } from "~/app/views/treatment-content.service";

describe("TreatmentContentService", () => {
    let service: TreatmentContentService;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [ContentModule] });
        service = TestBed.inject(TreatmentContentService);
    });

    it("returns a sorted list of treatment contents", async () => {
        const contents = await service.getAll();
        expect(contents.length).toBeGreaterThan(0);
        for (let i = 1; i < contents.length; i++) {
            expect(contents[i].index).toBeGreaterThan(contents[i - 1].index);
        }
    });

    it("allows to retrieve a content by its id", async () => {
        const expectedContent = await getRandomContent(service);
        const oneContent = await service.getById(expectedContent.id);
        expect(oneContent).toEqual(expectedContent);
    });

    it("allows to mark a content as seen", async () => {
        const oneContent = await getRandomContent(service);
        await service.markAsSeen(oneContent.id);
        const updatedContent = await service.getById(oneContent.id);
        expect(updatedContent.seen).toBeTruthy();
    });
});

async function getRandomContent(service: TreatmentContentService) {
    const contents = await service.getAll();

    return contents[Math.floor(Math.random() * contents.length)];
}
