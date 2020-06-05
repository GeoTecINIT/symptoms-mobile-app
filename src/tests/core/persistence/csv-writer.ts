import { knownFolders } from "tns-core-modules/file-system";
import { CSVWriter } from "~/app/core/persistence/csv-writer";

describe("CSV Writer", () => {
    const documents = knownFolders.documents();
    const folderName = "CSVTest";
    const folder = documents.getFolder(folderName);
    const fileName = "test.csv";

    const firstEntity: ExampleEntity = {
        name: "name1",
        description: "desc1",
        value: 1,
    };

    const secondEntity: ExampleEntity = {
        name: "name2",
        description: "desc2",
        value: 2,
    };

    const thirdEntity: ExampleEntity = {
        name: "name3",
        description: "desc3",
        value: 3,
    };

    const writer = new CSVWriter(folderName, fileName);

    it("writes a line and the file header when file does not exist", async () => {
        await writer.write(firstEntity);

        const result = await folder.getFile(fileName).readText();
        console.log(`CSVWriter: ${result}`);
        const lines = result.split("\n");

        expect(lines.length).toBe(2);
        expect(lines[0]).toEqual("description,name,value");
        expect(lines[1]).toEqual(`"desc1","name1",1`);
    });

    it("writes multiple lines and only one header when file already exists", async () => {
        await writer.write(firstEntity);
        await writer.write(secondEntity);
        await writer.write(thirdEntity);

        const result = await folder.getFile(fileName).readText();
        console.log(`CSVWriter: ${result}`);
        const lines = result.split("\n");

        expect(lines.length).toBe(4);
        expect(lines[0]).toEqual("description,name,value");
        expect(lines[1]).toEqual(`"desc1","name1",1`);
        expect(lines[2]).toEqual(`"desc2","name2",2`);
        expect(lines[3]).toEqual(`"desc3","name3",3`);
    });

    afterEach(() => {
        folder.getFile(fileName).removeSync();
    });

    afterAll(() => {
        folder.removeSync();
    });
});

interface ExampleEntity {
    name: string;
    description: string;
    value: number;
}
