const {sanityCheckDifferentPropertiesShouldBeDisjunct} = require("./extractProperties");

describe('sanityCheckDifferentPropertiesShouldBeDisjunct', () => {
    test('should pass when there are no overlapping indices', () => {
        const smallestSubsetValues = new Map([[1, { smallestCompromiseForCombination: true }], [2, { smallestCompromiseForCombination: true }]]);
        const neverResponsibleForCompromiseValues = new Map([[3, { neverResponsibleForCompromise: true }], [4, { neverResponsibleForCompromise: true }]]);
        const necessaryButNotSufficientConditionValues = new Map([[5, { necessaryButNotSufficientCondition: true }], [6, { necessaryButNotSufficientCondition: true }]]);

        expect(() => {
            sanityCheckDifferentPropertiesShouldBeDisjunct(smallestSubsetValues, neverResponsibleForCompromiseValues, necessaryButNotSufficientConditionValues);
        }).not.toThrow();
    });

    test('should throw an error when there are overlapping indices', () => {
        const smallestSubsetValues = new Map([[1, { smallestCompromiseForCombination: true }], [2, { smallestCompromiseForCombination: true }]]);
        const neverResponsibleForCompromiseValues = new Map([[2, { neverResponsibleForCompromise: true }], [3, { neverResponsibleForCompromise: true }]]);
        const necessaryButNotSufficientConditionValues = new Map([[4, { necessaryButNotSufficientCondition: true }], [5, { necessaryButNotSufficientCondition: true }]]);

        expect(() => {
            sanityCheckDifferentPropertiesShouldBeDisjunct(smallestSubsetValues, neverResponsibleForCompromiseValues, necessaryButNotSufficientConditionValues);
        }).toThrow('There are overlapping indices in the maps.');
    });

    test('should pass when all maps are empty', () => {
        const smallestSubsetValues = new Map();
        const neverResponsibleForCompromiseValues = new Map();
        const necessaryButNotSufficientConditionValues = new Map();

        expect(() => {
            sanityCheckDifferentPropertiesShouldBeDisjunct(smallestSubsetValues, neverResponsibleForCompromiseValues, necessaryButNotSufficientConditionValues);
        }).not.toThrow();
    });
});