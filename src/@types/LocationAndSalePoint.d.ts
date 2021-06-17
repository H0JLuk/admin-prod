type LocationType = {
    id: number;
    name: string;
    description?: string;
    deleted: boolean;
    priority: number;
    startDate?: string;
    endDate?: string;
};

export type LocationDto = {
    id: number;
    name: string;
    parentName?: string;
    description?: string;
    type: LocationType;
    deleted: boolean;
    startDate?: string;
    endDate?: string;
};

type SalePointType = {
    id: number;
    name: string;
    description?: string;
    deleted: boolean;
    priority: number;
    startDate?: string;
    endDate?: string;
};

export type SalePointDto = {
    id: number;
    name: string;
    parentName?: string;
    description?: string;
    location: LocationDto;
    type: SalePointType;
    deleted: boolean;
    startDate?: string;
    endDate?: string;
};

export type SearchType = 'searchLocation' | 'searchSalePoint';
