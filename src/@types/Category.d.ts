import { DefaultApiResponse } from './Api';

export type NewCategoryRequest = {
    categoryName: string;
    categoryDescription?: string;
    categoryUrl?: string;
};

export type UpdateCategoryRequest = NewCategoryRequest & {
    active: boolean;
};

export type CategoryDto = {
    active: boolean;
    categoryId: number;
    categoryName: string;
    categoryUrl?: string;
};

export type CategoryListResponse = DefaultApiResponse & {
    categoryList: CategoryDto[];
};
