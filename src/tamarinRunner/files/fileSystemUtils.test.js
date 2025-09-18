const fs = require('fs');
const path = require('path');
const { ensureCleanOutputDir, createDirectoryForCompromiseScenario, prepareOutputFiles, writeCompromisesToFile } = require('./fileSystemUtils');
const { generateTheoryFileName } = require('./fileUtils');

jest.mock('fs');
jest.mock('path');
jest.mock('./fileUtils');

describe('prepareOutputFiles', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should prepare output files correctly', () => {
        const compromiseName = 'testCompromise';
        const outputDir = 'testOutputDir';
        const originalFileNamePrefix = 'originalFile';
        const originalFileNameSuffix = '.spthy';
        const entitiesDir = 'resolvedTestOutputDir/testCompromise';
        const compromisedTheoryFileNamePrefix = 'generatedTheoryFileName';
        const compromisedTheoryFile = 'resolvedTestOutputDir/testCompromise/generatedTheoryFileName.spthy';

        path.resolve.mockReturnValueOnce(entitiesDir).mockReturnValueOnce(compromisedTheoryFile);
        generateTheoryFileName.mockReturnValue(compromisedTheoryFileNamePrefix);

        const result = prepareOutputFiles(compromiseName, outputDir, originalFileNamePrefix, originalFileNameSuffix);

        expect(fs.mkdirSync).toHaveBeenCalledWith(entitiesDir, { recursive: true });
        expect(generateTheoryFileName).toHaveBeenCalledWith(compromiseName, originalFileNamePrefix);
        expect(path.resolve).toHaveBeenCalledWith(outputDir, compromiseName);
        expect(path.resolve).toHaveBeenCalledWith(entitiesDir, compromisedTheoryFileNamePrefix + originalFileNameSuffix);
        expect(result).toEqual({ entitiesDir, compromisedTheoryFileNamePrefix, compromisedTheoryFile });
    });
});

describe('writeCompromisesToFile', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should write the compromises to a file', () => {
        const compromiseName = 'testCompromise';
        const entitiesList = ['entity1', 'entity2'];
        const domainsList = ['domain1', 'domain2'];
        const compromisesFileName = 'compromises.json';
        const outputDir = 'testOutputDir';
        const resolvedPath = 'resolvedTestOutputDir/testCompromise/compromises.json';
        const expectedCompromises = {
            name: compromiseName,
            entities: entitiesList,
            domains: domainsList
        };

        path.resolve.mockReturnValue(resolvedPath);

        writeCompromisesToFile(compromiseName, entitiesList, domainsList, compromisesFileName, outputDir);

        expect(path.resolve).toHaveBeenCalledWith(outputDir, compromiseName, compromisesFileName);
        expect(fs.writeFileSync).toHaveBeenCalledWith(resolvedPath, JSON.stringify(expectedCompromises, null, 2));
    });
});

describe('createDirectoryForCompromiseScenario', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should create a directory for the given compromise scenario', () => {
        const compromiseName = 'testCompromise';
        const outputDir = 'testOutputDir';
        const resolvedPath = 'resolvedTestOutputDir/testCompromise';

        path.resolve.mockReturnValue(resolvedPath);

        const result = createDirectoryForCompromiseScenario(compromiseName, outputDir);

        expect(path.resolve).toHaveBeenCalledWith(outputDir, compromiseName);
        expect(fs.mkdirSync).toHaveBeenCalledWith(resolvedPath, { recursive: true });
        expect(result).toBe(resolvedPath);
    });
});

describe('ensureCleanOutputDir', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should remove existing directory and create a new one', () => {
        const outputDir = 'testDir';
        const resolvedPath = 'resolvedTestDir';

        path.resolve.mockReturnValue(resolvedPath);
        fs.existsSync.mockReturnValue(true);

        ensureCleanOutputDir(outputDir);

        expect(path.resolve).toHaveBeenCalledWith(outputDir);
        expect(fs.existsSync).toHaveBeenCalledWith(resolvedPath);
        expect(fs.rmSync).toHaveBeenCalledWith(resolvedPath, { recursive: true, force: true });
        expect(fs.mkdirSync).toHaveBeenCalledWith(resolvedPath, { recursive: true });
    });

    test('should create a new directory if it does not exist', () => {
        const outputDir = 'testDir';
        const resolvedPath = 'resolvedTestDir';

        path.resolve.mockReturnValue(resolvedPath);
        fs.existsSync.mockReturnValue(false);

        ensureCleanOutputDir(outputDir);

        expect(path.resolve).toHaveBeenCalledWith(outputDir);
        expect(fs.existsSync).toHaveBeenCalledWith(resolvedPath);
        expect(fs.rmSync).not.toHaveBeenCalled();
        expect(fs.mkdirSync).toHaveBeenCalledWith(resolvedPath, { recursive: true });
    });
});