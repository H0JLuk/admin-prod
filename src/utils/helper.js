import moment from 'moment';

export const downloadFile = (data, name) => {
    const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
    downloadFileFunc(URL.createObjectURL(blob), name, 'xlsx');
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

    return moment(date).format(format);
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