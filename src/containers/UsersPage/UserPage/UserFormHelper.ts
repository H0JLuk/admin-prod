import { ClientAppDto } from '@types';

export type getUserAppsCheckboxesResult = Record<string, {id: number; label: string; disabled: boolean; checked: boolean;}>;

export const getUserAppsCheckboxes = (availableApps: ClientAppDto[] = [], checkedApps: number[] = []) =>
    availableApps.reduce<getUserAppsCheckboxesResult>(
        (result, app) => ({
            ...result,
            [app.code]: {
                id: app.id,
                label: app.displayName,
                disabled: false,
                checked: checkedApps.includes(app.id),
            },
        }),
        {}
    );
