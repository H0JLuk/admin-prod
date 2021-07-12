import moment from 'moment';
import { getStaticUrl } from '@apiServices/settingsService';
import { UploadFile } from 'antd/lib/upload/interface';
import { DIRECTION } from '@constants/common';
import { SearchParams } from '@components/HeaderWithActions/types';

export const getURLSearchParams = (params: string | SearchParams) => new URLSearchParams(params as Record<string, string>).toString();

export const downloadFile = (data: BlobPart, name: string) => {
    const blob = new Blob([data], { type: 'text/csv' });
    downloadFileFunc(URL.createObjectURL(blob), name, 'csv');
};

export const loadImageWithPromise = (url: string, failUrl: string): Promise<string> =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(failUrl);
        img.src = url;
    });

export function templateLink(filename: string) {
    return `${process.env.PUBLIC_URL}/templates/${filename}`;
}

export const getBase64 = (file?: File | Blob | UploadFile) => {
    const reader = new FileReader();
    return new Promise<string>((resolve, reject) => {
        try {
            reader.readAsDataURL(file as Blob);
            reader.onload = () => resolve(reader.result as string);
        } catch {
            reader.onerror = (error) => reject(error);
        }
    });
};

export function getFileURL(file: string) {
    const staticUrl = getStaticUrl();
    return `${ staticUrl }${ file }`;
}

export function arrayMove<T>(array: T[], from: number, to: number) {
    const newArray = [...array];
    const startIndex = from < 0 ? newArray.length + from : from;

    if (startIndex >= 0 && startIndex < newArray.length) {
        const endIndex = to < 0 ? newArray.length + to : to;
        const [item] = newArray.splice(from, 1);
        newArray.splice(endIndex, 0, item);
    }

    return newArray;
}

export function getFormattedDate(date: moment.MomentInput | undefined, format = 'DD.MM.YYYY') {
    if (!date) {
        return '';
    }

    return moment.utc(date).local().format(format);
}

export function generateCsvFile(data: string[][], columns = ['Табельный номер пользователя', 'Пароль']) {
    const contentType = 'data:text/csv;charset=utf-8,';
    const finalCsv = [columns, ...data].map(item => item.join(',')).join('\n');
    const encodedUri = encodeURI(contentType + finalCsv);
    downloadFileFunc(encodedUri, 'restoredUsers', 'csv');
}

export function downloadFileFunc(dataObj: string, name = 'file', fileExtension = 'csv') {
    if (dataObj) {
        const link = window.document.createElement('a');
        link.setAttribute('href', dataObj);
        link.setAttribute('download', `${name}.${fileExtension}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

export function sortItemsBySearchParams<T, K extends keyof T>(
    { sortBy, direction, filterText }: SearchParams,
    list: T[],
    filterKey: K,
) {
    return (!filterText
        ? list.slice()
        : list.filter((item) => (item[filterKey] as unknown as string).toLowerCase().includes((filterText as string).toLowerCase()))
    ).sort((a, b) => sortItems(sortBy as string, direction, [a, b]));
}

function dateToNumber(args: [string, string]) {
    return args.map(arg => new Date(arg).getTime()) as [number, number];
}

function sortItems(type: string, direction: DIRECTION, sortableItems: [any, any]) {
    const [a, b] = sortableItems;

    if (type === 'finishDate') {
        [a[type], b[type]] = dateToNumber([a[type], b[type]]);
    }

    switch (typeof a[type]) {
        case 'number': {
            return getNumberSort(a[type], b[type], direction);
        }
        case 'string': {
            return getStringSort(a[type], b[type], direction);
        }
        default: {
            return getDefaultSort(direction);
        }
    }
}

export function getStringSort(a: string, b: string, direction = DIRECTION.ASC) {
    const aLowerCase = stringToLowerCase(a);
    const bLowerCase = stringToLowerCase(b);

    if (aLowerCase === bLowerCase) return 0;

    const ASC_SORT = aLowerCase < bLowerCase ? -1 : 1;
    const DESC_SORT = bLowerCase > aLowerCase ? 1 : -1;

    return direction === DIRECTION.ASC ? ASC_SORT : DESC_SORT;
}

function getNumberSort(a: number, b: number, direction = DIRECTION.ASC) {
    return direction === DIRECTION.ASC ? a - b : b - a;
}

function getDefaultSort(direction = DIRECTION.ASC) {
    return direction === DIRECTION.ASC ? 0 : -1;
}

function stringToLowerCase(value: string) {
    return value.toLowerCase();
}

export const defaultSearchParams: SearchParams = {
    sortBy: '',
    direction: DIRECTION.ASC,
    filterText: '',
};

export const defaultPaginationParams: SearchParams = {
    pageNo: 0,
    pageSize: 10,
    sortBy: '',
    direction: DIRECTION.ASC,
    filterText: '',
    totalElements: 0,
};

export function getSearchParamsFromUrl(
    search: string,
    defaultParams: Record<string, string | number> = defaultSearchParams,
    ignoreKeys: string[] = [],
): SearchParams {
    const urlSearchParams = new URLSearchParams(search);

    return Object.keys(defaultParams).reduce((result, key) => {
        const value = urlSearchParams.get(key);
        if (!value && ignoreKeys.includes(key)) {
            return result;
        }

        return {
            ...result,
            [key]: value || defaultParams[key],
        };
    }, {} as SearchParams);
}

export function arrayToObject(array: Array<Record<string, any>>, keyForKey: string, keyForValue: string) {
    return array.reduce((result, item) => ({ ...result, [item[keyForKey]]: item[keyForValue] }), {});
}

export function removeExtraSpaces(value?: string) {
    if (typeof value !== 'string') {
        return value;
    }

    return !value.trim() ? value.trim() : value.replace(/\s{2,}/g, ' ');
}

export function trimValue(value?: string) {
    return value?.trim();
}

export function compareArrayOfNumbers(arrA: number[], arrB: number[]) {
    if (arrA.length === arrB.length) {
        const arrBSorted = [...arrB].sort(getNumberSort);
        return [...arrA].sort(getNumberSort).every((el, idx) => el === arrBSorted[idx]);
    }

    return false;
}

export const numberTransform = (value: string) => value ? Number(value) : '';
