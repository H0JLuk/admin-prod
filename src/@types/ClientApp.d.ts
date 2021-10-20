export type ClientAppDto = {
    code: string;
    displayName: string;
    id: number;
    isDeleted: boolean;
    name: string;
    orderNumber: number;
    businessRoleIds: number[];
    loginTypes: string[];
};

export type SaveClientApp = Omit<ClientAppDto, 'id' | 'orderNumber' | 'loginTypes'> & { existingCode?: string; consentId: string; };
