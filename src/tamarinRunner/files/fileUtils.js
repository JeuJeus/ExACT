const generateCompromiseName = (entitiesList, domainsList) => {
    const entities = entitiesList.join('_');
    const domains = domainsList.join('_');

    const bothListsNotEmpty = entities.length && domains.length;
    const onlyEntitiesNotEmpty = entities.length && !domains.length;
    const onlyDomainsNotEmpty = !entities.length && domains.length;

    if (bothListsNotEmpty) {
        return `${entities}-${domains}`;
    } else if (onlyEntitiesNotEmpty) {
        return entities;
    } else if (onlyDomainsNotEmpty) {
        return domains;
    } else {
        return 'Base';
    }
}

const generateTheoryFileName = (compromiseName, originalFileName) =>
    compromiseName ? [compromiseName, originalFileName].join('-') : originalFileName;

module.exports = {
    generateTheoryFileName,
    generateCompromiseName
}