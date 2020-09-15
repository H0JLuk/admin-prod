import { baseUrl } from '../../api/apiClient';
import { getReqOptions } from '../../api/services';

const initialState = { sent: null, error: false, msg: null };

export const showErrorMessage = 'showErrorMessage';

export const showError = 'showError';

export const showSuccessMessage = 'showSuccessMessage';

export const hideMessage = 'hideMessage';

export const unsetSent = 'unsetSent';

function reducer (state, action) {
    switch (action.type) {
        case showErrorMessage:
            return { sent: false, error: true, msg: action.payload };
        case showError:
            return { sent: false, error: true, msg: 'Ошибка' };
        case showSuccessMessage:
            return { sent: true, error: false, msg: action.payload };
        case hideMessage:
            return { sent: false, error: false, msg: null };
        case unsetSent:
            return { ...state, sent: false, error: false };
        default:
            throw new Error();
    }
}

export async function downloadResultFile (message) {
    try {
        const fileUrl = new URL(`${baseUrl}/admin/user/upload/file/${message}`);
        const fileResponse = await fetch(fileUrl, getReqOptions());
        const blob = await fileResponse.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "Загруженные пользователи.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();
    } catch (e) {
        throw new Error(`Пользователи загружены. Не удалось получить ответ ${e.message}`);
    }
}

export const onFileUploadInputChange = async e => {
    e.preventDefault();
    const { target: { files: [file] } } = e;
    if (!validateFile(file)) {
        throw new Error('Файл не совпадает с шаблоном');
    }
    const data = new FormData();
    data.append("multipartUsersFile", file, file.name);
    const uploadUrl = new URL(`${baseUrl}/admin/user/upload/file`);
    let result, response;
    try {
        response = await fetch(uploadUrl, {
            ...getReqOptions(), method: 'POST',
            body: data
        });
        result = await response.json();
    } catch (e) {
        throw new Error(`Не удалось загрузить пользователей. ${e.message}`);
    }

    if (response.ok) {
        result.message && await downloadResultFile(result.message);
    } else {
        throw new Error(`Не удалось загрузить пользователей ${JSON.stringify(result)}`);
    }
};

export function validateFile(file) {
    return file && file.name && file.name.includes('.xlsx');
}
export { initialState as usersPageInitialState, reducer as usersReducer };