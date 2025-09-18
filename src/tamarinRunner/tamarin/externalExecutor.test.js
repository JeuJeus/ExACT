const {exec, execSync} = require('child_process');
const fs = require('fs');
const path = require('path');
const {createPngFromDot, runTamarinProver} = require('./externalExecutor');
const log = require('../util/logger');

jest.mock('child_process');
jest.mock('fs');
jest.mock('path', () => ({
    resolve: jest.fn(),
}));
jest.mock('../util/logger', () => ({
    log: jest.fn(),
}));

describe('runTamarinProver', () => {
    const mockCompromisedTheoryFile = 'test.spthy';
    const mockEntitiesDir = 'testEntitiesDir';
    const mockCompromisedTheoryFileNamePrefix = 'testPrefix';
    const mockJsonOutputFile = `${mockEntitiesDir}/${mockCompromisedTheoryFileNamePrefix}.json`;
    const mockDotOutputFile = `${mockEntitiesDir}/${mockCompromisedTheoryFileNamePrefix}.dot`;
    const mockOutputLogFile = `${mockEntitiesDir}/${mockCompromisedTheoryFileNamePrefix}.log`;
    const mockCompromiseName = 'testCompromise';

    beforeEach(() => {
        jest.clearAllMocks();
        path.resolve.mockImplementation((...args) => args.join('/'));
    });

    it('should log success message when Tamarin prover executes successfully', () => {
        const mockOutput = 'Tamarin prover output';
        execSync.mockReturnValue(mockOutput);

        runTamarinProver(mockCompromisedTheoryFile, mockEntitiesDir, mockCompromisedTheoryFileNamePrefix, mockJsonOutputFile, mockDotOutputFile, mockCompromiseName);

        expect(execSync).toHaveBeenCalledWith(
            `tamarin-prover ${mockCompromisedTheoryFile} --prove --output-json=${mockJsonOutputFile} --output-dot=${mockDotOutputFile}`,
            {encoding: 'utf8', maxBuffer: 10485760}
        );
        expect(fs.writeFileSync).toHaveBeenCalledWith(mockOutputLogFile, mockOutput);
        expect(log.log).toHaveBeenCalledWith(`Tamarin prover executed successfully for: ${mockCompromisedTheoryFile}`, mockCompromiseName);
    });

    it('should log error message when Tamarin prover execution fails', () => {
        const mockError = new Error('test error');
        mockError.stdout = 'Error output';
        execSync.mockImplementation(() => { throw mockError; });

        runTamarinProver(mockCompromisedTheoryFile, mockEntitiesDir, mockCompromisedTheoryFileNamePrefix, mockJsonOutputFile, mockDotOutputFile, mockCompromiseName);

        expect(execSync).toHaveBeenCalledWith(
            `tamarin-prover ${mockCompromisedTheoryFile} --prove --output-json=${mockJsonOutputFile} --output-dot=${mockDotOutputFile}`,
            {encoding: 'utf8', maxBuffer: 10485760}
        );
        expect(fs.writeFileSync).toHaveBeenCalledWith(mockOutputLogFile, mockError.stdout);
        expect(log.log).toHaveBeenCalledWith(`Error executing Tamarin prover: ${mockError.message}`, mockCompromiseName);
    });
});

describe('createPngFromDot', () => {
    it('should log the correct message when the process closes', () => {
        const mockDotOutputFile = 'test.dot';
        const mockCompromiseName = 'testCompromise';
        const mockExec = {
            on: jest.fn((event, callback) => {
                if (event === 'close') {
                    callback(0);
                }
            }),
        };

        exec.mockReturnValue(mockExec);

        createPngFromDot(mockDotOutputFile, mockCompromiseName);

        expect(exec).toHaveBeenCalledWith(`dot -Tpng -O ${mockDotOutputFile}`);
        expect(mockExec.on).toHaveBeenCalledWith('close', expect.any(Function));
        expect(log.log).toHaveBeenCalledWith(
            `Png Generation for [${mockDotOutputFile}] finished with Exit-Code [0]`,
            mockCompromiseName
        );
    });

    it('should log an error message when the process closes with a non-zero exit code', () => {
        const mockDotOutputFile = 'test.dot';
        const mockCompromiseName = 'testCompromise';
        const mockExec = {
            on: jest.fn((event, callback) => {
                if (event === 'close') {
                    callback(1);
                }
            }),
        };

        exec.mockReturnValue(mockExec);

        createPngFromDot(mockDotOutputFile, mockCompromiseName);

        expect(exec).toHaveBeenCalledWith(`dot -Tpng -O ${mockDotOutputFile}`);
        expect(mockExec.on).toHaveBeenCalledWith('close', expect.any(Function));
        expect(log.log).toHaveBeenCalledWith(
            `Png Generation for [${mockDotOutputFile}] finished with Exit-Code [1]`,
            mockCompromiseName
        );
    });
});