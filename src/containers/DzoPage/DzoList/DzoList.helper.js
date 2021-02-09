export const sortDzoListBySearchParams = ({ sortBy, direction, filterText }, copyDzoList) => {
    return (!filterText
        ? copyDzoList.slice()
        : copyDzoList.filter(({ dzoName }) => dzoName.toLowerCase().includes(filterText.toLowerCase()))
    ).sort((a, b) => sortItem(sortBy, direction, [a, b]));
};

function sortItem(type, direction, sortableItems) {
    const [a, b] = sortableItems;

    const ASC_SORT = stringToLowerCase(a[type]) < stringToLowerCase(b[type]) ? -1 : 1;
    const DESC_SORT = stringToLowerCase(b[type]) > stringToLowerCase(a[type]) ? 1 : -1;

    switch (type) {
        case 'dzoId': {
            return direction === 'ASC' ? a[type] - b[type] : b[type] - a[type];
        }
        default: {
            return direction === 'ASC' ? ASC_SORT : DESC_SORT;
        }
    }
}

const stringToLowerCase = (value) => {
    return typeof value === 'string' ? value.toLowerCase() : value;
};