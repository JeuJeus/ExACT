const {setEquals} = require("../../../util/setUtils");

const isDifferenceSetStillCompromised = (falsifiedTheory, differenceSet) => {
    const someFalsifiedTheory = new Set(falsifiedTheory.data.compromised);
    return setEquals(someFalsifiedTheory, differenceSet);
};

const generateDifferenceSet = (theoryToCheckAgainst, theoryToCheckFor) => theoryToCheckAgainst.difference(theoryToCheckFor);

const ensureDifferenceSetIsStillCompromised = (combinedFalsifiedTheories, differenceSet) =>
    combinedFalsifiedTheories
        .some(falsifiedTheory => isDifferenceSetStillCompromised(falsifiedTheory, differenceSet));

const isNeverResponsibleForCompromise = (combinedFalsifiedTheories, verifiedTheory) => {
    const theoryToCheckFor = new Set(verifiedTheory.data.compromised);

    return combinedFalsifiedTheories
        .map(falsifiedTheory => ({
            ...falsifiedTheory,
            theoryToCheckAgainst: new Set(falsifiedTheory.data.compromised)
        }))
        .filter(falsifiedTheory => theoryToCheckFor.isSubsetOf(falsifiedTheory.theoryToCheckAgainst))
        .every(falsifiedTheory => {
            const differenceSet = generateDifferenceSet(falsifiedTheory.theoryToCheckAgainst, theoryToCheckFor);

            return ensureDifferenceSetIsStillCompromised(combinedFalsifiedTheories, differenceSet);
        });
}

const retrieveNeverResponsibleForCompromiseValues = (combinedVerifiedTheories,combinedFalsifiedTheories) => {
    const neverResponsibleForCompromiseValues = new Map();

    combinedVerifiedTheories.forEach(verifiedTheory => {
        const data = verifiedTheory.data;
        const index = data.index;

        const value = {
            neverResponsibleForCompromise: isNeverResponsibleForCompromise(combinedFalsifiedTheories, verifiedTheory)
        };

        neverResponsibleForCompromiseValues.set(index, value);
    });

    return neverResponsibleForCompromiseValues;
}


module.exports = {
    retrieveNeverResponsibleForCompromiseValues,
    isNeverResponsibleForCompromise,
    generateDifferenceSet,
    isDifferenceSetStillCompromised,
    ensureDifferenceSetIsStillCompromised
};