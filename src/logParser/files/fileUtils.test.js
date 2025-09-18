const fileUtils = require('./fileUtils');
const { extractFileFromDirectory, extractResultsFile } = require('./fileReaderUtils');
const path = require('path');
const fs = require('fs');
const log = require('../util/logger');

jest.mock('fs');
jest.mock('path');
jest.mock('../util/logger', () => ({
    log: jest.fn(),
}));
jest.mock('./fileReaderUtils', () => ({
    extractFileFromDirectory: jest.fn(),
    extractResultsFile: jest.fn(),
}));

describe('extractJson', () => {
    const resultsDir = '/results';
    const fileName = 'results.json';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should extract JSON from directories and files', () => {
        const folders = [
            { isDirectory: () => true, isFile: () => false, name: 'folder1' },
            { isDirectory: () => false, isFile: () => true, name: 'results.json' },
            { isDirectory: () => false, isFile: () => true, name: 'otherFile.txt' }
        ];
        const extractedFile = 'file content';
        const extractedResultsFile = { key: 'value' };

        fs.readdirSync.mockReturnValue(folders);
        extractFileFromDirectory.mockReturnValue(extractedFile);
        extractResultsFile.mockReturnValue(extractedResultsFile);

        const result = fileUtils.extractJson(resultsDir, fileName);

        expect(fs.readdirSync).toHaveBeenCalledWith(resultsDir, { withFileTypes: true });
        expect(extractFileFromDirectory).toHaveBeenCalledWith(resultsDir, folders[0], fileName);
        expect(extractResultsFile).toHaveBeenCalledWith(resultsDir, folders[1]);
        expect(result).toEqual([extractedFile, extractedResultsFile]);
    });

    it('should filter out null values', () => {
        const folders = [
            { isDirectory: () => true, isFile: () => false, name: 'folder1' },
            { isDirectory: () => false, isFile: () => true, name: 'results.json' },
            { isDirectory: () => false, isFile: () => true, name: 'otherFile.txt' }
        ];

        fs.readdirSync.mockReturnValue(folders);
        extractFileFromDirectory.mockReturnValue(null);
        extractResultsFile.mockReturnValue(null);

        const result = fileUtils.extractJson(resultsDir, fileName);

        expect(fs.readdirSync).toHaveBeenCalledWith(resultsDir, { withFileTypes: true });
        expect(result).toEqual([]);
    });
});

describe('writeResults', () => {
    const dirPath = '/results';
    const results = { key: 'value' };
    const resultFilePath = path.resolve(dirPath, 'results.json');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should write results to a file', () => {
        fs.writeFileSync.mockImplementation(() => {});
        path.resolve.mockReturnValue(resultFilePath);

        fileUtils.writeResults(dirPath, results);

        expect(path.resolve).toHaveBeenCalledWith(dirPath, 'results.json');
        expect(fs.writeFileSync).toHaveBeenCalledWith(resultFilePath, JSON.stringify(results, null, 2), 'utf8');
        expect(log.log).toHaveBeenCalledWith(`Writing results to: ${resultFilePath}`);
        expect(log.log).toHaveBeenCalledWith(`Results written to ${resultFilePath}`);
    });

    it('should log an error if writing fails', () => {
        const error = new Error('write error');
        fs.writeFileSync.mockImplementation(() => { throw error; });
        path.resolve.mockReturnValue(resultFilePath);
        console.error = jest.fn();

        fileUtils.writeResults(dirPath, results);

        expect(path.resolve).toHaveBeenCalledWith(dirPath, 'results.json');
        expect(fs.writeFileSync).toHaveBeenCalledWith(resultFilePath, JSON.stringify(results, null, 2), 'utf8');
        expect(log.log).toHaveBeenCalledWith(`Writing results to: ${resultFilePath}`);
        expect(console.error).toHaveBeenCalledWith(`Unable to write results file: ${error}`);
    });
});

describe('serialize', () => {
    it('should serialize an object to a JSON string with 2-space indentation', () => {
        const results = { key: 'value' };
        const expected = JSON.stringify(results, null, 2);

        const result = fileUtils.serialize(results);

        expect(result).toBe(expected);
    });

    it('should serialize an empty object to a JSON string', () => {
        const results = {};
        const expected = JSON.stringify(results, null, 2);

        const result = fileUtils.serialize(results);

        expect(result).toBe(expected);
    });

    it('should serialize an array to a JSON string with 2-space indentation', () => {
        const results = [1, 2, 3];
        const expected = JSON.stringify(results, null, 2);

        const result = fileUtils.serialize(results);

        expect(result).toBe(expected);
    });
});

describe('entryIsPng', () => {
    it('should return true if file extension is .png', () => {
        const file = 'image.png';
        path.extname.mockReturnValue('.png');

        const result = fileUtils.fileIsPng(file);

        expect(result).toBe(true);
    });

    it('should return false if file extension is not .png', () => {
        const file = 'image.jpg';
        path.extname.mockReturnValue('.jpg');

        const result = fileUtils.fileIsPng(file);

        expect(result).toBe(false);
    });

    it('should return true if file extension is .PNG (case insensitive)', () => {
        const file = 'image.PNG';
        path.extname.mockReturnValue('.PNG');

        const result = fileUtils.fileIsPng(file);

        expect(result).toBe(true);
    });

    it('should return false if file has no extension', () => {
        const file = 'image';
        path.extname.mockReturnValue('');

        const result = fileUtils.fileIsPng(file);

        expect(result).toBe(false);
    });
});

describe('entryIsLogfile', () => {
    it('should return true if entry is a file and name ends with .log', () => {
        const entry = {isFile: () => true, name: 'testFile.log'};

        const result = fileUtils.entryIsLogfile(entry);

        expect(result).toBe(true);
    });

    it('should return false if entry is not a file', () => {
        const entry = {isFile: () => false, name: 'testFile.log'};

        const result = fileUtils.entryIsLogfile(entry);

        expect(result).toBe(false);
    });

    it('should return false if entry name does not end with .log', () => {
        const entry = {isFile: () => true, name: 'testFile.txt'};

        const result = fileUtils.entryIsLogfile(entry);

        expect(result).toBe(false);
    });
});

describe('entryIsResultsFile', () => {
    it('should return true if entry is a file and name matches', () => {
        const entry = {isFile: () => true, name: 'testFile.txt'};
        const fileName = 'testFile.txt';

        const result = fileUtils.entryIsResultsFile(entry, fileName);

        expect(result).toBe(true);
    });

    it('should return false if entry is not a file', () => {
        const entry = {isFile: () => false, name: 'testFile.txt'};
        const fileName = 'testFile.txt';

        const result = fileUtils.entryIsResultsFile(entry, fileName);

        expect(result).toBe(false);
    });

    it('should return false if entry name does not match', () => {
        const entry = {isFile: () => true, name: 'anotherFile.txt'};
        const fileName = 'testFile.txt';

        const result = fileUtils.entryIsResultsFile(entry, fileName);

        expect(result).toBe(false);
    });
});
