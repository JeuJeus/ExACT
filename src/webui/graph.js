const sharedEntitiesOrDomainsBetweenNodes = (sharedEntities, sharedDomains) => sharedEntities.length > 0 || sharedDomains.length > 0;

const getSharedEntities = (nodes, i, j) => nodes[i].subset.filter(x => nodes[j].subset.includes(x));

const getSharedDomains = (nodes, i, j) => nodes[i].subset.filter(x => nodes[j].subset.includes(x));

const noVerifiedLemmaInvolvedColor = () => "#cacaca"
const atLeastOneTheorySuccessfullyVerifiedColor = () => "#5bb359"
const smallestCompromiseForCombinationColor = () => "#800080";
const singlePointOfFailureColor = () => "#EE82EE";
const neverResponsibleForCompromiseColor = () => "#badcf7";
const necessaryButNotSufficientColor = () => "#e78e1f";

const atLeastOneIsNecessaryButNotSufficient = (sourceNode, targetNode) => sourceNode.data.necessaryButNotSufficientCondition || targetNode.data.necessaryButNotSufficientCondition;
const atLeastOneIsSmallestCompromise = (sourceNode, targetNode) => sourceNode.data.smallestCompromiseForCombination || targetNode.data.smallestCompromiseForCombination;
const atLeastOneIsASinglePointOfFailure = (sourceNode, targetNode) => sourceNode.data.singlePointOfFailure || targetNode.data.singlePointOfFailure;
const atLeastOneIsNeverResponsible = (sourceNode, targetNode) => sourceNode.data.neverResponsibleForCompromise || targetNode.data.neverResponsibleForCompromise;
const atLeastOneIsInvalidatedTheory = (sourceNode, targetNode) => sourceNode.value === false && targetNode.value === false;

const highlightLinksWhereAtLeastOneNodeIsTrue = (nodes, d) => {
    const sourceNode = nodes.find(node => node.id === d.source.id);
    const targetNode = nodes.find(node => node.id === d.target.id);

    if (atLeastOneIsNecessaryButNotSufficient(sourceNode, targetNode)) {
        return necessaryButNotSufficientColor();
    } else if (atLeastOneIsASinglePointOfFailure(sourceNode, targetNode)) {
        return singlePointOfFailureColor();
    } else if (atLeastOneIsSmallestCompromise(sourceNode, targetNode)) {
        return smallestCompromiseForCombinationColor();
    } else if (atLeastOneIsNeverResponsible(sourceNode, targetNode)) {
        return neverResponsibleForCompromiseColor();
    } else if (atLeastOneIsInvalidatedTheory(sourceNode, targetNode)) {
        return noVerifiedLemmaInvolvedColor();
    } else {
        return atLeastOneTheorySuccessfullyVerifiedColor();
    }
}

const onDragStart = (simulation) => {
    return (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    };
}

const onDrag = () => {
    return (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
    };
}

const onDragEnd = (simulation) => {
    return (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    };
}

const isEntity = (d, item) => d.data.entities.includes(item);

const generateLabel = (d) => {
    return d.subset
        .map(item => {
            const entityColor = isEntity(d, item) ? 'DarkSlateBlue' : 'black';
            return {entityColor: entityColor, name: item};
        })
        .reduce((acc, item) => {
            const lastGroup = acc[acc.length - 1];
            if (!lastGroup || lastGroup.entityColor !== item.entityColor) {
                acc.push({entityColor: item.entityColor, names: [item.name]});
            } else {
                lastGroup.names.push(item.name);
            }
            return acc;
        }, [])
        .map(item => {
            return `<tspan fill="${item.entityColor}">${item.names.join(',')}</tspan>`;
        });
};

const getNumberOfDifferentElementsBetweenNodes = (sourceNode, targetNode) => {
    return sourceNode.subset.filter(x => !targetNode.subset.includes(x)).length +
        targetNode.subset.filter(x => !sourceNode.subset.includes(x)).length;
}

const filterGraphLinks = () => {
    const activateThreshold = document.getElementById('activate-threshold').checked;
    const threshold = parseInt(document.getElementById('link-threshold').value, 10);

    link.attr("display", d => {
        if (!activateThreshold) return 'block';

        const sourceNode = nodes.find(node => node.id === d.source.id);
        const targetNode = nodes.find(node => node.id === d.target.id);

        const differingElements = getNumberOfDifferentElementsBetweenNodes(sourceNode, targetNode);

        return differingElements >= threshold ? 'none' : 'block';
    });
};

let nodes, link, resultsCache;
let maximumNumberOfNodesDisplayed = 100;

const updateSliderValue = () => {
    const sliderValue = document.getElementById('max-nodes-slider').value;
    const sliderValueDisplay = document.getElementById('max-nodes-value');
    sliderValueDisplay.innerText = sliderValue;
};

const updateMaxNodes = (value) => {
    maximumNumberOfNodesDisplayed = parseInt(value);
    document.getElementById('max-nodes-value').textContent = value;
    updateGraph(resultsCache);
};

const updateHiddenNodesInfo = (results) => {
    const availableResults = results.length;
    const hiddenNodes = availableResults - maximumNumberOfNodesDisplayed;
    document.getElementById('hidden-nodes-info').textContent = `Hidden Nodes: ${hiddenNodes > 0 ? hiddenNodes : 0}`;
};

const updateMaximumAvailableNodesInfo = (results) => {
    const availableResults = results.length;
    document.getElementById('max-nodes-available-value').textContent = `${availableResults}`;
}

