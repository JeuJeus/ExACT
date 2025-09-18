const { isSmallestSubsetThatIsCompromised, isSmallestFalsifiedTheoryVariant, retrieveSmallestSubsetValues} = require('./smallestCompromisedSubset');

describe('isSmallestSubsetThatIsCompromised', () => {
    test('should return true when no subset is compromised', () => {
        const allSubsetsOfCompromised = [
            [1, 2],
            [2, 3]
        ];
        const combinedFalsifiedTheories = [
            { data: { compromised: [3, 4] } },
            { data: { compromised: [4, 5] } }
        ];

        const result = isSmallestSubsetThatIsCompromised(allSubsetsOfCompromised, combinedFalsifiedTheories);
        expect(result).toBe(true);
    });

    test('should return false when a subset is compromised', () => {
        const allSubsetsOfCompromised = [
            [1, 2],
            [2, 3]
        ];
        const combinedFalsifiedTheories = [
            { data: { compromised: [1, 2] } },
            { data: { compromised: [4, 5] } }
        ];

        const result = isSmallestSubsetThatIsCompromised(allSubsetsOfCompromised, combinedFalsifiedTheories);
        expect(result).toBe(false);
    });

    test('should return true when no subsets are provided', () => {
        const allSubsetsOfCompromised = [];
        const combinedFalsifiedTheories = [
            { data: { compromised: [1, 2] } },
            { data: { compromised: [4, 5] } }
        ];

        const result = isSmallestSubsetThatIsCompromised(allSubsetsOfCompromised, combinedFalsifiedTheories);
        expect(result).toBe(true);
    });

    test('should return true when no theories are provided', () => {
        const allSubsetsOfCompromised = [
            [1, 2],
            [2, 3]
        ];
        const combinedFalsifiedTheories = [];

        const result = isSmallestSubsetThatIsCompromised(allSubsetsOfCompromised, combinedFalsifiedTheories);
        expect(result).toBe(true);
    });
});

describe('isSmallestFalsifiedTheoryVariant', () => {
    test('should return true when no subset of falsified theory is compromised', () => {
        const falsifiedTheory = { data: { compromised: [1, 2] } };
        const combinedFalsifiedTheories = [
            { data: { compromised: [3, 4] } },
            { data: { compromised: [4, 5] } }
        ];

        const result = isSmallestFalsifiedTheoryVariant(falsifiedTheory, combinedFalsifiedTheories);
        expect(result).toBe(true);
    });

    test('should return true when no subsets of falsified theory are provided', () => {
        const falsifiedTheory = { data: { compromised: [] } };
        const combinedFalsifiedTheories = [
            { data: { compromised: [1, 2] } },
            { data: { compromised: [4, 5] } }
        ];

        const result = isSmallestFalsifiedTheoryVariant(falsifiedTheory, combinedFalsifiedTheories);
        expect(result).toBe(true);
    });

    test('should return true when no combined falsified theories are provided', () => {
        const falsifiedTheory = { data: { compromised: [1, 2] } };
        const combinedFalsifiedTheories = [];

        const result = isSmallestFalsifiedTheoryVariant(falsifiedTheory, combinedFalsifiedTheories);
        expect(result).toBe(true);
    });
});

describe('retrieveSmallestSubsetValues', () => {
    test('should return a map with correct smallest subset values', () => {
        const combinedFalsifiedTheories = [
            { data: { index: 1, compromised: [1, 2] } },
            { data: { index: 2, compromised: [3, 4] } }
        ];

        const result = retrieveSmallestSubsetValues(combinedFalsifiedTheories);

        expect(result.get(1)).toEqual({ smallestCompromiseForCombination: true });
        expect(result.get(2)).toEqual({ smallestCompromiseForCombination: true });
    });

    test('should return an empty map when no theories are provided', () => {
        const combinedFalsifiedTheories = [];

        const result = retrieveSmallestSubsetValues(combinedFalsifiedTheories);

        expect(result.size).toBe(0);
    });

    test('should handle theories with no compromised data', () => {
        const combinedFalsifiedTheories = [
            { data: { index: 1, compromised: [] } },
            { data: { index: 2, compromised: [3, 4] } }
        ];

        const result = retrieveSmallestSubsetValues(combinedFalsifiedTheories);

        expect(result.get(1)).toEqual({ smallestCompromiseForCombination: true });
        expect(result.get(2)).toEqual({ smallestCompromiseForCombination: true });
    });

    test('should handle theories with overlapping compromised data where the smaller set is determined to be the smallest', () => {
        const combinedFalsifiedTheories = [
            { data: { index: 1, compromised: [1, 2] } },
            { data: { index: 2, compromised: [1, 2, 3] } }
        ];

        const result = retrieveSmallestSubsetValues(combinedFalsifiedTheories);

        expect(result.get(1)).toEqual({ smallestCompromiseForCombination: true });
        expect(result.get(2)).toEqual({ smallestCompromiseForCombination: false });
    });
});