const path = require("path");
const fs = require("fs");
const {generateTheoryFileName} = require("./fileUtils");
const {log} = require("../util/logger");

const writeCompromisesToFile = (compromiseName, entitiesList, domainsList,compromisesFileName,outputDir) => {
    const compromisesFilePath = path.resolve(outputDir, compromiseName, compromisesFileName);
    const compromises = {name: compromiseName, entities: entitiesList, domains: domainsList};
    fs.writeFileSync(compromisesFilePath, JSON.stringify(compromises, null, 2));
}

const createDirectoryForCompromiseScenario = (compromiseName,outputDir) => {
    const entitiesDir = path.resolve(outputDir, compromiseName);
    fs.mkdirSync(entitiesDir, {recursive: true});
    log(`Created directory: ${entitiesDir}`, compromiseName);
    return entitiesDir;
};

const ensureCleanOutputDir = (outputDir) => {
    const outputDirPath = path.resolve(outputDir);
    if (fs.existsSync(outputDirPath)) {
        fs.rmSync(outputDirPath, {recursive: true, force: true});
    }
    fs.mkdirSync(outputDirPath, {recursive: true});
};

const prepareOutputFiles = (compromiseName, outputDir, originalFileNamePrefix, originalFileNameSuffix) => {
    const entitiesDir = createDirectoryForCompromiseScenario(compromiseName, outputDir);
    const compromisedTheoryFileNamePrefix = generateTheoryFileName(compromiseName, originalFileNamePrefix);
    const compromisedTheoryFile = path.resolve(entitiesDir, compromisedTheoryFileNamePrefix + originalFileNameSuffix);

    return {entitiesDir, compromisedTheoryFileNamePrefix, compromisedTheoryFile};
};

module.exports = {
    ensureCleanOutputDir,
    createDirectoryForCompromiseScenario,
    writeCompromisesToFile,
    prepareOutputFiles
}
