import { SALE_POINT_TYPE } from '@constants/common';
import { DefaultPaginationResponse } from './Api';

export type LocationTypeDto = {
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
    type: LocationTypeDto;
    deleted: boolean;
    startDate?: string;
    endDate?: string | null;
    parentId: number;
};

type SalePointType = {
    id: number;
    name: string;
    description?: string;
    deleted: boolean;
    priority: number;
    startDate?: string;
    endDate?: string | null;
    kind: SALE_POINT_TYPE;
};

export type SalePointDto = {
    id: number;
    name: string;
    parentName?: string;
    parentId: number;
    description?: string;
    location: LocationDto;
    type: SalePointType;
    deleted: boolean;
    startDate?: string;
    endDate?: string | null;
};


export type SalePointRequest = {
    description: string;
    locationId: number;
    name: string;
    parentId: number;
    typeId: number;
};

export type SalePointTypesList = DefaultPaginationResponse & {
    salePoints: SalePointDto[];
};

export type SearchType = 'searchLocation' | 'searchSalePoint';

export type LocationsListResponse = DefaultPaginationResponse & {
    locations: LocationDto[];
};

export type SaveLocationRequest = Pick<LocationDto, 'description' | 'name' | 'parentId'> & {
    typeId: number;
};