const setMaximumAllowedSliderValue = (results) => {
    const slider = document.getElementById('max-nodes-slider');
    slider.max = results.length;
}

const constrainSliderValue = (results) => {
    const slider = document.getElementById('max-nodes-slider');
    const availableNodes = results.length;
    if (slider.value > availableNodes || slider.value > slider.max) {
        slider.value = availableNodes;
        maximumNumberOfNodesDisplayed = availableNodes
    }
}

const sampleNodes = (array, sampleSize) => {
    if (sampleSize >= array.length) return array; //bugfix for slider exceeding number of elements
    const step = Math.floor(array.length / sampleSize);
    return array
        .filter((_, index) => index % step === 0)
        .slice(0, sampleSize);
};

const defineColorForNode = (d, color) => {
    if (d.data.necessaryButNotSufficientCondition) return color('orange');
    else if (d.data.singlePointOfFailure) return color('hotPink');
    else if (d.data.smallestCompromiseForCombination) return color('purple');
    else if (d.data.neverResponsibleForCompromise) return color('royalBlue');
    else if (!d.value) return color('red');
    else return color('green');
}

const updateSliderForNewResultsSet = (results) => {
    setMaximumAllowedSliderValue(results);

    constrainSliderValue(results);

    updateHiddenNodesInfo(results);
    updateMaximumAvailableNodesInfo(results);

    updateSliderValue();
};

const rebuildGraphWithNewResults = (results) => {
    resultsCache = results;
    updateSliderForNewResultsSet(results);
    updateGraph(results);
}

const setupGraph = (results) => {
    resultsCache = results;
    updateSliderForNewResultsSet(results);
    animateValues(results);
}

const generateLinks = () => {
    return nodes.flatMap((node, i) =>
        nodes.slice(i + 1).map((otherNode, j) => {
            const sharedEntities = getSharedEntities(nodes, i, i + 1 + j);
            const sharedDomains = getSharedDomains(nodes, i, i + 1 + j);
            return sharedEntitiesOrDomainsBetweenNodes(sharedEntities, sharedDomains)
                ? {source: node.id, target: otherNode.id}
                : null;
        }).filter(link => link !== null)
    );
};

const getNodes = (results, width, height) => {
    return sampleNodes(results, maximumNumberOfNodesDisplayed)
        .map(item => ({
            id: item.folder,
            subset: [...item.data.entities, ...item.data.domains],
            data: item.data,
            value: item.data.doAllLemmasHold,
            x: Math.random() * (width / 2),
            y: Math.random() * (height / 2)
        }));
}

const forceCluster = (width, height) => {
    const strength = 0.5;
    let nodes;

    const force = alpha => {
        const l = alpha * strength;
        nodes.forEach(d => {
            const clusterX = d.value ? (width / 3) : (2 * width / 3);
            const clusterY = height / 2;
            d.vx -= (d.x - clusterX) * l;
            d.vy -= (d.y - clusterY) * l;
        });
    };

    force.initialize = _ => nodes = _;

    return force;
};

const randomDistance = () => Math.random() * 20 + 90;

const simulationTick = (node, width, height, label) => {
    requestAnimationFrame(() => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => {
                d.x = Math.max(10, Math.min(width - 10, d.x));
                return d.x;
            })
            .attr("cy", d => {
                d.y = Math.max(10, Math.min(height - 10, d.y));
                return d.y;
            });

        label
            .attr("x", d => d.x)
            .attr("y", d => d.y);
    });
};

const animateValues = (results) => {
    const svg = d3.select("svg");
    const width = +svg.node().getBoundingClientRect().width;
    const height = +svg.node().getBoundingClientRect().height;

    nodes = getNodes(results, width, height);

    const links = generateLinks();

    const graph = svg.append("g");

    const zoom = d3.zoom()
        .scaleExtent([0.5, 5])
        .on("zoom", (event) => {
            graph.attr("transform", event.transform);
        });

    svg.call(zoom);

    const color = d3.scaleOrdinal()
        .domain(['green', 'red', 'purple', 'hotPink', 'royalBlue', 'orange'])
        .range(["green", "red", "purple", "hotPink", "royalBlue", "orange"]);

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(randomDistance()))
        .force("charge", d3.forceManyBody().strength(-50))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide(40))
        .force("cluster", forceCluster(width, height))
        .force("return", d3.forceManyBody().strength(0.1).distanceMax(200).distanceMin(10))
        .alphaDecay(0.1)
        .alpha(1)
        .restart()
        .on("tick", () => simulationTick(node, width, height, label));

    link = graph.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("class", "link")
        .attr("stroke", d => highlightLinksWhereAtLeastOneNodeIsTrue(nodes, d));

    const node = graph.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 10)
        .attr("fill", d => defineColorForNode(d, color))
        .call(d3.drag()
            .on("start", onDragStart(simulation))
            .on("drag", onDrag())
            .on("end", onDragEnd(simulation)));

    const label = graph.append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(nodes)
        .enter().append("text")
        .attr("dy", -15)
        .attr("text-anchor", "middle")
        .html(d => generateLabel(d));

    simulation.nodes(nodes);
    simulation.force("link").links(links);
    simulation.alpha(1).restart();

    filterGraphLinks();
};

const debounce = (func) => {
    let frame;
    return (...args) => {
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => func(...args));
    };
};

const updateGraph = debounce((updatedResults) => {
    d3.select("svg").selectAll("*").remove();
    animateValues(updatedResults);
});