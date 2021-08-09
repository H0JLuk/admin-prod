import { getURLSearchParams } from '@utils/helper';
import { DIRECTION } from '@constants/common';
import { AuditEventsResponse } from './../../@types/Audit.d';
import { Api } from '../apiClient';
import { getReqOptions } from './index';

export function fetchAuditData(pageSize: string, pageNo: string, sortBy = '', direction: DIRECTION, mappedFilters = {}) {
    const searchParams = getURLSearchParams({ pageNo, pageSize, sortBy, direction: direction, ...mappedFilters });
    return Api.get<AuditEventsResponse>(`/admin/audit/events?${searchParams}`, getReqOptions());
}
