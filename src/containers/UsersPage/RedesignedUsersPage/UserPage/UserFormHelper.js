export const getUserAppsCheckboxes = (availableApps = [], checkedApps = []) => availableApps.reduce(
    (result, app) => ({
        ...result,
        [app.code]: {
            id: app.id,
            label: app.displayName,
            disabled: false,
            checked: checkedApps.includes(app.id),
        },
    }), {}
);
