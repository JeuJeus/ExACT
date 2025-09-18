const path = require('path');
require('dotenv').config();

const entities = process.env.ENTITIES.split(',');
const domains = process.env.DOMAINS.split(',');

const baseTheoryInsertionMarker = new RegExp(process.env.BASE_THEORY_INSERTION_MARKER);

const compromisesFileName = process.env.COMPROMISES_FILE_NAME;

const originalFileNamePrefix = process.env.ORIGINAL_FILE_NAME_PREFIX;
const originalFileNameSuffix = '.spthy';
const originalFileNameComplete = originalFileNamePrefix + originalFileNameSuffix;

const outputDir = path.resolve(process.cwd(), process.env.RESULTS_FOLDER_NAME);

const {injectCompromisesIntoBaseTheory} = require('./tamarin/tamarinAdapter');
const {generateCompromiseName} = require('./files/fileUtils');
const {generateSubsets} = require('./util/setUtils');
const {ensureCleanOutputDir, writeCompromisesToFile, prepareOutputFiles} = require('./files/fileSystemUtils');
const {runTamarinAndRenderTrace} = require('./tamarin/externalExecutor');
const {log} = require('./util/logger');

const processEntities = (entitiesList, domainsList) => {
    const compromiseName = generateCompromiseName(entitiesList, domainsList);
    log(`Processing compromise scenario: ${compromiseName}`, compromiseName);

    const {entitiesDir, compromisedTheoryFileNamePrefix, compromisedTheoryFile} = prepareOutputFiles(compromiseName, outputDir, originalFileNamePrefix, originalFileNameSuffix);

    injectCompromisesIntoBaseTheory(entitiesList, domainsList,compromisedTheoryFile, compromiseName, originalFileNameComplete, baseTheoryInsertionMarker);

    runTamarinAndRenderTrace(entitiesDir, compromisedTheoryFileNamePrefix, compromisedTheoryFile, compromiseName);

    writeCompromisesToFile(compromiseName, entitiesList, domainsList,compromisesFileName,outputDir);
};

const generateAndValidateCompromiseScenarios = () => {
    ensureCleanOutputDir(outputDir);

    const allEntitySubsets = generateSubsets(entities);
    const allDomainsSubsets = generateSubsets(domains);

    allEntitySubsets.flatMap(
        entitySubset => allDomainsSubsets.map(
            domainSubset => processEntities(entitySubset, domainSubset)
        )
    );
};

generateAndValidateCompromiseScenarios();

module.exports = {
    log
}