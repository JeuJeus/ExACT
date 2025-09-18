const fs = require("fs");
const {log} = require("../util/logger");
const path = require("path");

const outputDirAlreadyPresent = (outputDir) => {
    return fs.existsSync(outputDir);
}
const createOutputDir = (outputDir) => {
    log(`Creating output directory: ${outputDir}`);
    fs.mkdirSync(outputDir);
}
const ensureEmptyOutputDirPresent = (outputDir) => {
    if (outputDirAlreadyPresent(outputDir)) {
        log(`Removing previous output directory: ${outputDir}`);
        fs.rmSync(outputDir, {recursive: true, force: true});
    }
    createOutputDir(outputDir);
}

const getSubfoldersSync = (folderPath,outputResultsFolderName) => {
    const folderToSearch = path.resolve(process.cwd(), folderPath);
    try {
        log(`Getting subfolders in: ${folderToSearch}`);
        return fs
            .readdirSync(folderToSearch, {withFileTypes: true})
            .filter(entry => !(entry.isDirectory() && entry.name.includes(outputResultsFolderName)))
            .filter(entry => entry.isDirectory())
            .map(entry => path.resolve(folderToSearch, entry.name));
    } catch (err) {
        console.error('Unable to scan directory:', err);
        return [];
    }
};

module.exports = {
    ensureEmptyOutputDirPresent,
    getSubfoldersSync
}