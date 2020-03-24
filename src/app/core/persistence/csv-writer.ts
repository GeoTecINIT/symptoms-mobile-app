import { knownFolders, Folder, File } from 'tns-core-modules/file-system';

const SEPARATOR = ',';

export class CSVWriter {
    private folder: Folder;
    private textToWrite = '';

    constructor(folderName: string, private fileName: string) {
        const documents = knownFolders.documents();
        this.folder = documents.getFolder(folderName);
    }

    async write(dict: DictObj): Promise<void> {
        if (!this.folder.contains(this.fileName)) {
            this.writeHeaders(dict);
        }
        this.writeRow(dict);
        await this.flush();
    }

    private writeHeaders(dict: DictObj) {
        const headers = this.getSortedDictKeys(dict);
        this.writeLine(headers.join(SEPARATOR));
    }

    private writeRow(dict: DictObj) {
        const headers = this.getSortedDictKeys(dict);
        const row = headers.reduce((prev, curr) => {
            const formatted = this.formatValue(dict[curr]);
            if (prev === '') {
                return formatted;
            }

            return `${prev},${formatted}`;
        }, '');
        this.writeLine(row);
    }

    private formatValue(value: any): string {
        switch (typeof value) {
            case 'string':
                return `"${value.replace('"', '\\"')}"`;
            case 'number':
                return `${value}`;
        }
    }

    private writeLine(line: string) {
        if (this.textToWrite === '') {
            this.textToWrite = line;
        } else {
            this.textToWrite = this.textToWrite + '\n' + line;
        }
    }

    private async flush(): Promise<void> {
        let fileContent = this.textToWrite;
        const { exists, file } = this.getFile();
        if (exists) {
            const existingContent = await file.readText();
            fileContent = existingContent + '\n' + fileContent;
        }
        await file.writeText(fileContent);
        this.textToWrite = '';
    }

    private getFile() {
        return {
            exists: this.folder.contains(this.fileName),
            file: this.folder.getFile(this.fileName)
        };
    }

    private getSortedDictKeys(dict: DictObj) {
        return Object.keys(dict).sort();
    }
}

interface DictObj {
    [key: string]: any;
}
