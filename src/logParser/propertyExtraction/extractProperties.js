const {log} = require('../util/logger');
const {retrieveNeverResponsibleForCompromiseValues} = require('./logic/neverResponsible/neverResponsibleForCompromise');
const {retrieveSmallestSubsetValues} = require('./logic/smallestCompromise/smallestCompromisedSubset');
const {retrieveNecessaryButNotSufficientConditionValues} = require('./logic/necessaryButNotSufficient/necessaryButNotSufficientForCompromise');
const {retrieveSinglePointOfFailure} = require("./logic/singlePointOfFailure/singlePointOfFailure");

const sanityCheckDifferentPropertiesShouldBeDisjunct = (smallestSubsetValues, neverResponsibleForCompromiseValues, necessaryButNotSufficientConditionValues) => {

    const trueSmallestSubsetValues = new Map([...smallestSubsetValues].filter(([_, value]) => value.smallestCompromiseForCombination));
    const trueNeverResponsibleForCompromiseValues = new Map([...neverResponsibleForCompromiseValues].filter(([_, value]) => value.neverResponsibleForCompromise));
    const trueNecessaryButNotSufficientConditionValues = new Map([...necessaryButNotSufficientConditionValues].filter(([_, value]) => value.necessaryButNotSufficientCondition));


    const allIndices = new Set([
        ...trueSmallestSubsetValues.keys(),
        ...trueNeverResponsibleForCompromiseValues.keys(),
        ...trueNecessaryButNotSufficientConditionValues.keys(),
    ]);

    const amountOfEntriesInAllPropertyMapsCombined = trueSmallestSubsetValues.size + trueNeverResponsibleForCompromiseValues.size + trueNecessaryButNotSufficientConditionValues.size;
    const mapsAreNotDisjunct = allIndices.size !== amountOfEntriesInAllPropertyMapsCombined;
    if (mapsAreNotDisjunct) {
        throw new Error('There are overlapping indices in the maps.');
    }
    log('Sanity check passed: Different properties are disjunct.');
};

const extractProperties = (combinedData) => {
    const combinedFalsifiedTheories = combinedData.filter(theory => !theory.data.doAllLemmasHold);
    const combinedVerifiedTheories = combinedData.filter(theory => theory.data.doAllLemmasHold);

    const combinedValues = new Map();

    const smallestSubsetValues = retrieveSmallestSubsetValues(combinedFalsifiedTheories);
    const amountOfSmallestSubsetValuesFound = [...smallestSubsetValues.values()].filter(subset => subset.smallestCompromiseForCombination).length;
    log(`Found ${amountOfSmallestSubsetValuesFound} smallestSubsetValues`);

    const neverResponsibleForCompromiseValues = retrieveNeverResponsibleForCompromiseValues(combinedVerifiedTheories, combinedFalsifiedTheories);
    const amountOfNeverResponsibleForCompromiseFound = [...neverResponsibleForCompromiseValues.values()].filter(subset => subset.neverResponsibleForCompromise).length;
    log(`Found ${amountOfNeverResponsibleForCompromiseFound} neverResponsibleForCompromiseValues`);

    const necessaryButNotSufficientConditionValues = retrieveNecessaryButNotSufficientConditionValues(combinedVerifiedTheories, combinedFalsifiedTheories);
    const amountOfNecessaryButNotSufficientFound = [...necessaryButNotSufficientConditionValues.values()].filter(subset => subset.necessaryButNotSufficientCondition).length;
    log(`Found ${amountOfNecessaryButNotSufficientFound} necessaryButNotSufficientConditionValues`);

    const singlePointOfFailureValues = retrieveSinglePointOfFailure(combinedFalsifiedTheories);
    const amountOfSinglePointOfFailureValuesFound = [...singlePointOfFailureValues.values()].filter(subset => subset.singlePointOfFailure).length;
    log(`Found ${amountOfSinglePointOfFailureValuesFound} singlePointOfFailureValues`);

    //this by design excludes single points of failure
    sanityCheckDifferentPropertiesShouldBeDisjunct(smallestSubsetValues, neverResponsibleForCompromiseValues, necessaryButNotSufficientConditionValues);

    smallestSubsetValues.forEach((value, key) => {
        combinedValues.set(key, {...combinedValues.get(key), ...value});
    });
    neverResponsibleForCompromiseValues.forEach((value, key) => {
        combinedValues.set(key, {...combinedValues.get(key), ...value});
    });
    necessaryButNotSufficientConditionValues.forEach((value, key) => {
        combinedValues.set(key, {...combinedValues.get(key), ...value});
    });
    singlePointOfFailureValues.forEach((value, key) => {
        combinedValues.set(key, {...combinedValues.get(key), ...value});
    });

    return combinedValues;
};

const generateEnrichedCombinedData = (combinedData, properties) =>
    combinedData.map(theory => {
        const index = theory.data.index;

        const isSmallestCompromiseForCombination =
            properties.get(index)?.smallestCompromiseForCombination || false;
        const isNeverResponsibleForCompromise =
            properties.get(index)?.neverResponsibleForCompromise || false;
        const isNecessaryButNotSufficientCondition =
            properties.get(index)?.necessaryButNotSufficientCondition || false;
        const isSinglePointOfFailure =
            properties.get(index)?.singlePointOfFailure || false;

        return {
            ...theory,
            data: {
                ...theory.data,
                smallestCompromiseForCombination: isSmallestCompromiseForCombination,
                neverResponsibleForCompromise: isNeverResponsibleForCompromise,
                necessaryButNotSufficientCondition: isNecessaryButNotSufficientCondition,
                singlePointOfFailure: isSinglePointOfFailure
            }
        };
    });

const validateProperties = combinedData => {
    const properties = extractProperties(combinedData);
    return generateEnrichedCombinedData(combinedData, properties);
};

module.exports = {
    extractProperties,
    validateProperties,
    sanityCheckDifferentPropertiesShouldBeDisjunct,
    generateEnrichedCombinedData
};