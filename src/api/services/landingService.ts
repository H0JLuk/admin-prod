import { Api } from '../apiClient';
import { getReqOptions } from './index';
import {
    DefaultApiResponse,
    DefaultCreateDtoResponse,
    LandingListResponse,
    SaveLandingRequest,
} from '@types';

export async function getLandingList() {
    return Api.get<LandingListResponse>('/landing', getReqOptions());
}

export async function addLanding(landingDto: SaveLandingRequest) {
    return Api.post<DefaultCreateDtoResponse>('/admin/landing', landingDto, getReqOptions());
}

export async function deleteLanding(id: number) {
    return Api.delete<DefaultApiResponse>(`/admin/landing/${ id }`, getReqOptions());
}

export async function updateLanding(id: number, landingDto: SaveLandingRequest) {
    return Api.put<DefaultCreateDtoResponse>(`/admin/landing/${ id }`, landingDto, getReqOptions());
}
