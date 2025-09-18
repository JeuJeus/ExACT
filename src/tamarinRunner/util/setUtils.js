const generateSubsets = (array) => array.reduce((subsets, item) =>
        subsets.concat(subsets.map(subset => [...subset, item])),
    [[]]
);

module.exports = {
    generateSubsets
}