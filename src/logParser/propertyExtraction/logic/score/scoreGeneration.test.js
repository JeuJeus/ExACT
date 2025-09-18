const { readFileSync } = require('node:fs');
const { findSmallestCompromisedSubsets, createScoreInformation, generateRelevantScoreInformation} = require('./scoreGeneration');

jest.mock('node:fs');

describe('findSmallestCompromisedSubsets', () => {
    it('should return the smallest compromised subsets sorted by length', () => {
        const mockData = JSON.stringify([
            { data: { smallestCompromiseForCombination: true, compromised: ['a', 'b'] } },
            { data: { smallestCompromiseForCombination: true, compromised: ['a'] } },
            { data: { smallestCompromiseForCombination: false, compromised: ['a', 'b', 'c'] } },
            { data: { smallestCompromiseForCombination: true, compromised: ['a', 'b', 'c', 'd'] } }
        ]);

        readFileSync.mockReturnValue(mockData);

        const result = findSmallestCompromisedSubsets('mockFilePath');
        expect(result).toEqual([
            { data: { smallestCompromiseForCombination: true, compromised: ['a'] } },
            { data: { smallestCompromiseForCombination: true, compromised: ['a', 'b'] } },
            { data: { smallestCompromiseForCombination: true, compromised: ['a', 'b', 'c', 'd'] } }
        ]);
    });
});

describe('createScoreInformation', () => {
    it('should return the correct score and compromise sets for smallest compromised subsets', () => {
        const smallestCompromisedSubsets = [
            { data: { compromised: ['a', 'b'] } },
            { data: { compromised: ['a'] } },
            { data: { compromised: ['a', 'b', 'c'] } }
        ];

        const result = createScoreInformation(smallestCompromisedSubsets);
        expect(result).toEqual({
            score: 1,
            compromiseSets: [['a']]
        });
    });

    it('should handle an empty array of smallest compromised subsets', () => {
        const smallestCompromisedSubsets = [];

        const result = createScoreInformation(smallestCompromisedSubsets);
        expect(result).toEqual({
            score: Infinity,
            compromiseSets: []
        });
    });

    it('should handle multiple subsets with the same smallest length', () => {
        const smallestCompromisedSubsets = [
            { data: { compromised: ['a'] } },
            { data: { compromised: ['b'] } },
            { data: { compromised: ['c', 'd'] } }
        ];

        const result = createScoreInformation(smallestCompromisedSubsets);
        expect(result).toEqual({
            score: 1,
            compromiseSets: [['a'], ['b']]
        });
    });
});

describe('generateRelevantScoreInformation', () => {

    beforeEach(() => {
        jest.resetModules();
        process.env.SENDER_RECEIVER_ENTITIES = 'sender,receiver';
    });

    it('should return correct score information for overall and without sender/receiver entities', () => {
        jest.isolateModules(() => {
            const { readFileSync } = require('node:fs');
            const { generateRelevantScoreInformation } = require('./scoreGeneration');

            const mockData = JSON.stringify([
                { data: { smallestCompromiseForCombination: true, compromised: ['a', 'b'] } },
                { data: { smallestCompromiseForCombination: true, compromised: ['a'] } },
                { data: { smallestCompromiseForCombination: false, compromised: ['a', 'b', 'c'] } },
                { data: { smallestCompromiseForCombination: true, compromised: ['a', 'b', 'c', 'd'] } }
            ]);

            readFileSync.mockReturnValue(mockData);

            const result = generateRelevantScoreInformation('mockFilePath');
            expect(result).toEqual({
                overall: {
                    score: 1,
                    compromiseSets: [['a']]
                },
                withoutSenderReceiver: {
                    score: 1,
                    compromiseSets: [['a']]
                }
            });
        });
    });

    it('should handle an empty array of smallest compromised subsets', () => {
        jest.isolateModules(() => {
            const { readFileSync } = require('node:fs');
            const { generateRelevantScoreInformation } = require('./scoreGeneration');

            const mockData = JSON.stringify([]);

            readFileSync.mockReturnValue(mockData);

            const result = generateRelevantScoreInformation('mockFilePath');
            expect(result).toEqual({
                overall: {
                    score: Infinity,
                    compromiseSets: []
                },
                withoutSenderReceiver: {
                    score: Infinity,
                    compromiseSets: []
                }
            });
        });
    });

    it('should handle subsets with sender/receiver entities', () => {
        jest.isolateModules(() => {
            const { readFileSync } = require('node:fs');
            const { generateRelevantScoreInformation } = require('./scoreGeneration');

            const mockData = JSON.stringify([
                { data: { smallestCompromiseForCombination: true, compromised: ['a', 'b'] } },
                { data: { smallestCompromiseForCombination: true, compromised: ['sender'] } },
                { data: { smallestCompromiseForCombination: true, compromised: ['receiver'] } }
            ]);

            readFileSync.mockReturnValue(mockData);

            const result = generateRelevantScoreInformation('mockFilePath');
            expect(result).toEqual({
                overall: {
                    score: 1,
                    compromiseSets: [['sender'], ['receiver']]
                },
                withoutSenderReceiver: {
                    score: 2,
                    compromiseSets: [['a', 'b']]
                }
            });
        });
    });

    it('should handle multiple subsets with the same smallest length', () => {
        jest.isolateModules(() => {
            const { readFileSync } = require('node:fs');
            const { generateRelevantScoreInformation } = require('./scoreGeneration');

            const mockData = JSON.stringify([
                { data: { smallestCompromiseForCombination: true, compromised: ['a'] } },
                { data: { smallestCompromiseForCombination: true, compromised: ['b'] } },
                { data: { smallestCompromiseForCombination: true, compromised: ['c', 'd'] } }
            ]);

            readFileSync.mockReturnValue(mockData);

            const result = generateRelevantScoreInformation('mockFilePath');
            expect(result).toEqual({
                overall: {
                    score: 1,
                    compromiseSets: [['a'], ['b']]
                },
                withoutSenderReceiver: {
                    score: 1,
                    compromiseSets: [['a'], ['b']]
                }
            });
        });
    });
});