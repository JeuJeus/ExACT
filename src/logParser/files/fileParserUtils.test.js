const fs = require('fs');
const path = require("path");
const {findPngImages, extractMatchingLines, getLogFilesSync} = require('./fileParserUtils');
const fileUtils = require('./fileUtils');
const logger = require('../util/logger');

jest.mock('../util/logger', () => ({
    log: jest.fn(),
}));

describe('findPngImages', () => {
    test('should return an array of PNG files in the directory', () => {
        const dirPath = '/path/to/dir';
        const files = ['image1.png', 'image2.jpg', 'image3.png'];

        jest.spyOn(fs, 'readdirSync').mockReturnValue(files);
        jest.spyOn(fileUtils, 'fileIsPng').mockImplementation(file => file.endsWith('.png'));

        const result = findPngImages(dirPath);

        expect(result).toEqual(['image1.png', 'image3.png']);
        expect(logger.log).toHaveBeenCalledWith(`Finding PNG images in: ${dirPath}`);
    });

    test('should return an empty array if no PNG files are found', () => {
        const dirPath = '/path/to/dir';
        const files = ['image1.jpg', 'image2.gif'];

        jest.spyOn(fs, 'readdirSync').mockReturnValue(files);
        jest.spyOn(fileUtils, 'fileIsPng').mockImplementation(file => file.endsWith('.png'));

        const result = findPngImages(dirPath);

        expect(result).toEqual([]);
        expect(logger.log).toHaveBeenCalledWith(`Finding PNG images in: ${dirPath}`);
    });

    test('should return an empty array and log an error if directory reading fails', () => {
        const dirPath = '/path/to/dir';
        const errorMessage = 'Error reading directory';

        jest.spyOn(fs, 'readdirSync').mockImplementation(() => {
            throw new Error(errorMessage);
        });
        jest.spyOn(console, 'error').mockImplementation(() => {});

        const result = findPngImages(dirPath);

        expect(result).toEqual([]);
        expect(console.error).toHaveBeenCalledWith(`Error reading directory: ${errorMessage}`);
    });
});

describe('extractMatchingLines', () => {
    test('should return matching lines based on the given regex', () => {
        const logFileContent = 'line1\nline2\nline3';
        const regExp = /line2/;
        const result = extractMatchingLines(logFileContent, regExp);
        expect(result).toEqual(['line2']);
    });

    test('should return an empty array if no lines match the regex', () => {
        const logFileContent = 'line1\nline2\nline3';
        const regExp = /line4/;
        const result = extractMatchingLines(logFileContent, regExp);
        expect(result).toEqual([]);
    });

    test('should handle empty log file content gracefully', () => {
        const logFileContent = '';
        const regExp = /line/;
        const result = extractMatchingLines(logFileContent, regExp);
        expect(result).toEqual([]);
    });

    test('should return multiple matching lines', () => {
        const logFileContent = 'line1\nline2\nline3\nline2';
        const regExp = /line2/;
        const result = extractMatchingLines(logFileContent, regExp);
        expect(result).toEqual(['line2', 'line2']);
    });
});

describe('getLogFilesSync', () => {
    test('should return an array of log files in the directory', () => {
        const dirPath = '/path/to/dir';
        const files = [
            {name: 'log1.log', isFile: () => true},
            {name: 'log2.txt', isFile: () => true},
            {name: 'log3.log', isFile: () => true}
        ];

        jest.spyOn(fs, 'readdirSync').mockReturnValue(files);
        jest.spyOn(fileUtils, 'entryIsLogfile').mockImplementation(entry => entry.name.endsWith('.log'));
        jest.spyOn(path, 'resolve').mockImplementation((...args) => args.join('/'));

        const result = getLogFilesSync(dirPath);

        expect(result).toEqual([`${dirPath}/log1.log`, `${dirPath}/log3.log`]);
        expect(logger.log).toHaveBeenCalledWith(`Getting log files in: ${dirPath}`);
    });

    test('should return an empty array if no log files are found', () => {
        const dirPath = '/path/to/dir';
        const files = [
            {name: 'log1.txt', isFile: () => true},
            {name: 'log2.txt', isFile: () => true}
        ];

        jest.spyOn(fs, 'readdirSync').mockReturnValue(files);
        jest.spyOn(fileUtils, 'entryIsLogfile').mockImplementation(entry => entry.name.endsWith('.log'));

        const result = getLogFilesSync(dirPath);

        expect(result).toEqual([]);
        expect(logger.log).toHaveBeenCalledWith(`Getting log files in: ${dirPath}`);
    });

    test('should return an empty array and log an error if directory reading fails', () => {
        const dirPath = '/path/to/dir';
        const errorMessage = 'Error reading directory';

        jest.spyOn(fs, 'readdirSync').mockImplementation(() => {
            throw new Error(errorMessage);
        });
        jest.spyOn(console, 'error').mockImplementation(() => {});

        const result = getLogFilesSync(dirPath);

        expect(result).toEqual([]);
        expect(console.error).toHaveBeenCalledWith('Unable to scan directory:', new Error(errorMessage));
    });
});