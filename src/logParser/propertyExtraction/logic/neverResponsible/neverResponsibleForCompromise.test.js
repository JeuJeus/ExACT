const {retrieveNeverResponsibleForCompromiseValues, ensureDifferenceSetIsStillCompromised,
    isDifferenceSetStillCompromised
} = require("./neverResponsibleForCompromise");

describe('isDifferenceSetStillCompromised', () => {
    test('returns true when sets are equal', () => {
        const falsifiedTheory = { data: { compromised: [1, 2, 3] } };
        const differenceSet = new Set([1, 2, 3]);

        const result = isDifferenceSetStillCompromised(falsifiedTheory, differenceSet);

        expect(result).toBe(true);
    });

    test('returns false when sets are not equal', () => {
        const falsifiedTheory = { data: { compromised: [1, 2, 3] } };
        const differenceSet = new Set([4, 5, 6]);

        const result = isDifferenceSetStillCompromised(falsifiedTheory, differenceSet);

        expect(result).toBe(false);
    });

    test('returns false when falsified theory set is empty', () => {
        const falsifiedTheory = { data: { compromised: [] } };
        const differenceSet = new Set([1, 2, 3]);

        const result = isDifferenceSetStillCompromised(falsifiedTheory, differenceSet);

        expect(result).toBe(false);
    });

    test('returns false when difference set is empty', () => {
        const falsifiedTheory = { data: { compromised: [1, 2, 3] } };
        const differenceSet = new Set();

        const result = isDifferenceSetStillCompromised(falsifiedTheory, differenceSet);

        expect(result).toBe(false);
    });

    test('returns true when both sets are empty', () => {
        const falsifiedTheory = { data: { compromised: [] } };
        const differenceSet = new Set();

        const result = isDifferenceSetStillCompromised(falsifiedTheory, differenceSet);

        expect(result).toBe(true);
    });
});

describe('ensureDifferenceSetIsStillCompromised', () => {
    test('returns true when difference set is still compromised', () => {
        const combinedFalsifiedTheories = [
            { data: { compromised: [1, 2, 3] } },
            { data: { compromised: [2, 3, 4] } }
        ];
        const differenceSet = new Set([1, 2, 3]);

        const result = ensureDifferenceSetIsStillCompromised(combinedFalsifiedTheories, differenceSet);

        expect(result).toBe(true);
    });

    test('returns false when difference set is not compromised', () => {
        const combinedFalsifiedTheories = [
            { data: { compromised: [1, 2, 3] } },
            { data: { compromised: [2, 3, 4] } }
        ];
        const differenceSet = new Set([5, 6]);

        const result = ensureDifferenceSetIsStillCompromised(combinedFalsifiedTheories, differenceSet);

        expect(result).toBe(false);
    });

    test('returns false when combined falsified theories is empty', () => {
        const combinedFalsifiedTheories = [];
        const differenceSet = new Set([1, 2, 3]);

        const result = ensureDifferenceSetIsStillCompromised(combinedFalsifiedTheories, differenceSet);

        expect(result).toBe(false);
    });

    test('returns false when difference set is empty', () => {
        const combinedFalsifiedTheories = [
            { data: { compromised: [1, 2, 3] } }
        ];
        const differenceSet = new Set();

        const result = ensureDifferenceSetIsStillCompromised(combinedFalsifiedTheories, differenceSet);

        expect(result).toBe(false);
    });
});

describe('retrieveNeverResponsibleForCompromiseValues', () => {
    test('returns a map with correct values for multiple verified theories', () => {
        const combinedVerifiedTheories = [
            { data: { compromised: [1, 2], index: 0 } },
            { data: { compromised: [2, 3], index: 1 } }
        ];
        const combinedFalsifiedTheories = [
            { data: { compromised: [1, 2, 3] } },
            { data: { compromised: [2, 3, 4] } },
            { data: { compromised: [4] } },
            { data: { compromised: [3] } },
        ];

        const result = retrieveNeverResponsibleForCompromiseValues(combinedVerifiedTheories, combinedFalsifiedTheories);

        expect(result.size).toBe(2);
        expect(result.get(0)).toEqual({ neverResponsibleForCompromise: true });
        expect(result.get(1)).toEqual({ neverResponsibleForCompromise: false });
    });

    test('returns an empty map when no verified theories are provided', () => {
        const combinedVerifiedTheories = [];
        const combinedFalsifiedTheories = [
            { data: { compromised: [1, 2, 3] } },
            { data: { compromised: [2, 3, 4] } }
        ];

        const result = retrieveNeverResponsibleForCompromiseValues(combinedVerifiedTheories, combinedFalsifiedTheories);

        expect(result.size).toBe(0);
    });

    test('handles verified theories with no compromised data', () => {
        const combinedVerifiedTheories = [
            { data: { compromised: [], index: 0 } }
        ];
        const combinedFalsifiedTheories = [
            { data: { compromised: [1, 2, 3] } }
        ];

        const result = retrieveNeverResponsibleForCompromiseValues(combinedVerifiedTheories, combinedFalsifiedTheories);

        expect(result.size).toBe(1);
        expect(result.get(0)).toEqual({ neverResponsibleForCompromise: true });
    });

    test('handles falsified theories with no compromised data', () => {
        const combinedVerifiedTheories = [
            { data: { compromised: [1, 2], index: 0 } }
        ];
        const combinedFalsifiedTheories = [
            { data: { compromised: [] } }
        ];

        const result = retrieveNeverResponsibleForCompromiseValues(combinedVerifiedTheories, combinedFalsifiedTheories);

        expect(result.size).toBe(1);
        expect(result.get(0)).toEqual({ neverResponsibleForCompromise: true });
    });
});