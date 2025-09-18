const {
    generateCodeBlockForEntities,
    generateCodeBlockForDomains,
    generateRuleBlocks,
    injectCompromisesIntoBaseTheory
} = require('./tamarinAdapter');
const {log} = require('../util/logger');

const fs = require('fs');

jest.mock('fs');
jest.mock('../util/logger', () => ({
    log: jest.fn(),
}));

const ignoreWhitespaceTabsAndIndentation = input => input.replace(/\s+/g, '');

describe('injectCompromisesIntoBaseTheory', () => {
    const entitiesList = ['Entity1'];
    const domainsList = [];
    const compromisedTheoryFile = 'compromisedTheoryFile.spthy';
    const compromiseName = 'compromiseName';
    const originalFileNameComplete = 'originalFileName.spthy';
    const baseTheoryInsertionMarker = /INSERT_MARKER/;
    const baseTheoryContent = 'Some content with INSERT_MARKER in it';

    beforeEach(() => {
        fs.readFileSync.mockClear();
        fs.writeFileSync.mockClear();
    });

    test('should inject rule blocks into base theory and write to file', () => {
        fs.readFileSync.mockReturnValue(baseTheoryContent);

        injectCompromisesIntoBaseTheory(entitiesList, domainsList, compromisedTheoryFile, compromiseName, originalFileNameComplete, baseTheoryInsertionMarker);

        expect(fs.readFileSync).toHaveBeenCalledWith(originalFileNameComplete, 'utf8');
        const contentWithRuleBlock = `Some content with
        rule EntityCompromised_Entity1 [color=#E87D88]:
          [ !SomeEntity1($Entity1) ]
          --[ CompromiseOfEntity($Entity1) ]->
          [ !Compromised($Entity1) ]
          in it`;

        const [filePath, content] = fs.writeFileSync.mock.calls[0];
        expect(filePath).toBe(compromisedTheoryFile);
        expect(ignoreWhitespaceTabsAndIndentation(content)).toEqual(ignoreWhitespaceTabsAndIndentation(contentWithRuleBlock));

        expect(log).toHaveBeenCalledWith(`Generated compromised theory file: ${compromisedTheoryFile}`, compromiseName);
    });

    test('should throw an error if insertion marker is not found', () => {
        fs.readFileSync.mockReturnValue('Content without marker');

        expect(() => {
            injectCompromisesIntoBaseTheory(entitiesList, domainsList, compromisedTheoryFile, compromiseName, originalFileNameComplete, baseTheoryInsertionMarker);
        }).toThrow(`Base theory insertion marker not found in file: ${originalFileNameComplete}`);
    });
});

describe('generateCodeBlockForEntities', () => {
    test('should generate correct code block for a list of entities', () => {
        const entitiesList = ['Entity1', 'Entity2'];
        const expectedCodeBlock = `
        rule EntityCompromised_Entity1 [color=#E87D88]:
          [ !SomeEntity1($Entity1) ]
          --[ CompromiseOfEntity($Entity1) ]->
          [ !Compromised($Entity1) ]

        
        rule EntityCompromised_Entity2 [color=#E87D88]:
          [ !SomeEntity2($Entity2) ]
          --[ CompromiseOfEntity($Entity2) ]->
          [ !Compromised($Entity2) ]

        `;
        const result = generateCodeBlockForEntities(entitiesList);
        expect(ignoreWhitespaceTabsAndIndentation(result)).toEqual(ignoreWhitespaceTabsAndIndentation(expectedCodeBlock));
    });

    test('should return an empty string for an empty list of entities', () => {
        const entitiesList = [];
        const expectedCodeBlock = '';
        const result = generateCodeBlockForEntities(entitiesList);
        expect(ignoreWhitespaceTabsAndIndentation(result)).toEqual(ignoreWhitespaceTabsAndIndentation(expectedCodeBlock));
    });
});

describe('generateCodeBlockForDomains', () => {
    test('should generate correct code block for a list of domains', () => {
        const domainsList = ['Domain1', 'Domain2'];
        const expectedCodeBlock = `
        rule DomainCompromised_Domain1 [color=#E87D88]:
          [ ]
          --[ CompromiseOfDomain(Domain1()) ]->
          [ !CompromisedDomain(Domain1()) ]


        rule DomainCompromised_Domain2 [color=#E87D88]:
          [ ]
          --[ CompromiseOfDomain(Domain2()) ]->
          [ !CompromisedDomain(Domain2()) ]

        `;
        const result = generateCodeBlockForDomains(domainsList);
        expect(ignoreWhitespaceTabsAndIndentation(result)).toEqual(ignoreWhitespaceTabsAndIndentation(expectedCodeBlock));
    });

    test('should return an empty string for an empty list of domains', () => {
        const domainsList = [];
        const expectedCodeBlock = '';
        const result = generateCodeBlockForDomains(domainsList);
        expect(ignoreWhitespaceTabsAndIndentation(result)).toEqual(ignoreWhitespaceTabsAndIndentation(expectedCodeBlock));
    });
});

describe('generateRuleBlocks', () => {
    test('should generate correct rule blocks for a list of entities and domains', () => {
        const entitiesList = ['Entity1', 'Entity2'];
        const domainsList = ['Domain1', 'Domain2'];
        const expectedRuleBlocks = `
        rule EntityCompromised_Entity1 [color=#E87D88]:
          [ !SomeEntity1($Entity1) ]
          --[ CompromiseOfEntity($Entity1) ]->
          [ !Compromised($Entity1) ]

        
        rule EntityCompromised_Entity2 [color=#E87D88]:
          [ !SomeEntity2($Entity2) ]
          --[ CompromiseOfEntity($Entity2) ]->
          [ !Compromised($Entity2) ]

        
        rule DomainCompromised_Domain1 [color=#E87D88]:
          [ ]
          --[ CompromiseOfDomain(Domain1()) ]->
          [ !CompromisedDomain(Domain1()) ]


        rule DomainCompromised_Domain2 [color=#E87D88]:
          [ ]
          --[ CompromiseOfDomain(Domain2()) ]->
          [ !CompromisedDomain(Domain2()) ]

        `;
        const result = generateRuleBlocks(entitiesList, domainsList);
        expect(ignoreWhitespaceTabsAndIndentation(result)).toEqual(ignoreWhitespaceTabsAndIndentation(expectedRuleBlocks));
    });

    test('should return an empty string for empty lists of entities and domains', () => {
        const entitiesList = [];
        const domainsList = [];
        const expectedRuleBlocks = '';
        const result = generateRuleBlocks(entitiesList, domainsList);
        expect(ignoreWhitespaceTabsAndIndentation(result)).toEqual(ignoreWhitespaceTabsAndIndentation(expectedRuleBlocks));
    });
});