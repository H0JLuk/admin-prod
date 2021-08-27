export const PRESENT_TYPE = 'present_type';

export enum PresentTypes {
    ROSSTAT = 'rosstat',
}

export const BLOCKING_CONDITIONS: Record<string, (value: string) => boolean> = {
    [PRESENT_TYPE]: (value: string) => value === PresentTypes.ROSSTAT,
};
