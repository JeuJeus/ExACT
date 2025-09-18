const {generateSubsets} = require('./setUtils');

describe('generateSubsets', () => {
    test('generates all subsets of a given array', () => {
        const input = [1, 2, 3];
        const expectedOutput = [
            [],
            [1],
            [2],
            [1, 2],
            [3],
            [1, 3],
            [2, 3],
            [1, 2, 3]
        ];
        const result = generateSubsets(input);
        expect(result).toEqual(expectedOutput);
    });

    test('generates subsets for an empty array', () => {
        const input = [];
        const expectedOutput = [
            []
        ];
        const result = generateSubsets(input);
        expect(result).toEqual(expectedOutput);
    });

    test('generates subsets for an array with negative numbers', () => {
        const input = [-1, -2];
        const expectedOutput = [
            [],
            [-1],
            [-2],
            [-1, -2]
        ];
        const result = generateSubsets(input);
        expect(result).toEqual(expectedOutput);
    });
});