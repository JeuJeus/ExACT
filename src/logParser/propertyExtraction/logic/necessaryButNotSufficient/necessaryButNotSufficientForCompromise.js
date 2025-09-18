const {setEquals} = require("../../../util/setUtils");

const differenceSetIsNotCompromised = (combinedVerifiedTheories, differenceSet) =>
    combinedVerifiedTheories
        .map(verifiedTheory => new Set(verifiedTheory.data.compromised))
        .some(verifiedTheoryCompromised => setEquals(verifiedTheoryCompromised, differenceSet));

const investigateCorrelatingDifferenceSet = (potentialSuperset, subsetCandidate, combinedVerifiedTheories) => {
    const differenceSet = potentialSuperset.difference(subsetCandidate);
    if (differenceSet.size === 0) return false;
    return differenceSetIsNotCompromised(combinedVerifiedTheories, differenceSet);
};

const StopIfNotSupersetForSubset = (subsetCandidate, potentialSuperset) => !subsetCandidate.isSubsetOf(potentialSuperset);

const findSupersetCompromisedAndDifferenceNotCompromised = (combinedVerifiedTheories, combinedFalsifiedTheories, verifiedTheory) =>
    combinedFalsifiedTheories.some(falsifiedTheory => {
        const falsifiedTheoryCompromised = falsifiedTheory.data.compromised;
        const verifiedTheoryCompromised = verifiedTheory.data.compromised;
        const potentialSuperset = new Set(falsifiedTheoryCompromised);
        const subsetCandidate = new Set(verifiedTheoryCompromised);

        if (StopIfNotSupersetForSubset(subsetCandidate, potentialSuperset)) return false;

        return investigateCorrelatingDifferenceSet(potentialSuperset, subsetCandidate, combinedVerifiedTheories);
    });

const OnlyKeepTheSmallestVariants = necessaryButNotSufficientConditionValues => {
    necessaryButNotSufficientConditionValues.forEach((value, key) => {
        if (!value.necessaryButNotSufficientCondition) return;

        necessaryButNotSufficientConditionValues.forEach((toCheckAgainst, toCheckAgainstKey) => {
            if (!(toCheckAgainstKey !== key && toCheckAgainst.necessaryButNotSufficientCondition)) return;

            const compromisedSet = new Set(value.compromised);
            const toCheckAgainstCompromisedSet = new Set(toCheckAgainst.compromised);
            if (compromisedSet.isSubsetOf(toCheckAgainstCompromisedSet)) {
                necessaryButNotSufficientConditionValues.delete(toCheckAgainstKey);
            }
        });
    });
    necessaryButNotSufficientConditionValues.forEach((value) => {
        delete value.compromised;
    });
};

const retrieveNecessaryButNotSufficientConditionValues = (combinedVerifiedTheories, combinedFalsifiedTheories) => {
    const necessaryButNotSufficientConditionValues = new Map();

    combinedVerifiedTheories.forEach(verifiedTheory => {
        const index = verifiedTheory.data.index;
        const value = {
            compromised: verifiedTheory.data.compromised,
            necessaryButNotSufficientCondition: findSupersetCompromisedAndDifferenceNotCompromised(combinedVerifiedTheories, combinedFalsifiedTheories, verifiedTheory)
        };
        necessaryButNotSufficientConditionValues.set(index, value);
    });

    OnlyKeepTheSmallestVariants(necessaryButNotSufficientConditionValues);

    return necessaryButNotSufficientConditionValues;
};

module.exports = {
    retrieveNecessaryButNotSufficientConditionValues,
    differenceSetIsNotCompromised,
    findSupersetCompromisedAndDifferenceNotCompromised,
    OnlyKeepTheSmallestVariants
}