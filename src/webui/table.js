const buildImageSrc = (itemName, trace) => {
    return `${itemName}/${trace}`;
}

const generateAndAddImg = (itemName, trace, imageWrapper) => {
    const img = document.createElement('img');
    img.dataset.src = buildImageSrc(itemName, trace);

    img.addEventListener('mouseover', enlargeImage);
    img.addEventListener('mouseout', shrinkImage);

    const link = document.createElement('a');
    link.href = img.dataset.src;
    link.target = '_blank';
    link.appendChild(img);

    imageWrapper.appendChild(link);

    observer.observe(img);
};

const loadImage = (img) => {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            loadImage(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
});

const createNameCell = (itemName) => {
    const nameCell = document.createElement('td');
    nameCell.textContent = itemName;
    nameCell.classList.add('wrap-column');
    return nameCell;
}

const createCompromisedEntitiesList = (item) => {
    const entitiesCell = document.createElement('td');
    const entitiesList = document.createElement('ul');

    item.entities.forEach(entity => {
        const listItem = document.createElement('li');
        listItem.textContent = entity;
        entitiesList.appendChild(listItem);
    });
    entitiesCell.appendChild(entitiesList);
    return entitiesCell;
}

const createCompromisedDomainsList = (item) => {
    const domainsCell = document.createElement('td');
    const domainsList = document.createElement('ul');

    item.domains.forEach(domain => {
        const listItem = document.createElement('li');
        listItem.textContent = domain;
        domainsList.appendChild(listItem);
    });

    domainsCell.appendChild(domainsList);
    return domainsCell;
}

const createInfoAboutAllLemmasHold = (item) => {
    const doAllLemmasHoldCell = document.createElement('td');
    doAllLemmasHoldCell.textContent = item.doAllLemmasHold;
    doAllLemmasHoldCell.classList.add(item.doAllLemmasHold ? 'true-cell' : 'false-cell');
    return doAllLemmasHoldCell;
}

const createNeverResponsibleForCompromiseCell = (item) => {
    const smallestCompromiseCell = document.createElement('td');
    smallestCompromiseCell.textContent = item.neverResponsibleForCompromise || false;
    if(item.neverResponsibleForCompromise){
        smallestCompromiseCell.classList.add('never-responsible-for-compromise-cell');
    }
    return smallestCompromiseCell;
}

const createSmallestCompromiseForCombinationCell = (item) => {
    const smallestCompromiseCell = document.createElement('td');
    smallestCompromiseCell.textContent = item.smallestCompromiseForCombination || false;
    if(item.smallestCompromiseForCombination){
        smallestCompromiseCell.classList.add('smallest-compromised-subset-cell');
    }
    return smallestCompromiseCell;
}

const createSinglePointOfFailureCell = (item) => {
    const smallestCompromiseCell = document.createElement('td');
    smallestCompromiseCell.textContent = item.singlePointOfFailure || false;
    if(item.singlePointOfFailure){
        smallestCompromiseCell.classList.add('single-point-of-failure-subset-cell');
    }
    return smallestCompromiseCell;
}

const createNecessaryButNotSufficientConditionCell = (item) => {
    const cell = document.createElement('td');
    cell.textContent = item.necessaryButNotSufficientCondition || false;
    if (item.necessaryButNotSufficientCondition) {
        cell.classList.add('necessary-but-not-sufficient-condition-cell');
    }
    return cell;
}

const createInfoAboutWellformed = (item) => {
    const wellformedCell = document.createElement('td');
    wellformedCell.textContent = item.wellformed;
    wellformedCell.classList.add(item.wellformed ? 'true-cell' : 'false-cell');
    return wellformedCell;
}

const createInfoAboutNumberOfVerifiedLemmas = (item) => {
    const numberOfVerifiedLemmasCell = document.createElement('td');
    numberOfVerifiedLemmasCell.textContent = item.numberOfVerifiedLemmas;
    return numberOfVerifiedLemmasCell;
}

const createVerifiedLemmasList = (item) => {
    const verifiedLemmasCell = document.createElement('td');
    const verifiedLemmasList = document.createElement('ul');

    item.verifiedLemmas.forEach(lemma => {
        const listItem = document.createElement('li');
        listItem.textContent = lemma;
        verifiedLemmasList.appendChild(listItem);
    });

    verifiedLemmasCell.appendChild(verifiedLemmasList);
    return verifiedLemmasCell;
}

