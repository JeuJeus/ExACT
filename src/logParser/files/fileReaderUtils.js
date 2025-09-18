const fs = require("fs");
const path = require("path");
const {log} = require("../util/logger");

const buildResultsFileLocation = (resultsDir, folder, fileName) => {
    const folderPath = path.resolve(resultsDir, folder);
    return path.resolve(folderPath, fileName);
};

const extractFile = (resultsDir, folder, fileName) => {
    const resultFilePath = buildResultsFileLocation(resultsDir, folder, fileName);
    if (!fs.existsSync(resultFilePath)) {
        log(`File not found: ${resultFilePath}`);
        return null;
    }
    log(`Extracting file: ${resultFilePath}`);
    return fs.readFileSync(resultFilePath, 'utf8');
};

const extractFileFromDirectory = (resultsDir, entry, fileName) => {
    const data = extractFile(resultsDir, entry.name, fileName);
    if (!data) return null;
    const dataAsJson = JSON.parse(data);
    return {folder: entry.name, data: dataAsJson};
};

const extractResultsFile = (resultsDir, entry) => {
    const data = fs.readFileSync(path.resolve(resultsDir, entry.name), 'utf8');
    const dataAsJson = JSON.parse(data);
    return {folder: 'main', data: dataAsJson};
};

module.exports = {
    extractFileFromDirectory,
    extractResultsFile,
    buildResultsFileLocation,
    extractFile
}