const getSubsets = array => {
    /* without empty or self */
    const subsets = [];

    const generateSubsets = (current, index) => {
        if (index === array.length) {
            if (current.length > 0 && current.length < array.length) {
                subsets.push([...current]);
            }
            return;
        }

        current.push(array[index]);
        generateSubsets(current, index + 1);

        current.pop();
        generateSubsets(current, index + 1);
    };

    generateSubsets([], 0);
    return subsets;
};

const arraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;

    const sortedArr1 = [...arr1].sort();
    const sortedArr2 = [...arr2].sort();

    return sortedArr1.every((value, index) => value === sortedArr2[index]);
};

const setEquals = (setA, setB) =>
    setA.size === setB.size &&
    [...setA].every((x) => setB.has(x));

module.exports = {
    getSubsets,
    arraysEqual,
    setEquals
};