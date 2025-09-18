describe('differenceSetIsNotCompromised', () => {
    const { differenceSetIsNotCompromised } = require('./necessaryButNotSufficientForCompromise');

    test('returns true when a verified theory matches the difference set', () => {
        const combinedVerifiedTheories = [
            { data: { compromised: [1, 2, 3] } },
            { data: { compromised: [4, 5, 6] } }
        ];
        const differenceSet = new Set([1, 2, 3]);

        const result = differenceSetIsNotCompromised(combinedVerifiedTheories, differenceSet);

        expect(result).toBe(true);
    });

    test('returns false when no verified theory matches the difference set', () => {
        const combinedVerifiedTheories = [
            { data: { compromised: [1, 2, 3] } },
            { data: { compromised: [4, 5, 6] } }
        ];
        const differenceSet = new Set([7, 8, 9]);

        const result = differenceSetIsNotCompromised(combinedVerifiedTheories, differenceSet);

        expect(result).toBe(false);
    });

    test('returns false when combinedVerifiedTheories is empty', () => {
        const combinedVerifiedTheories = [];
        const differenceSet = new Set([1, 2, 3]);

        const result = differenceSetIsNotCompromised(combinedVerifiedTheories, differenceSet);

        expect(result).toBe(false);
    });

    test('returns true when difference set is empty and a verified theory is also empty', () => {
        const combinedVerifiedTheories = [
            { data: { compromised: [] } },
            { data: { compromised: [4, 5, 6] } }
        ];
        const differenceSet = new Set();

        const result = differenceSetIsNotCompromised(combinedVerifiedTheories, differenceSet);

        expect(result).toBe(true);
    });
});

describe('OnlyKeepTheSmallestVariants', () => {
    const { OnlyKeepTheSmallestVariants } = require('./necessaryButNotSufficientForCompromise');

    test('removes larger sets when a smaller subset exists', () => {
        const necessaryButNotSufficientConditionValues = new Map([
            [1, { compromised: [1, 2], necessaryButNotSufficientCondition: true }],
            [2, { compromised: [1, 2, 3], necessaryButNotSufficientCondition: true }]
        ]);

        OnlyKeepTheSmallestVariants(necessaryButNotSufficientConditionValues);

        expect(necessaryButNotSufficientConditionValues.size).toBe(1);
        expect(necessaryButNotSufficientConditionValues.has(1)).toBe(true);
        expect(necessaryButNotSufficientConditionValues.has(2)).toBe(false);
    });

    test('does not remove sets when no smaller subset exists', () => {
        const necessaryButNotSufficientConditionValues = new Map([
            [1, { compromised: [1, 2], necessaryButNotSufficientCondition: true }],
            [2, { compromised: [3, 4], necessaryButNotSufficientCondition: true }]
        ]);

        OnlyKeepTheSmallestVariants(necessaryButNotSufficientConditionValues);

        expect(necessaryButNotSufficientConditionValues.size).toBe(2);
        expect(necessaryButNotSufficientConditionValues.has(1)).toBe(true);
        expect(necessaryButNotSufficientConditionValues.has(2)).toBe(true);
    });

    test('removes compromised property from remaining sets', () => {
        const necessaryButNotSufficientConditionValues = new Map([
            [1, { compromised: [1, 2], necessaryButNotSufficientCondition: true }]
        ]);

        OnlyKeepTheSmallestVariants(necessaryButNotSufficientConditionValues);

        expect(necessaryButNotSufficientConditionValues.get(1).compromised).toBeUndefined();
    });

    test('handles empty map correctly', () => {
        const necessaryButNotSufficientConditionValues = new Map();

        OnlyKeepTheSmallestVariants(necessaryButNotSufficientConditionValues);

        expect(necessaryButNotSufficientConditionValues.size).toBe(0);
    });

    test('does not remove sets when necessaryButNotSufficientCondition is false', () => {
        const necessaryButNotSufficientConditionValues = new Map([
            [1, { compromised: [1, 2], necessaryButNotSufficientCondition: false }],
            [2, { compromised: [1, 2, 3], necessaryButNotSufficientCondition: false }]
        ]);

        OnlyKeepTheSmallestVariants(necessaryButNotSufficientConditionValues);

        expect(necessaryButNotSufficientConditionValues.size).toBe(2);
        expect(necessaryButNotSufficientConditionValues.has(1)).toBe(true);
        expect(necessaryButNotSufficientConditionValues.has(2)).toBe(true);
    });
});

describe('findSupersetCompromisedAndDifferenceNotCompromised', () => {
    const { findSupersetCompromisedAndDifferenceNotCompromised } = require('./necessaryButNotSufficientForCompromise');

    test('can handle multiple falsified theories correctly', () => {
        const combinedVerifiedTheories = [
            { data: { compromised: [4] } }
        ];
        const combinedFalsifiedTheories = [
            { data: { compromised: [1, 2, 4] } },
            { data: { compromised: [1, 2, 3] } }
        ];
        const verifiedTheory = { data: { compromised: [1, 2] } };

        const result = findSupersetCompromisedAndDifferenceNotCompromised(combinedVerifiedTheories, combinedFalsifiedTheories, verifiedTheory);

        expect(result).toBe(true);
    });

    test('returns true when a falsified theory is a superset and difference set is not compromised', () => {
        const combinedVerifiedTheories = [
            { data: { compromised: [4] } }
        ];
        const combinedFalsifiedTheories = [
            { data: { compromised: [1, 2, 4] } }
        ];
        const verifiedTheory = { data: { compromised: [1, 2] } };

        const result = findSupersetCompromisedAndDifferenceNotCompromised(combinedVerifiedTheories, combinedFalsifiedTheories, verifiedTheory);

        expect(result).toBe(true);
    });

    test('returns false when no falsified theory is a superset', () => {
        const combinedVerifiedTheories = [
            { data: { compromised: [1, 2] } }
        ];
        const combinedFalsifiedTheories = [
            { data: { compromised: [3, 4, 5] } }
        ];
        const verifiedTheory = { data: { compromised: [1, 2] } };

        const result = findSupersetCompromisedAndDifferenceNotCompromised(combinedVerifiedTheories, combinedFalsifiedTheories, verifiedTheory);

        expect(result).toBe(false);
    });

    test('returns false when difference set is empty', () => {
        const combinedVerifiedTheories = [
            { data: { compromised: [1, 2, 3] } }
        ];
        const combinedFalsifiedTheories = [
            { data: { compromised: [1, 2, 3] } }
        ];
        const verifiedTheory = { data: { compromised: [1, 2, 3] } };

        const result = findSupersetCompromisedAndDifferenceNotCompromised(combinedVerifiedTheories, combinedFalsifiedTheories, verifiedTheory);

        expect(result).toBe(false);
    });

    test('returns false when difference set is compromised too', () => {
        const combinedVerifiedTheories = [
            { data: { compromised: [1, 2, 3] } }
        ];
        const combinedFalsifiedTheories = [
            { data: { compromised: [1, 2, 3, 4] } },
            { data: { compromised: [4] } }
        ];
        const verifiedTheory = { data: { compromised: [1, 2, 3] } };

        const result = findSupersetCompromisedAndDifferenceNotCompromised(combinedVerifiedTheories, combinedFalsifiedTheories, verifiedTheory);

        expect(result).toBe(false);
    });
});