const createNumberOfFalsifiedLemmas = (item) => {
    const numberOfFalsifiedLemmasCell = document.createElement('td');
    numberOfFalsifiedLemmasCell.textContent = item.numberOfFalsifiedLemmas;
    return numberOfFalsifiedLemmasCell;
}

const createFalsifiedLemmasList = (item) => {
    const falsifiedLemmasCell = document.createElement('td');
    const falsifiedLemmasList = document.createElement('ul');

    item.falsifiedLemmas.forEach(lemma => {
        const listItem = document.createElement('li');
        listItem.textContent = lemma;
        falsifiedLemmasList.appendChild(listItem);
    });

    falsifiedLemmasCell.appendChild(falsifiedLemmasList);
    return falsifiedLemmasCell;
}

const generateTracesVisualization = (item, itemName) => {
    const tracesVisualizationCell = document.createElement('td');
    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('image-wrapper');

    item.tracesVisualization.forEach(trace => {
        generateAndAddImg(itemName, trace, imageWrapper)
    });

    tracesVisualizationCell.appendChild(imageWrapper);
    return tracesVisualizationCell;
}

const generateTableRow = (item) => {
    const row = document.createElement('tr');

    const itemName = item.name;
    const nameCell = createNameCell(itemName);
    row.appendChild(nameCell);

    const entitiesCell = createCompromisedEntitiesList(item);
    row.appendChild(entitiesCell);

    const domainsCell = createCompromisedDomainsList(item);
    row.appendChild(domainsCell);

    const doAllLemmasHoldCell = createInfoAboutAllLemmasHold(item);
    row.appendChild(doAllLemmasHoldCell);

    const neverResponsibleForCompromiseCell = createNeverResponsibleForCompromiseCell(item);
    row.appendChild(neverResponsibleForCompromiseCell)

    const smallestCompromiseCell = createSmallestCompromiseForCombinationCell(item);
    row.appendChild(smallestCompromiseCell);

    const singlePointOfFailureCell = createSinglePointOfFailureCell(item);
    row.appendChild(singlePointOfFailureCell);

    const necessaryButNotSufficientConditionCell = createNecessaryButNotSufficientConditionCell(item);
    row.appendChild(necessaryButNotSufficientConditionCell);

    const wellformedCell = createInfoAboutWellformed(item);
    row.appendChild(wellformedCell);

    const numberOfVerifiedLemmasCell = createInfoAboutNumberOfVerifiedLemmas(item);
    row.appendChild(numberOfVerifiedLemmasCell);

    const verifiedLemmasCell = createVerifiedLemmasList(item);
    row.appendChild(verifiedLemmasCell);

    const numberOfFalsifiedLemmasCell = createNumberOfFalsifiedLemmas(item);
    row.appendChild(numberOfFalsifiedLemmasCell);

    const falsifiedLemmasCell = createFalsifiedLemmasList(item);
    row.appendChild(falsifiedLemmasCell);

    const tracesVisualizationCell = generateTracesVisualization(item, itemName);
    row.appendChild(tracesVisualizationCell);

    return row;
}

const clearTable = (tableBody) => tableBody.innerHTML = '';

const renderTable = (results) => {
    const tableBody = document.getElementById('data-table').querySelector('tbody');
    clearTable(tableBody);

    results.map(result => result.data).forEach(item => {
        const row = generateTableRow(item);
        tableBody.appendChild(row);
    });
};

const enlargeImage = (event) => {
    const img = event.target;
    const enlargedImg = document.createElement('img');
    enlargedImg.src = img.src;
    enlargedImg.classList.add('enlarged-image');
    enlargedImg.id = 'enlarged-image';
    document.body.appendChild(enlargedImg);
};

const shrinkImage = () => {
    const enlargedImg = document.getElementById('enlarged-image');
    if (enlargedImg) enlargedImg.remove();
};


const filterRows = (filteredResults) => {
    const tableBody = document.getElementById('data-table').querySelector('tbody');

    clearTable(tableBody);

    filteredResults.forEach(item => {
        const row = generateTableRow(item.data);
        tableBody.appendChild(row);
    });
};
