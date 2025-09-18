const {getSubsets, arraysEqual} = require("../../../util/setUtils");

const isSmallestSubsetThatIsCompromised = (allSubsetsOfCompromised, combinedFalsifiedTheories) => {
    return !allSubsetsOfCompromised
        .some(subset => combinedFalsifiedTheories
            .some(theory => arraysEqual(theory.data.compromised, subset)));
};

const isSmallestFalsifiedTheoryVariant = (falsifiedTheory, combinedFalsifiedTheories) => {
    const allSubsetsOfFalsifiedTheoryWithoutItself = getSubsets(falsifiedTheory.data.compromised);
    return isSmallestSubsetThatIsCompromised(allSubsetsOfFalsifiedTheoryWithoutItself, combinedFalsifiedTheories);
};

const retrieveSmallestSubsetValues = (combinedFalsifiedTheories) => {
    const smallestSubsetValues = new Map();

    combinedFalsifiedTheories.forEach(falsifiedTheory => {
        const index = falsifiedTheory.data.index;
        const value = {
            smallestCompromiseForCombination: isSmallestFalsifiedTheoryVariant(falsifiedTheory, combinedFalsifiedTheories)
        };
        smallestSubsetValues.set(index, value);
    });

    return smallestSubsetValues;
};

module.exports = {
    retrieveSmallestSubsetValues,
    isSmallestSubsetThatIsCompromised,
    isSmallestFalsifiedTheoryVariant
}