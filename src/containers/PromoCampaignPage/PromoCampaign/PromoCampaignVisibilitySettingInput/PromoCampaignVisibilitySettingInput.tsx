import React from 'react';
import { LocationDto, SalePointDto } from '@types';
import cn from 'classnames';
import { Switch } from 'antd';
import AutocompleteLocationAndSalePoint from '@components/Form/AutocompleteLocationAndSalePoint/AutocompleteLocationAndSalePoint';
import { getStringOptionValue } from '@utils/utils';

import styles from './PromoCampaignVisibilitySettingInput.module.css';

export type PromoCampaignVisibilitySettingInputProps = {
    onLocationChange: (location: LocationDto | null) => void;
    onSalePointChange: (salePoint: SalePointDto | null) => void;
    onVisibilityChange: (checked: boolean) => void;
    visibility: boolean;
    error: { location?: string; salePoint?: string; server?: string; };
    location: LocationDto | null;
    columnMode?: boolean;
    salePoint?: SalePointDto | null;
};

const VISIBILITY_FIELD = {
    name: 'visibility',
    label: 'Включить видимость',
};

const PromoCampaignVisibilitySettingInput: React.FC<PromoCampaignVisibilitySettingInputProps> = ({
    error,
    onLocationChange,
    onSalePointChange,
    visibility,
    onVisibilityChange,
    location,
    salePoint,
    columnMode,
}) => (
    <div className={cn(styles.wrapper, { [styles.columnWrapper]: columnMode })}>
        <div className={cn(styles.form, { [styles.columnForm]: columnMode })}>
            <AutocompleteLocationAndSalePoint
                onLocationChange={onLocationChange}
                onSalePointChange={onSalePointChange}
                locationLabelClassNames="required"
                locationId={location?.id}
                initialLocationValue={getStringOptionValue(location || undefined)}
                initialSalePointValue={salePoint?.name ?? ''}
                error={error}
                columnMode={columnMode}
            />
            <div className={styles.visibility}>
                <label htmlFor={VISIBILITY_FIELD.name} className={styles.label}>
                    {VISIBILITY_FIELD.label}
                </label>
                <Switch
                    className={cn(styles.switcher, { [styles.switch]: visibility })}
                    checked={visibility}
                    onChange={onVisibilityChange}
                    // id={ VISIBILITY_FIELD.name }
                />
            </div>
        </div>
        {error.server && <div className={styles.error}>{error.server}</div>}
    </div>
);

export default PromoCampaignVisibilitySettingInput;
