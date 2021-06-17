export type ClientAppDto = {
    code: string;
    displayName: string;
    id: number;
    isDeleted: boolean;
    name: string;
    orderNumber: number;
    businessRoleIds: number[];
};

export type SaveClientApp = Omit<ClientAppDto, 'id' | 'orderNumber'> & { existingCode?: string; };
