const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require("path");
require('dotenv').config();

const resultsFolderName = process.env.RESULTS_FOLDER_NAME;
const resultsDir = path.resolve(process.cwd(), resultsFolderName);

const combinedResultsCompromisesFileName = process.env.OUTPUT_FILE_NAME;
const combinedScoreFileName = process.env.OUTPUT_SCORE_FILE_NAME;

const outputDir = path.resolve(resultsDir, process.env.OUTPUT_RESULTS_FOLDER_NAME);
const outputCombinedResultsCompromisesFile = path.join(outputDir, combinedResultsCompromisesFileName);
const outputCombinedScoreFile = path.join(outputDir, combinedScoreFileName);

const senderReceiverEntities = process.env.SENDER_RECEIVER_ENTITIES.split(',');
const entities = process.env.ENTITIES.split(',');

const sanityCheck = (senderReceiverEntities, entities) => {
    senderReceiverEntities.forEach(entity => {
        if (!entities.includes(entity)) {
            console.error(`Sanity check failed: ${entity} is not included in the entities list`);
            process.exit(1);
        }
    });
};
sanityCheck(senderReceiverEntities, entities);

const app = express();
const port = 3000;

app.use(cors());

/*
    Used for the visualization of results via web browser
    small script serving the relevant files
 */

app.use(express.static('src/webui'));
app.use(express.static(resultsDir));

const readResultsFromFile = (outputFile) => {
    if (!fs.existsSync(outputFile)) return null;
    return JSON.parse(fs.readFileSync(outputFile, 'utf8'));
};

app.get('/api/combined_results', (req, res) => {
    try {
        const data = readResultsFromFile(outputCombinedResultsCompromisesFile);

        if (!data) {
            res.status(404).send('Combined results not found');
            return;
        }

        res.json(data);
    } catch (err) {
        res.status(500).send('Unable to read combined results file');
    }
});

app.get('/api/score', (req, res) => {
    try {
        const data = readResultsFromFile(outputCombinedScoreFile);

        if (!data) {
            res.status(404).send('Combined score not found');
            return;
        }

        res.json(data);
    } catch (err) {
        res.status(500).send('Unable to read combined score file');
    }
});

app.get('/api/sender_receiver_entities', (req, res) => {
    res.json(senderReceiverEntities);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = { sanityCheck };