type LocationType = {
    id: number;
    name: string;
    description?: string | null;
    deleted: boolean;
    priority: number;
    startDate?: string;
    endDate?: string | null;
};

export type LocationDto = {
    id: number;
    name: string;
    parentName?: string;
    description?: string | null;
    type: LocationType;
    deleted: boolean;
    startDate?: string;
    endDate?: string | null;
};

type SalePointType = {
    id: number;
    name: string;
    description?: string;
    deleted: boolean;
    priority: number;
    startDate?: string;
    endDate?: string | null;
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
    endDate?: string | null;
};

export type SearchType = 'searchLocation' | 'searchSalePoint';
