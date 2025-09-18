const fs = require('fs');
const path = require('path');
const { getSubfoldersSync, ensureEmptyOutputDirPresent } = require('./fileSystemUtils');

jest.mock('fs');
jest.mock('path');

describe('getSubfoldersSync', () => {
    const folderPath = 'testFolder';
    const outputResultsFolderName = 'outputResults';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return subfolders excluding those with outputResultsFolderName', () => {
        const folderToSearch = 'resolvedTestFolder';
        const entries = [
            { isDirectory: () => true, name: 'subfolder1' },
            { isDirectory: () => true, name: 'outputResultsFolder' },
            { isDirectory: () => false, name: 'file.txt' },
            { isDirectory: () => true, name: 'subfolder2' }
        ];

        path.resolve.mockReturnValue(folderToSearch);
        fs.readdirSync.mockReturnValue(entries);

        const result = getSubfoldersSync(folderPath, outputResultsFolderName);

        expect(path.resolve).toHaveBeenCalledWith(process.cwd(), folderPath);
        expect(fs.readdirSync).toHaveBeenCalledWith(folderToSearch, { withFileTypes: true });
        expect(result).toEqual([
            path.resolve(folderToSearch, 'subfolder1'),
            path.resolve(folderToSearch, 'subfolder2')
        ]);
    });

    test('should return an empty array if readdirSync throws an error', () => {
        const folderToSearch = 'resolvedTestFolder';

        path.resolve.mockReturnValue(folderToSearch);
        fs.readdirSync.mockImplementation(() => {
            throw new Error('Test error');
        });

        const result = getSubfoldersSync(folderPath, outputResultsFolderName);

        expect(path.resolve).toHaveBeenCalledWith(process.cwd(), folderPath);
        expect(fs.readdirSync).toHaveBeenCalledWith(folderToSearch, { withFileTypes: true });
        expect(result).toEqual([]);
    });
});

describe('ensureEmptyOutputDirPresent', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should remove existing directory and create a new one', () => {
        const outputDir = 'testDir';

        fs.existsSync.mockReturnValue(true);

        ensureEmptyOutputDirPresent(outputDir);

        expect(fs.existsSync).toHaveBeenCalledWith(outputDir);
        expect(fs.rmSync).toHaveBeenCalledWith(outputDir, { recursive: true, force: true });
        expect(fs.mkdirSync).toHaveBeenCalledWith(outputDir);
    });

    test('should create a new directory if it does not exist', () => {
        const outputDir = 'testDir';

        fs.existsSync.mockReturnValue(false);

        ensureEmptyOutputDirPresent(outputDir);

        expect(fs.existsSync).toHaveBeenCalledWith(outputDir);
        expect(fs.rmSync).not.toHaveBeenCalled();
        expect(fs.mkdirSync).toHaveBeenCalledWith(outputDir);
    });
});