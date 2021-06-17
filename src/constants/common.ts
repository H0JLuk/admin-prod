import { TextAreaProps } from 'antd/lib/input';

export const showCount: TextAreaProps['showCount'] = {
    formatter: ({ count, maxLength }) => `Осталось символов ${maxLength! - count}`,
};

export const DEFAULT_SLEEP_TIME = 500; // in milliseconds

export enum DIRECTION {
    ASC = 'ASC',
    DESC = 'DESC',
}
