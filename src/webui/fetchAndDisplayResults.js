const LOCAL_API_BASE_URL = 'http://localhost:3000/api';

function resetGraphOnEnter() {
    if (event.key === 'Enter') {
        filterResultsAndRender();
    }
}

const filterShowOnlyNodesWhere = (item, filterAllLemmasHold, filterNotAllLemmasHold, filterSmallestCompromiseForCombination, filterSinglePointOfFailure, filterNeverResponsibleForCompromise, filterNecessaryButNotSufficient) => {
    const allLemmasHoldFilter = filterAllLemmasHold && item.data.doAllLemmasHold;
    const notAllLemmasHoldFilter = filterNotAllLemmasHold && !item.data.doAllLemmasHold;
    const smallestSubsetForCompromiseFilter = filterSmallestCompromiseForCombination && item.data.smallestCompromiseForCombination;
    const singlePointOfFailureFilter = filterSinglePointOfFailure && item.data.singlePointOfFailure;
    const neverResponsibleForCompromiseFilter = filterNeverResponsibleForCompromise && item.data.neverResponsibleForCompromise;
    const NecessaryButNotSufficientFilter = filterNecessaryButNotSufficient && item.data.necessaryButNotSufficientCondition;

    if (!filterAllLemmasHold && !filterNotAllLemmasHold && !filterSmallestCompromiseForCombination&& !filterSinglePointOfFailure && !filterNeverResponsibleForCompromise && !filterNecessaryButNotSufficient) {
        return true;
    }

    return allLemmasHoldFilter || notAllLemmasHoldFilter || smallestSubsetForCompromiseFilter || singlePointOfFailureFilter || neverResponsibleForCompromiseFilter || NecessaryButNotSufficientFilter;
}

const filterShowOnlyNodesWith = (item, filterDomains, filterEntities) => {
    const hasDomainsOnly = item.data.domains.length > 0 && !item.data.entities.length;
    const hasEntitiesOnly = item.data.entities.length > 0 && !item.data.domains.length;

    const domainFilter = filterDomains ? hasDomainsOnly : true;
    const entityFilter = filterEntities ? hasEntitiesOnly : true;

    return domainFilter && entityFilter;
}

const filterResultsAndRender = () => {
    const minLabelLength = parseInt(document.getElementById('min-label-length').value);
    const maxLabelLength = parseInt(document.getElementById('max-label-length').value);

    const filterDomains = document.getElementById('filter-domains').checked;
    const filterEntities = document.getElementById('filter-entities').checked;

    const filterAllLemmasHold = document.getElementById('filter-all-lemmas-hold').checked;
    const filterNotAllLemmasHold = document.getElementById('filter-not-all-lemmas-hold').checked;
    const filterSmallestCompromiseForCombination = document.getElementById('filter-smallest-compromised-subset').checked;
    const filterSinglePointOfFailure = document.getElementById('filter-single-point-of-failure').checked;
    const filterNeverResponsibleForCompromise = document.getElementById('filter-never-compromise-responsible').checked;
    const filterNecessaryButNotSufficient = document.getElementById('filter-necessary-but-not-sufficient').checked;

    const checkedBoxesForHideSenderReceiverEntities = document.querySelectorAll('#sender-receiver-entities-wrapper .filter-entity:checked');
    const excludedEntities = Array.from(checkedBoxesForHideSenderReceiverEntities).map(checkbox => checkbox.value);

    const filteredResults = combined.filter(item => {
        const labelLength = item.data.entities.concat(item.data.domains).length;
        const withinLabelLength = labelLength >= minLabelLength && labelLength <= maxLabelLength;

        const showOnlyNodesWith = filterShowOnlyNodesWith(item, filterDomains, filterEntities);

        const showOnlyNodesWhere = filterShowOnlyNodesWhere(item, filterAllLemmasHold, filterNotAllLemmasHold, filterSmallestCompromiseForCombination, filterSinglePointOfFailure, filterNeverResponsibleForCompromise, filterNecessaryButNotSufficient);

        const excludeEntitiesFilter = !item.data.entities.some(entity => excludedEntities.includes(entity));

        return withinLabelLength && showOnlyNodesWith && showOnlyNodesWhere && excludeEntitiesFilter;
    });

    updateResults(filteredResults);
};

const updateResults = (updatedResults) => {
    rebuildGraphWithNewResults(updatedResults);
    filterRows(updatedResults);
}

const renderResults = (combinedResults) => {
    renderTable(combinedResults);
    setupGraph(combinedResults);
}

let combined;
let score;
let senderReceiverEntities = [];

const fetchResults = async () => {
    try {
        const response = await fetch(`${LOCAL_API_BASE_URL}/combined_results`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const fetchStartEndEntities = async () => {
    try {
        const response = await fetch(`${LOCAL_API_BASE_URL}/sender_receiver_entities`);
        senderReceiverEntities = await response.json();
        displaySenderReceiverEntities();
    } catch (error) {
        console.error('Error fetching start and end entities:', error);
    }
};

const fetchScore = async () => {
    try {
        const response = await fetch(`${LOCAL_API_BASE_URL}/score`);
        score = await response.json();
        displayScore();
    } catch (error) {
        console.error('Error fetching start and end entities:', error);
    }
};

const displaySenderReceiverEntities = () => {
    const entitiesWrapper = document.querySelector('#sender-receiver-entities-wrapper');
    senderReceiverEntities.forEach(entity => {
        const label = document.createElement('label');
        label.innerHTML = `<input type="checkbox" class="filter-entity" value="${entity}" onchange="filterResultsAndRender()"> ${entity}`;
        entitiesWrapper.appendChild(label);
    });
};

const displayScore = () => {
    document.querySelector('#overall-score-value').innerText = score.overall.score;

    const overallScoreList = document.querySelector('#overall-score-list');
    overallScoreList.innerHTML = '';
    score.overall.compromiseSets.forEach(set => {
        const listItem = document.createElement('li');
        listItem.textContent = set.join(', ');
        overallScoreList.appendChild(listItem);
    });

    document.querySelector('#sender-receiver-entities').innerText = senderReceiverEntities.join(', ');
    document.querySelector('#without-sender-receiver-score-value').innerText = score.withoutSenderReceiver.score;

    const withoutSenderReceiverScoreList = document.querySelector('#without-sender-receiver-score-list');
    withoutSenderReceiverScoreList.innerHTML = '';
    score.withoutSenderReceiver.compromiseSets.forEach(set => {
        const listItem = document.createElement('li');
        listItem.textContent = set.join(', ');
        withoutSenderReceiverScoreList.appendChild(listItem);
    });
}

const fetchAndDisplayResults = async () => {
    await fetchStartEndEntities();
    await fetchScore();
    combined = await fetchResults();
    if (!combined) return;
    renderResults(combined);
};

fetchAndDisplayResults();

document.addEventListener('DOMContentLoaded', () => {
    const filterDomainsCheckbox = document.getElementById('filter-domains');
    const filterEntitiesCheckbox = document.getElementById('filter-entities');

    filterDomainsCheckbox.addEventListener('change', () => {
        if (filterDomainsCheckbox.checked) {
            filterEntitiesCheckbox.checked = false;
        }
        filterResultsAndRender();
    });

    filterEntitiesCheckbox.addEventListener('change', () => {
        if (filterEntitiesCheckbox.checked) {
            filterDomainsCheckbox.checked = false;
        }
        filterResultsAndRender();
    });
});

window.addEventListener("resize", () => filterResultsAndRender());