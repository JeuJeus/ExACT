const {fileIsPng, entryIsLogfile} = require("./fileUtils");
const fs = require("fs");
const path = require("path");
const {log} = require("../util/logger");

const extractMatchingLines = (logFileContent, regExp) => {
    try {
        const lines = logFileContent.split('\n');
        return lines.filter(line => regExp.test(line));
    } catch (err) {
        console.error('Unable to read file:', err);
        return [];
    }
};

const findPngImages = dirPath => {
    try {
        log(`Finding PNG images in: ${dirPath}`);
        return fs.readdirSync(dirPath)
            .filter(file => fileIsPng(file));
    } catch (error) {
        console.error(`Error reading directory: ${error.message}`);
        return [];
    }
};

const getLogFilesSync = dirPath => {
    try {
        log(`Getting log files in: ${dirPath}`);
        return fs
            .readdirSync(dirPath, {withFileTypes: true})
            .filter(entry => entryIsLogfile(entry))
            .map(entry => path.resolve(dirPath, entry.name));
    } catch (err) {
        console.error('Unable to scan directory:', err);
        return [];
    }
};

module.exports = {
    extractMatchingLines,
    findPngImages,
    getLogFilesSync
}