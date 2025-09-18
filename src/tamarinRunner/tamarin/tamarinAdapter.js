const fs = require("fs");

const {log} = require("../util/logger");

const generateCodeBlockForEntities = (entitiesList) => {
    return entitiesList
        .map(entity => `
rule EntityCompromised_${entity} [color=#E87D88]:
  [ !Some${entity}(\$${entity}) ]
  --[ CompromiseOfEntity(\$${entity}) ]->
  [ !Compromised(\$${entity}) ]

        `)
        .reduce((acc, curr) => acc + curr, '');
};

const generateCodeBlockForDomains = (domainsList) => {
    return domainsList
        .map(domain => `
rule DomainCompromised_${domain} [color=#E87D88]:
  [ ]
  --[ CompromiseOfDomain(${domain}()) ]->
  [ !CompromisedDomain(${domain}()) ]

        `)
        .reduce((acc, curr) => acc + curr, '');
};

const injectCompromisesIntoBaseTheory = (entitiesList, domainsList, compromisedTheoryFile, compromiseName, originalFileNameComplete, baseTheoryInsertionMarker) => {
    const ruleBlocks = generateRuleBlocks(entitiesList, domainsList);

    const baseTheoryContent = fs.readFileSync(originalFileNameComplete, 'utf8');

    if (!baseTheoryInsertionMarker.test(baseTheoryContent)) {
        throw new Error(`Base theory insertion marker not found in file: ${originalFileNameComplete}`);
    }

    const modifiedContent = baseTheoryContent.replace(baseTheoryInsertionMarker, ruleBlocks);
    fs.writeFileSync(compromisedTheoryFile, modifiedContent);
    log(`Generated compromised theory file: ${compromisedTheoryFile}`, compromiseName);
};

const generateRuleBlocks = (entitiesList, domainsList) =>
    [generateCodeBlockForEntities(entitiesList), generateCodeBlockForDomains(domainsList)].join(' ');

module.exports = {
    generateCodeBlockForEntities,
    generateCodeBlockForDomains,
    generateRuleBlocks,
    injectCompromisesIntoBaseTheory
};