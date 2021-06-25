import { baseUrl } from '../../../api/apiClient';
import { getReqOptions } from '@apiServices';

type UserPageState = {
    sent: null | boolean;
    error: boolean;
    msg: string | null;
};

type ShowErrorMessageAction = {
    type: typeof showErrorMessage;
    payload: string;
};

type ShowError = {
    type: typeof showError;
};

type ShowSuccessMessage = {
    type: typeof showSuccessMessage;
    payload: string;
};

type HideMessage = {
    type: typeof hideMessage;
};

type UnsetSent = {
    type: typeof unsetSent;
};

export type UserPageActions = ShowErrorMessageAction | ShowError | ShowSuccessMessage | HideMessage | UnsetSent;

const initialState: UserPageState = { sent: null, error: false, msg: null };

export const showErrorMessage = 'showErrorMessage';

export const showError = 'showError';

export const showSuccessMessage = 'showSuccessMessage';

export const hideMessage = 'hideMessage';

export const unsetSent = 'unsetSent';

function reducer (state: UserPageState, action: UserPageActions): UserPageState {
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

export const onFileUploadInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file || !validateFile(file)) {
        throw new Error('Файл не совпадает с шаблоном');
    }
    const data = new FormData();
    data.append('multipartUsersFile', file, file.name);
    const uploadUrl = new URL(`${baseUrl}/admin/user/upload/file`);
    let result, response;
    try {
        response = await fetch(uploadUrl.toString(), {
            ...getReqOptions(),
            method: 'POST',
            body: data,
        });
    } catch (e) {
        throw new Error(`Не удалось загрузить пользователей. ${e.message}`);
    }

    if (response.ok) {
        result = await response.blob();
        const url = window.URL.createObjectURL(result);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Результат загрузки пользователей.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
    } else {
        result = await response.json();
        throw new Error(result.message);
    }
};

export async function onDeleteFileUploadInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const file = e.target.files?.[0];

    if (!file || !validateFile(file)) {
        throw new Error('Файл не совпадает с шаблоном');
    }

    const data = new FormData();
    data.append('multipartUsersFile', file, file.name);
    const uploadUrl = new URL(`${baseUrl}/admin/user/delete/file`);

    let response;
    try {
        response = await fetch(uploadUrl.toString(), {
            ...getReqOptions(),
            method: 'POST',
            body: data,
        });
    } catch (e) {
        throw new Error(`Не удалось удалить пользователей. ${e.message}`);
    }

    const result = await response.json();

    if (response.ok) {
        console.log(result.message);
    } else {
        throw new Error(result.message);
    }
}

export function validateFile(file?: File) {
    return file && file.name && file.name.includes('.csv');
}
export { initialState as usersPageInitialState, reducer as usersReducer };