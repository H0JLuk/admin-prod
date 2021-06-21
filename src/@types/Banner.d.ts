import { BANNER_TYPE } from '@constants/common';
import { UploadFile } from 'antd/lib/upload/interface';

/* don't change this type. Use `Partial` */
export type BannerDto = {
    default?: boolean;
    id: number;
    orderNumber: number;
    type: BANNER_TYPE;
    url: string;
};

export type BannerCreateDto = Record<string, string | UploadFile[] | File | Blob>;
