import { APP_MECHANIC } from '@constants/clientAppsConstants';

export function computeDisabledMechanics(mechanics: APP_MECHANIC[]): APP_MECHANIC[] {
    if (!mechanics.length) {
        return [];
    }
    const isExpressExist = mechanics.includes(APP_MECHANIC.EXPRESS);
    const isMixExist = mechanics.includes(APP_MECHANIC.MIX);
    const isEcosystemExist = mechanics.includes(APP_MECHANIC.ECOSYSTEM);
    const isBundleExist = mechanics.includes(APP_MECHANIC.BUNDLE);

    const disabledMechanics: Record<keyof typeof APP_MECHANIC, boolean> = {
        [APP_MECHANIC.ECOSYSTEM]: isExpressExist || isMixExist,
        [APP_MECHANIC.PRESENTS]: isExpressExist,
        [APP_MECHANIC.PRESENTATION]: isExpressExist,
        [APP_MECHANIC.BUNDLE]: isExpressExist || isMixExist,
        [APP_MECHANIC.EXPRESS]: !isExpressExist,
        [APP_MECHANIC.MIX]: isExpressExist || isEcosystemExist || isBundleExist,
    };

    return (Object.keys(disabledMechanics) as APP_MECHANIC[]).reduce<APP_MECHANIC[]>((acc, key) => {
        if (disabledMechanics[key]) {
            acc.push(key);
        }
        return acc;
    }, []) as APP_MECHANIC[];
}
