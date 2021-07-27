import React, { useEffect, useRef, useState } from 'react';
import noop from 'lodash/noop';
import SelectTagsOnChangeByClose from '@components/SelectTags/SelectTagsOnChangeByClose';
import AutoCompleteComponent, { AutoCompleteMethods } from '@components/AutoComplete';
import { SearchParams } from '@components/HeaderWithActions';
import AutocompleteOptionLabel from '@components/Form/AutocompleteLocationAndSalePoint/AutocompleteOptionLabel';
import { getLocationsByText, getLocationTypeOptions } from '@apiServices/locationService';
import { getStringOptionValue } from '@utils/utils';
import { LocationDto } from '@types';

import styles from './LocationsListFilters.module.css';

type LocationsListFiltersProps = {
    params: SearchParams;
    initialParentLocation?: LocationDto;
    onChangeFilter(params: SearchParams): void;
    onChangeParentLocation?(location: LocationDto | null): void;
    disabledAllFields?: boolean;
};

const LocationsListFilters: React.FC<LocationsListFiltersProps> = ({
    params,
    initialParentLocation,
    onChangeFilter,
    onChangeParentLocation = noop,
    disabledAllFields,
}) => {
    const [loading, setLoading] = useState(true);
    const locationTypesOptions = useRef<{ label: string; value: number; }[]>([]);
    const parentLocationMethods = useRef({} as AutoCompleteMethods<LocationDto>);
    const disabledAll = disabledAllFields || loading;

    useEffect(() => {
        (async () => {
            locationTypesOptions.current = await getLocationTypeOptions();
            setLoading(false);
        })();
    }, []);

    const onChangeLocationTypes = (selected: string[] | number[]) => {
        onChangeFilter({
            ...params,
            locationTypeIds: selected as any,
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
        </div>
    );
};

export default LocationsListFilters;
