const isSinglePointOfFailure = falsifiedTheory => falsifiedTheory.data.compromised.length === 1;

const retrieveSinglePointOfFailure = (combinedFalsifiedTheories) => {
    const singlePointOfFailureValues = new Map();

    combinedFalsifiedTheories.forEach(falsifiedTheory => {
        const data = falsifiedTheory.data;
        const index = data.index;

        const value = {
            singlePointOfFailure: isSinglePointOfFailure(falsifiedTheory)
        };

        singlePointOfFailureValues.set(index, value);
    });

    return singlePointOfFailureValues;
}


module.exports = {
    retrieveSinglePointOfFailure
};