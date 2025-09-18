const {log} = require("../../../util/logger");
const {readFileSync} = require("node:fs");
const {writeResultsToFile} = require("../../../files/fileUtils");
require('dotenv').config();

const senderReceiverEntities = process.env.SENDER_RECEIVER_ENTITIES.split(',');

const findSmallestCompromisedSubsets = (outputCombinedResultsCompromisesFile) => {
    const data = JSON.parse(readFileSync(outputCombinedResultsCompromisesFile, 'utf8'));

    return data
        .filter(item => item.data.smallestCompromiseForCombination)
        .sort((a, b) => a.data.compromised.length - b.data.compromised.length);
};

const createScoreInformation = smallestCompromisedSubsets => {
    const smallestCompromisedLength = Math.min(...smallestCompromisedSubsets.map(item => item.data.compromised.length));
    const filteredCompromiseSets = smallestCompromisedSubsets
        .filter(item => item.data.compromised.length === smallestCompromisedLength)
        .map(item => item.data.compromised);

    return {
        score: smallestCompromisedLength,
        compromiseSets: filteredCompromiseSets
    }
};

const generateRelevantScoreInformation = outputCombinedResultsCompromisesFile => {
    const smallestCompromisedSubsets = findSmallestCompromisedSubsets(outputCombinedResultsCompromisesFile);
    const scoreInformation = createScoreInformation(smallestCompromisedSubsets);

    const smallestSubsetsWithoutSenderReceiver = smallestCompromisedSubsets.filter(item => !senderReceiverEntities.some(entity => item.data.compromised.includes(entity)));
    const scoreInformationWithoutSenderReceiver = createScoreInformation(smallestSubsetsWithoutSenderReceiver);

    return {
        overall: scoreInformation,
        withoutSenderReceiver: scoreInformationWithoutSenderReceiver
    };
};

const calculateArchitectureScore = (outputCombinedResultsCompromisesFile, outputScoreFile) => {
    log('Calculating architecture score...');

    const scoreInformation = generateRelevantScoreInformation(outputCombinedResultsCompromisesFile);

    writeResultsToFile(scoreInformation, outputScoreFile);

    log('Architecture score calculated.');}

module.exports = {
    findSmallestCompromisedSubsets,
    createScoreInformation,
    generateRelevantScoreInformation,
    calculateArchitectureScore
};