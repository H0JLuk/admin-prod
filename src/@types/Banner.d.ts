import { UploadFile } from 'antd/lib/upload/interface';

/* don't change this type. Use `Partial` */
export type BannerDto = {
    id: number;
    orderNumber: number;
    type: string;
    url: string;
};

export type BannerCreateDto = Record<string, string | UploadFile[] | File | Blob>;
