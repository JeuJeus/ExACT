const {exec, execSync} = require('child_process');
const path = require('path');
const fs = require('fs');
const {log} = require('../util/logger');

const createPngFromDot = (dotOutputFile, compromiseName) => {
    const dotCreation = exec(`dot -Tpng -O ${dotOutputFile}`);
    dotCreation.on('close', (code) =>
        log(`Png Generation for [${dotOutputFile}] finished with Exit-Code [${code}]`, compromiseName));
};

const runTamarinProver = (compromisedTheoryFile, entitiesDir, compromisedTheoryFileNamePrefix, jsonOutputFile, dotOutputFile, compromiseName) => {
    const outputLogFile = path.resolve(entitiesDir, compromisedTheoryFileNamePrefix + '.log');
    try {
        const output = execSync(`tamarin-prover ${compromisedTheoryFile} --prove --output-json=${jsonOutputFile} --output-dot=${dotOutputFile}`, {encoding: 'utf8', maxBuffer: 1024 * 1024 * 10});
        fs.writeFileSync(outputLogFile, output);
        log(`Tamarin prover executed successfully for: ${compromisedTheoryFile}`, compromiseName);
    } catch (error) {
        fs.writeFileSync(outputLogFile, error.stdout || error.message);
        log(`Error executing Tamarin prover: ${error.message}`, compromiseName);
    }
};

const runTamarinAndRenderTrace = (entitiesDir, compromisedTheoryFileNamePrefix, compromisedTheoryFile, compromiseName) => {
    const jsonOutputFile = path.resolve(entitiesDir, `${compromisedTheoryFileNamePrefix}.json`);
    const dotOutputFile = path.resolve(entitiesDir, `${compromisedTheoryFileNamePrefix}.dot`);

    runTamarinProver(compromisedTheoryFile, entitiesDir, compromisedTheoryFileNamePrefix, jsonOutputFile, dotOutputFile, compromiseName);
    createPngFromDot(dotOutputFile, compromiseName);

    log(`Finished compromised theory file: ${compromisedTheoryFile}`, compromiseName);
};

module.exports = {
    runTamarinAndRenderTrace,
    createPngFromDot,
    runTamarinProver
}