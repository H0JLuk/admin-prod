export type BusinessRoleDto = {
    id: number;
    name: string;
    description?: string;
    deleted: boolean;
    startDate: string | null;
    endDate: string | null;
};

export type SaveBusinessRoleRequest = {
    name: string;
    description?: string;
};
