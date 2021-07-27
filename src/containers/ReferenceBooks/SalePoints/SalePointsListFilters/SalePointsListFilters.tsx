import React, { useEffect, useRef, useState } from 'react';
import noop from 'lodash/noop';
import { Radio, RadioChangeEvent } from 'antd';
import SelectTagsOnChangeByClose from '@components/SelectTags/SelectTagsOnChangeByClose';
import AutoCompleteComponent, { AutoCompleteMethods } from '@components/AutoComplete';
import { SearchParams } from '@components/HeaderWithActions';
import AutocompleteOptionLabel from '@components/Form/AutocompleteLocationAndSalePoint/AutocompleteOptionLabel';
import { getSalePointsByText, getSalePointTypesOptions } from '@apiServices/salePointService';
import { getLocationsByText, getLocationTypeOptions } from '@apiServices/locationService';
import { getStringOptionValueByDescription, getStringOptionValue, requestsWithMinWait } from '@utils/utils';
import { LocationDto, SalePointDto } from '@types';
import { SALE_POINT_TYPE, SALE_POINT_TYPE_RU } from '@constants/common';

import styles from './SalePointsListFilters.module.css';

type SalePointsListFilterProps = {
    params: SearchParams;
    initialParentLocation?: LocationDto;
    initialParentSalePoint?: SalePointDto;
    onChangeFilter(params: SearchParams): void;
    onChangeParentLocation?(location: LocationDto | null): void;
    onChangeParentSalePoint?(salePoint: SalePointDto | null): void;
    disabledAllFields?: boolean;
};

const SALE_POINT_KIND_OPTIONS = [
    { label: 'Все', value: '' },
    { label: SALE_POINT_TYPE_RU.EXTERNAL, value: SALE_POINT_TYPE.EXTERNAL },
    { label: SALE_POINT_TYPE_RU.INTERNAL, value: SALE_POINT_TYPE.INTERNAL },
];

const SalePointsListFilters: React.FC<SalePointsListFilterProps> = ({
    params,
    initialParentLocation,
    initialParentSalePoint,
    onChangeFilter,
    onChangeParentLocation = noop,
    onChangeParentSalePoint = noop,
    disabledAllFields,
}) => {
    const [loading, setLoading] = useState(true);
    const locationTypesOptions = useRef<{ label: string; value: number; }[]>([]);
    const salePointTypesOptions = useRef<{ label: string; value: number; }[]>([]);
    const parentLocationMethods = useRef({} as AutoCompleteMethods<LocationDto>);
    const parentSalePointMethods = useRef({} as AutoCompleteMethods<SalePointDto>);
    const disabledAll = disabledAllFields || loading;

    useEffect(() => {
        (async () => {
            const requests = Promise.all([getLocationTypeOptions(), getSalePointTypesOptions()]);
            const [locationTypes, salePointTypes] = await requestsWithMinWait(requests, 0);
            locationTypesOptions.current = locationTypes;
            salePointTypesOptions.current = salePointTypes;
            setLoading(false);
        })();
    }, []);

    const onChangeLocationTypes = (selected: string[] | number[]) => {
        onChangeFilter({
            ...params,
            locationTypeIds: selected as any,
        });
    };

    const onChangeSalePointTypes = (selected: string[] | number[]) => {
        onChangeFilter({
            ...params,
            salePointTypeIds: selected as any,
        });
    };

    const onParentLocationSelect = (location: LocationDto | null) => {
        onChangeParentLocation(location);
        if (!location && !params.topParentLocationId) {
            return;
        }

        onChangeFilter({
            ...params,
            topParentLocationId: location?.id ?? '',
        });
    };

    const onParentSalePointSelect = (salePoint: SalePointDto | null) => {
        onChangeParentSalePoint(salePoint);
        if (!salePoint && !params.topParentSalePointId) {
            return;
        }

        onChangeFilter({
            ...params,
            topParentSalePointId: salePoint?.id ?? '',
        });
    };

    const onChangeSalePointKind = (e: RadioChangeEvent) => {
        onChangeFilter({
            ...params,
            salePointKind: e.target.value,
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.title}>
                Фильтры
            </div>
            <div className={styles.filterBlock}>
                <SelectTagsOnChangeByClose
                    className={styles.filterItem}
                    data={locationTypesOptions.current}
                    placeholder="Тип локации"
                    value={params.locationTypeIds as any || []}
                    nameKey="label"
                    idKey="value"
                    onChange={onChangeLocationTypes}
                    disabled={disabledAll}
                />
                <AutoCompleteComponent
                    className={styles.filterItem}
                    value={initialParentLocation}
                    placeholder="Родительская локация"
                    requestFunction={getLocationsByText}
                    onSelect={onParentLocationSelect}
                    renderOptionItemLabel={({ name, parentName }, searchValue) => (
                        <AutocompleteOptionLabel
                            name={name}
                            parentName={parentName}
                            highlightValue={searchValue}
                        />
                    )}
                    renderOptionStringValue={getStringOptionValue}
                    disabled={disabledAll}
                    componentMethods={parentLocationMethods}
                />
            </div>
            <div className={styles.filterBlock}>
                <SelectTagsOnChangeByClose
                    className={styles.filterItem}
                    data={salePointTypesOptions.current}
                    placeholder="Тип точки продажи"
                    value={params.salePointTypeIds as any || []}
                    nameKey="label"
                    idKey="value"
                    onChange={onChangeSalePointTypes}
                    disabled={disabledAll}
                />
                <AutoCompleteComponent
                    className={styles.filterItem}
                    value={initialParentSalePoint}
                    placeholder="Родительская точка продажи"
                    requestFunction={getSalePointsByText}
                    onSelect={onParentSalePointSelect}
                    renderOptionItemLabel={({ name, parentName }, searchValue) => (
                        <AutocompleteOptionLabel
                            name={name}
                            parentName={parentName}
                            highlightValue={searchValue}
                        />
                    )}
                    renderOptionStringValue={getStringOptionValueByDescription}
                    disabled={disabledAll}
                    componentMethods={parentSalePointMethods}
                />
            </div>
            <div className={styles.radio}>
                <Radio.Group
                    onChange={onChangeSalePointKind}
                    options={SALE_POINT_KIND_OPTIONS}
                    value={params.salePointKind}
                />
            </div>
        </div>
    );
};

export default SalePointsListFilters;
