export interface ApiConfig {
    baseUrl?: string;
    options?: ApiRequestOptions;
}

export interface DefaultApiResponse {
    message: string;
    status: 'Ok' | 'NOK';
}

export type ListResponse<T> = DefaultApiResponse & {
    list: T[];
};

export type DefaultCreateDtoResponse = DefaultApiResponse & {
    id: number;
};

export type ApiRequestBody = Record<string, any>;

export interface ApiRequestHeaders extends Headers {
    token: string;
    clientAppCode?: string;
    Accept?: string;
    'Content-Type'?: string;
}

export interface ApiRequest {
    body?: BodyInit;
    method?: string;
    headers: ApiRequestHeaders;
}

export interface ApiRequestOptions {
    headers: ApiRequestHeaders;
}

export type UploadFileResponse = DefaultApiResponse & {
    path: string;
};

export type DefaultPagination = {
    pageNo: number;
    totalElements: number;
    totalPages: number;
};

export type DefaultPaginationResponse = DefaultApiResponse & DefaultPagination;
