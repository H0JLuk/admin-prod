export type BusinessRoleDto = {
    id: number;
    name: string;
    description?: string;
    deleted: boolean;
    startDate: string | null;
    endDate: string | null;
};

export type SaveBusinessRoleRequest = {
    clientAppIds: number[];
    name: string;
    description?: string;
    startDate: string;
    endDate?: string;
};
