const path = require('path');
const fs = require("fs");
const {log} = require("../util/logger");
const {extractFileFromDirectory, extractResultsFile} = require("./fileReaderUtils");

const fileIsPng = file => path.extname(file).toLowerCase() === '.png';

const entryIsResultsFile = (entry, fileName) => entry.isFile() && entry.name === fileName;

const entryIsLogfile = entry => entry.isFile() && entry.name.endsWith('.log');

const serialize = results => JSON.stringify(results, null, 2);

const writeResults = (dirPath, results) => {
    const resultFilePath = path.resolve(dirPath, 'results.json');
    try {
        log(`Writing results to: ${resultFilePath}`);
        fs.writeFileSync(resultFilePath, serialize(results), 'utf8');
        log(`Results written to ${resultFilePath}`);
    } catch (err) {
        console.error(`Unable to write results file: ${err}`);
    }
};

const writeResultsToFile = (data, outputFile) => {
    log(`Writing results to file: ${outputFile}`);
    fs.writeFileSync(outputFile, JSON.stringify(data), 'utf8');
};

const extractJson = (resultsDir, fileName) => {
    const folders = fs.readdirSync(resultsDir, {withFileTypes: true});

    return folders
        .map(entry => {
            if (entry.isDirectory()) {
                return extractFileFromDirectory(resultsDir, entry, fileName);
            } else if (entryIsResultsFile(entry, fileName)) {
                return extractResultsFile(resultsDir, entry);
            }
            return null;
        })
        .filter(item => item !== null);
};

module.exports = {
    entryIsResultsFile,
    entryIsLogfile,
    fileIsPng,
    writeResults,
    serialize,
    writeResultsToFile,
    extractJson
}