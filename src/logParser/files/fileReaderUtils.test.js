const {extractFileFromDirectory, extractResultsFile, buildResultsFileLocation, extractFile} = require('./fileReaderUtils');
const fs = require('fs');
const path = require('path');

jest.mock('fs');
jest.mock('path');

beforeEach(() => {
    jest.clearAllMocks();
});


describe('fileReaderUtils', () => {

    describe('extractFile', () => {
        const resultsDir = '/results';
        const folder = 'testFolder';
        const fileName = 'testFile.txt';
        const resultFilePath = '/results/testFolder/testFile.txt';

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should return file content if file exists', () => {
            const fileContent = 'file content';
            path.resolve.mockReturnValue(resultFilePath);
            fs.existsSync.mockReturnValue(true);
            fs.readFileSync.mockReturnValue(fileContent);

            const result = extractFile(resultsDir, folder, fileName);

            expect(path.resolve).toHaveBeenCalledWith(resultsDir, folder);
            expect(path.resolve).toHaveBeenCalledWith(resultFilePath, fileName);
            expect(fs.existsSync).toHaveBeenCalledWith(resultFilePath);
            expect(fs.readFileSync).toHaveBeenCalledWith(resultFilePath, 'utf8');
            expect(result).toBe(fileContent);
        });

        it('should return null if file does not exist', () => {
            path.resolve.mockReturnValue(resultFilePath);
            fs.existsSync.mockReturnValue(false);

            const result = extractFile(resultsDir, folder, fileName);

            expect(path.resolve).toHaveBeenCalledWith(resultsDir, folder);
            expect(path.resolve).toHaveBeenCalledWith(resultFilePath, fileName);
            expect(fs.existsSync).toHaveBeenCalledWith(resultFilePath);
            expect(result).toBeNull();
        });
    });

    describe('buildResultsFileLocation', () => {
        it('should return the correct file path', () => {
            const resultsDir = '/results';
            const folder = 'testFolder';
            const fileName = 'testFile.txt';
            const expectedPath = path.resolve(resultsDir, folder, fileName);

            const result = buildResultsFileLocation(resultsDir, folder, fileName);

            expect(result).toBe(expectedPath);
        });

        it('should handle empty folder name', () => {
            const resultsDir = '/results';
            const folder = '';
            const fileName = 'testFile.txt';
            const expectedPath = path.resolve(resultsDir, fileName);

            const result = buildResultsFileLocation(resultsDir, folder, fileName);

            expect(result).toBe(expectedPath);
        });

        it('should handle empty file name', () => {
            const resultsDir = '/results';
            const folder = 'testFolder';
            const fileName = '';
            const expectedPath = path.resolve(resultsDir, folder);

            const result = buildResultsFileLocation(resultsDir, folder, fileName);

            expect(result).toBe(expectedPath);
        });
    });

    describe('extractFileFromDirectory', () => {

        it('should return parsed JSON data from the specified directory file', () => {
            const resultsDir = '/path/to/results';
            const entry = {name: 'testFolder'};
            const fileName = 'results.json';
            const fileContent = '{"key": "value"}';

            fs.readFileSync.mockReturnValue(fileContent);
            path.resolve.mockImplementation((...args) => args.join('/'));
            fs.existsSync.mockReturnValue(true);

            const result = extractFileFromDirectory(resultsDir, entry, fileName);

            expect(result).toEqual({folder: 'testFolder', data: {key: 'value'}});
            expect(fs.readFileSync).toHaveBeenCalledWith('/path/to/results/testFolder/results.json', 'utf8');
        });

        it('should return null if the file does not exist', () => {
            const resultsDir = '/path/to/results';
            const entry = {name: 'testFolder'};
            const fileName = 'results.json';

            path.resolve.mockImplementation((...args) => args.join('/'));
            fs.existsSync.mockReturnValue(false);

            const result = extractFileFromDirectory(resultsDir, entry, fileName);

            expect(result).toBeNull();
            expect(fs.readFileSync).not.toHaveBeenCalled();
        });
    });

    describe('extractResultsFile', () => {

        test('should return parsed JSON data from the specified results file', () => {
            const resultsDir = '/path/to/results';
            const entry = {name: 'results.json'};
            const fileContent = '{"key": "value"}';

            fs.readFileSync.mockReturnValue(fileContent);
            path.resolve.mockImplementation((...args) => args.join('/'));

            const result = extractResultsFile(resultsDir, entry);

            expect(result).toEqual({folder: 'main', data: {key: 'value'}});
            expect(fs.readFileSync).toHaveBeenCalledWith('/path/to/results/results.json', 'utf8');
        });
    });
});