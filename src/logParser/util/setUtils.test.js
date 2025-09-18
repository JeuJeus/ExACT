const {arraysEqual, getSubsets, setEquals} = require("./setUtils");

describe('setEquals', () => {
    test('should return true for equal sets', () => {
        const setA = new Set([1, 2, 3]);
        const setB = new Set([1, 2, 3]);
        expect(setEquals(setA, setB)).toBe(true);
    });

    test('should return false for sets with different sizes', () => {
        const setA = new Set([1, 2, 3]);
        const setB = new Set([1, 2]);
        expect(setEquals(setA, setB)).toBe(false);
    });

    test('should return false for sets with same sizes but different elements', () => {
        const setA = new Set([1, 2, 3]);
        const setB = new Set([1, 2, 4]);
        expect(setEquals(setA, setB)).toBe(false);
    });

    test('should return true for empty sets', () => {
        const setA = new Set();
        const setB = new Set();
        expect(setEquals(setA, setB)).toBe(true);
    });
});

describe('arraysEqual', () => {
    test('should return true for equal arrays', () => {
        const arr1 = [1, 2, 3];
        const arr2 = [1, 2, 3];
        expect(arraysEqual(arr1, arr2)).toBe(true);
    });

    test('should return false for arrays with different lengths', () => {
        const arr1 = [1, 2, 3];
        const arr2 = [1, 2];
        expect(arraysEqual(arr1, arr2)).toBe(false);
    });

    test('should return false for arrays with same lengths but different elements', () => {
        const arr1 = [1, 2, 3];
        const arr2 = [1, 2, 4];
        expect(arraysEqual(arr1, arr2)).toBe(false);
    });

    test('should return true for arrays with same elements in different order', () => {
        const arr1 = [3, 2, 1];
        const arr2 = [1, 2, 3];
        expect(arraysEqual(arr1, arr2)).toBe(true);
    });

    test('should return true for empty arrays', () => {
        const arr1 = [];
        const arr2 = [];
        expect(arraysEqual(arr1, arr2)).toBe(true);
    });
});

describe('getSubsets', () => {
    test('should return all subsets excluding empty and self', () => {
        const array = [1, 2, 3];
        const expectedSubsets = [
            [1], [2], [3],
            [1, 2], [1, 3], [2, 3]
        ];

        const result = getSubsets(array);

        expect(result).toEqual(expect.arrayContaining(expectedSubsets));
        expect(result.length).toBe(expectedSubsets.length);
    });

    test('should return empty array for empty input', () => {
        const array = [];
        const expectedSubsets = [];

        const result = getSubsets(array);

        expect(result).toEqual(expectedSubsets);
    });

    test('should return empty array for single element input', () => {
        const array = [1];
        const expectedSubsets = [];

        const result = getSubsets(array);

        expect(result).toEqual(expectedSubsets);
    });
});