import React from 'react';
import cn from 'classnames';
import { Switch } from 'antd';
import AutocompleteLocationAndSalePoint from '../../../../components/Form/AutocompleteLocationAndSalePoint/AutocompleteLocationAndSalePoint';
import { getStringOptionValue } from '../../../../utils/utils';

import styles from './PromoCampaignVisibilitySettingInput.module.css';

const VISIBILITY_FIELD = {
    name: 'visibility',
    label: 'Включить видимость',
};

const PromoCampaignVisibilitySettingInput = ({
    error,
    onLocationChange,
    onSalePointChange,
    visibility,
    onVisibilityChange,
    location,
    salePoint,
    columnMode,
}) => (
    <div className={ cn(styles.wrapper, { [styles.columnWrapper]: columnMode }) }>
        <div className={ cn(styles.form, { [styles.columnForm]: columnMode }) }>
            <AutocompleteLocationAndSalePoint
                onLocationChange={ onLocationChange }
                onSalePointChange={ onSalePointChange }
                locationLabelClassNames="required"
                locationId={ location?.id }
                initialLocationValue={ getStringOptionValue(location || undefined) }
                initialSalePointValue={ salePoint?.name ?? '' }
                error={ error }
                columnMode={ columnMode }
            />
            <div className={ styles.visibility }>
                <label htmlFor={ VISIBILITY_FIELD.name } className={ styles.label }>
                    { VISIBILITY_FIELD.label }
                </label>
                <Switch
                    className={ cn(styles.switcher, { [styles.switch]: visibility }) }
                    checked={ visibility }
                    onChange={ onVisibilityChange }
                    id={ VISIBILITY_FIELD.name }
                />
            </div>
        </div>
        { error.server && <div className={ styles.error }>{ error.server }</div> }
    </div>
);

export default PromoCampaignVisibilitySettingInput;
