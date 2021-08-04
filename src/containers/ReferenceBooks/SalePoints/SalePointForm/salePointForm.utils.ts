import { SALE_POINT_TYPE, SALE_POINT_TYPE_RU } from '@constants/common';
import { SalePointType } from '@types';

export const handleSalePointKindMismatch = (
    isEdit: boolean,
    salePointKind: SALE_POINT_TYPE,
    parentSalePointKind: SALE_POINT_TYPE,
) =>
    `Невозможно ${isEdit ? 'изменить' : 'создать'} точку продажи.
Вид точки продажи ${
    SALE_POINT_TYPE_RU[salePointKind]
} не совпадает с видом родительской точки ${
    SALE_POINT_TYPE_RU[parentSalePointKind]
}`;

export const getSalePointKindById = (arr: SalePointType[], value: number) =>
    arr.find(({ id }) => id === value)?.kind;
