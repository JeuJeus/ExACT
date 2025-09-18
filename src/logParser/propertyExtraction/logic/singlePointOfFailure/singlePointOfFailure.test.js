const { retrieveSinglePointOfFailure } = require('./singlePointOfFailure');

describe('retrieveSinglePointOfFailure', () => {
    test('should return a map with single point of failure values', () => {
        const combinedFalsifiedTheories = [
            { data: { compromised: [1], index: 0 } },
            { data: { compromised: [1, 2], index: 1 } },
            { data: { compromised: [2], index: 2 } }
        ];

        const result = retrieveSinglePointOfFailure(combinedFalsifiedTheories);

        expect(result.get(0)).toEqual({ singlePointOfFailure: true });
        expect(result.get(1)).toEqual({ singlePointOfFailure: false });
        expect(result.get(2)).toEqual({ singlePointOfFailure: true });
    });
});