import { DefaultPaginationResponse } from './Api';

export type AuditEvent = {
    id: number;
    clientAppCode: string;
    details: string | null;
    happenedAt: string;
    success: boolean;
    type: string;
    userAgent: string;
    userIp: string;
    userLogin: string;
    requestId: string;
};

export type AuditEventsResponse = DefaultPaginationResponse & {
    events: AuditEvent[];
};
