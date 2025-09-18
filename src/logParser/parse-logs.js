const fs = require('fs');
const path = require('path');
require('dotenv').config();

const resultsFolderName = process.env.RESULTS_FOLDER_NAME;
const resultsFileName = process.env.RESULTS_FILE_NAME;
const compromisesFileName = process.env.COMPROMISES_FILE_NAME;

const outputResultsFolderName = process.env.OUTPUT_RESULTS_FOLDER_NAME;
const outputFileName = process.env.OUTPUT_FILE_NAME;
const outputScoreFileName = process.env.OUTPUT_SCORE_FILE_NAME;

const resultsDir = path.resolve(process.cwd(), resultsFolderName);

const outputDir = path.resolve(resultsDir, outputResultsFolderName);
const outputCombinedResultsCompromisesFile = path.resolve(outputDir, outputFileName);
const outputScoreFile = path.resolve(outputDir, outputScoreFileName);

const {validateProperties} = require('./propertyExtraction/extractProperties');
const {ensureEmptyOutputDirPresent, getSubfoldersSync} = require('./files/fileSystemUtils');
const {extractJson, writeResults, writeResultsToFile} = require('./files/fileUtils');
const {log} = require('./util/logger');
const {
    findPngImages,
    extractMatchingLines,
    getLogFilesSync
} = require('./files/fileParserUtils');
const {calculateArchitectureScore} = require("./propertyExtraction/logic/score/scoreGeneration");

const validateWellformedness = logFileContent => {
    const wellformednessValidation = '/* All wellformedness checks were successful. */';
    const isWellFormed = logFileContent.includes(wellformednessValidation);
    return {wellformed: isWellFormed};
};

const findValidatedLemmas = logFileContent => {
    const regex = /verified \(\d+ steps\)/;
    const matchingLines = extractMatchingLines(logFileContent, regex);
    return {
        verifiedLemmas: matchingLines,
        numberOfVerifiedLemmas: matchingLines.length
    };
};

const findFalsifiedLemmas = logFileContent => {
    const regex = /falsified - found trace \(\d+ steps\)/;
    const matchingLines = extractMatchingLines(logFileContent, regex);
    const containsNoInvalidLemmas = matchingLines.length <= 0;
    return {
        falsifiedLemmas: matchingLines,
        numberOfFalsifiedLemmas: matchingLines.length,
        doAllLemmasHold: containsNoInvalidLemmas
    };
};

const findTracesVisualization = dirPath => {
    const pngImages = findPngImages(dirPath);
    return {
        tracesVisualization: pngImages
    };
};

const addNameOfLogfile = dirPath => ({
    name: path.basename(dirPath)
});

const parseLogFiles = dirPath => {
    const logFiles = getLogFilesSync(dirPath);
    const results = {};

    logFiles.forEach(logFile => {
        try {
            log(`Reading log file: ${logFile}`);
            const logFileContent = fs.readFileSync(logFile, 'utf8');

            Object.assign(results, validateWellformedness(logFileContent));
            Object.assign(results, findValidatedLemmas(logFileContent));
            Object.assign(results, findFalsifiedLemmas(logFileContent));

            Object.assign(results, findTracesVisualization(dirPath));
            Object.assign(results, addNameOfLogfile(dirPath));

        } catch (err) {
            console.error('Unable to read file:', err);
        }
    });

    writeResults(dirPath, results);
};

const combineFiles = (compromises, results) => {
    const compromiseMapped = compromises.reduce((acc, item) => {
        acc[item.folder] = item.data;
        return acc;
    }, {});

    return results
        .map((resultsItem, index) => {
            const compromiseMappedElement = compromiseMapped[resultsItem.folder];
            const compromised = compromiseMappedElement.entities.concat(compromiseMappedElement.domains);
            return ({
                folder: resultsItem.folder,
                data: {
                    index: index,
                    ...resultsItem.data,
                    ...compromiseMappedElement,
                    compromised: compromised
                }
            });
        })
        .filter(item => Object.keys(item.data).length > 0);
};

const handleCombinedOutput = (results, compromises, outputFile) => {
    const combinedData = combineFiles(compromises, results);
    const enhancedCombinedData = validateProperties(combinedData);
    writeResultsToFile(enhancedCombinedData, outputFile);
};

const generateCombinedOutput = () => {
    getSubfoldersSync(resultsFolderName,outputResultsFolderName)
        .forEach(subfolder => parseLogFiles(subfolder));

    const results = extractJson(resultsDir, resultsFileName);
    const compromises = extractJson(resultsDir, compromisesFileName);
    handleCombinedOutput(results, compromises, outputCombinedResultsCompromisesFile);
}

const main = () => {
    log('Starting main process...');

    ensureEmptyOutputDirPresent(outputDir);

    generateCombinedOutput();

    calculateArchitectureScore(outputCombinedResultsCompromisesFile,outputScoreFile);

    log('Main process completed.');
};

main();