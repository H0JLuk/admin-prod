import moment from 'moment';
import { getStaticUrl } from '../api/services/settingsService';

export const getURLSearchParams = (params) => new URLSearchParams(params).toString();

export const downloadFile = (data, name) => {
    const blob = new Blob([data], { type: 'text/csv' });
    downloadFileFunc(URL.createObjectURL(blob), name, 'csv');
};

export const loadImageWithPromise = (url, failUrl) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(failUrl);
        img.src = url;
    });
};

export function templateLink(filename) {
    return `${process.env.PUBLIC_URL}/templates/${filename}`;
}

export const getBase64 = (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        try {
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
        } catch {
            reader.onerror = (error) => reject(error);
        }
    });
};

export function getFileURL(file) {
    const staticUrl = getStaticUrl();
    return `${ staticUrl }${ file }`;
}

/**
 * @param {any[]} array
 * @param {number} from
 * @param {number} to
 */
export function arrayMove(array, from, to) {
    const newArray = [...array];
    const startIndex = from < 0 ? newArray.length + from : from;

    if (startIndex >= 0 && startIndex < newArray.length) {
        const endIndex = to < 0 ? newArray.length + to : to;
        const [item] = newArray.splice(from, 1);
        newArray.splice(endIndex, 0, item);
    }

    return newArray;
}

export function getFormattedDate(date, format = 'DD.MM.YYYY') {
    if (!date) {
        return '';
    }

    return moment.utc(date).local().format(format);
}

/**
 * @param {string[][]} data
 * @param {string[]} columns
 */
export function generateCsvFile(data, columns = ['Табельный номер пользователя', 'Пароль']) {
    const contentType = 'data:text/csv;charset=utf-8,';
    const finalCsv = [columns, ...data].map(item => item.join(',')).join('\n');
    const encodedUri = encodeURI(contentType + finalCsv);
    downloadFileFunc(encodedUri, 'restoredUsers', 'csv');
}

export function downloadFileFunc(dataObj, name = 'file', fileExtension = 'csv') {
    if (dataObj) {
        const link = window.document.createElement('a');
        link.setAttribute('href', dataObj);
        link.setAttribute('download', `${name}.${fileExtension}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

export function sortItemsBySearchParams({ sortBy, direction, filterText }, list, filterKey) {
    return (!filterText
        ? list.slice()
        : list.filter((item) => item[filterKey].toLowerCase().includes(filterText.toLowerCase()))
    ).sort((a, b) => sortItems(sortBy, direction, [a, b]));
}

function sortItems(type, direction, sortableItems) {
    const [a, b] = sortableItems;

    switch (typeof a[type]) {
        case 'number': {
            return getNumberSort(direction, a[type], b[type]);
        }
        case 'string': {
            return getStringSort(direction, a[type], b[type]);
        }
        default: {
            return 0;
        }
    }
}

function getStringSort(direction, a, b) {
    const aLowerCase = stringToLowerCase(a);
    const bLowerCase = stringToLowerCase(b);

    if (aLowerCase === bLowerCase) return 0;

    const ASC_SORT = aLowerCase < bLowerCase ? -1 : 1;
    const DESC_SORT = bLowerCase > aLowerCase ? 1 : -1;

    return direction === 'ASC' ? ASC_SORT : DESC_SORT;
}

function getNumberSort(direction, a, b) {

    return direction === 'ASC' ? a - b : b - a;
}

function stringToLowerCase(value) {
    return value.toLowerCase();
}

export const defaultSearchParams = {
    sortBy: '',
    direction: 'ASC',
    filterText: '',
};

export const defaultPaginationParams = {
    pageNo: 0,
    pageSize: 10,
    sortBy: '',
    direction: 'ASC',
    filterText: '',
    totalElements: 0,
};

export function getSearchParamsFromUrl(search, defaultParams = defaultSearchParams) {
    const urlSearchParams = new URLSearchParams(search);
    return Object.keys(defaultParams).reduce((result, key) => {
        return {
            ...result,
            [key]: urlSearchParams.get(key) || defaultParams[key],
        };
    }, {});
}

export function removeExtraSpaces(value) {
    if (typeof value !== 'string') {
        return value;
    }

    return !value.trim() ? value.trim() : value.replace(/\s{2,}/g, ' ');
}
