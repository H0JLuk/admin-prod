import React from 'react';
import cn from 'classnames';
import { Form, Switch } from 'antd';
import AutocompleteLocationAndSalePoint from '../../../../components/Form/AutocompleteLocationAndSalePoint/AutocompleteLocationAndSalePoint';
import { getStringOptionValue } from '../../../../utils/utils';

import styles from './PromoCampaignVisibilitySettingInput.module.css';

const VISIBILITY_FIELD = {
    name: 'visibility',
    label: 'Включить видимость',
};

const FORM_NAME = 'createVisibilityForm';

const PromoCampaignVisibilitySettingInput = ({
    error,
    onLocationChange,
    onSalePointChange,
    visibility,
    onVisibilityChange,
    location,
    salePoint,
}) => (
    <div className={ styles.wrapper }>
        <Form
            className={ styles.form }
            name={ FORM_NAME }
            requiredMark={ false }
        >
            <AutocompleteLocationAndSalePoint
                onLocationChange={ onLocationChange }
                onSalePointChange={ onSalePointChange }
                salePointLabelClassNames="required"
                locationId={ location?.id }
                initialLocationValue={ getStringOptionValue(location || undefined) }
                initialSalePointValue={ salePoint?.name ?? '' }
                error={ error }
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
        </Form>
    </div>
);

export default PromoCampaignVisibilitySettingInput;