import { DefaultApiResponse } from './Api';
import { PromoCampaignDto } from './PromoCampaign';

export type NewCategoryRequest = {
    categoryName: string;
    categoryDescription?: string;
    categoryUrl?: string;
};

export type UpdateCategoryRequest = NewCategoryRequest & {
    active: boolean;
};

export type HighlightDto = {
    endDate?: string;
    formatted: string;
    icons: {
        name: string;
        value: string;
    };
    message: string;
};

export type CategoryDto = {
    active: boolean;
    categoryId: number;
    categoryName: string;
    categoryUrl?: string;
    highlights?: HighlightDto[];
    promoCampaigns?: PromoCampaignDto[];
};

export type CategoryListResponse = DefaultApiResponse & {
    categoryList: CategoryDto[];
};
