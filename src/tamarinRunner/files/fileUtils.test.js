const { generateTheoryFileName, generateCompromiseName } = require('./fileUtils');

describe('generateCompromiseName', () => {
    test('with both lists not empty', () => {
        const result = generateCompromiseName(['entity1', 'entity2'], ['domain1', 'domain2']);
        expect(result).toBe('entity1_entity2-domain1_domain2');
    });

    test('with only entities list not empty', () => {
        const result = generateCompromiseName(['entity1', 'entity2'], []);
        expect(result).toBe('entity1_entity2');
    });

    test('with only domains list not empty', () => {
        const result = generateCompromiseName([], ['domain1', 'domain2']);
        expect(result).toBe('domain1_domain2');
    });

    test('with both lists empty', () => {
        const result = generateCompromiseName([], []);
        expect(result).toBe('Base');
    });
});

describe('generateTheoryFileName', () => {
    test('with compromiseName', () => {
        const result = generateTheoryFileName('compromise', 'file.txt');
        expect(result).toBe('compromise-file.txt');
    });

    test('without compromiseName', () => {
        const result = generateTheoryFileName('', 'file.txt');
        expect(result).toBe('file.txt');
    });
});