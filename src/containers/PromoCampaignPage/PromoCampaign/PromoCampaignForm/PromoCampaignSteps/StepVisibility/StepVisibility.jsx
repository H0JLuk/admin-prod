import React, { useCallback } from 'react';
import { Button } from 'antd';
import PromoCampaignVisibilitySettingInput from '../../../PromoCampaignVisibilitySettingInput/PromoCampaignVisibilitySettingInput';
import PromoCampaignVisibilitySetting from '../../../../PromoCampaign/PromoCampaignVisibilitySetting/PromoCampaignVisibilitySetting';

import cross from '../../../../../../static/images/cross.svg';

import styles from './StepVisibility.module.css';

const TITLE_OF_STEP = 'Настройки видимости';
const ADD_SETTING = 'Добавить настройку';
const EMPTY_SETTING = { location: null, salePoint: null, visible: false, errors: {} };

const StepVisibility = ({
    visibilitySettings = [],
    onChangeState,
    onDeleteState,
    viewMode,
    isCopy,
    copyVisibilitySettings,
}) => {

    const onChange = (val, idx, input, error = {}) => {
        const hasErrors = !!Object.keys(error).length;
        onChangeState(val, idx, input, hasErrors);

        if (input === 'location') {
            onChangeState({}, idx, 'errors', hasErrors);
        }
    };

    const addVS = useCallback(() => {
        onChangeState({ ...EMPTY_SETTING, id: Date.now() }, visibilitySettings.length);
    }, [visibilitySettings, onChangeState]);

    return viewMode && !isCopy && !copyVisibilitySettings ? (
        <PromoCampaignVisibilitySetting
            searchAndSortMode={ false }
            hideHeader
            addNewByModal
        />
    ) : (
        <div className={ styles.containerStep }>
            <div className={ styles.titleStep }>{ TITLE_OF_STEP }</div>
            { visibilitySettings.map((setting, idx) => (
                <div key={ setting.id } className={ styles.content }>
                    { idx !== 0 && (
                        <img
                            src={ cross }
                            alt="delete"
                            className={ styles.deleteBlock }
                            onClick={ () => onDeleteState(idx, !!Object.keys(setting.errors).length) }
                        />
                    ) }
                    <PromoCampaignVisibilitySettingInput
                        error={ setting.errors }
                        onLocationChange={ (loc) => onChange(loc, idx, 'location', setting.errors) }
                        onSalePointChange={ (salePoint) => onChange(salePoint, idx, 'salePoint', setting.errors) }
                        visibility={ setting.visible }
                        onVisibilityChange={ () => onChange(!setting.visible, idx, 'visible') }
                        location={ setting.location }
                        salePoint={ setting.salePoint }
                    />
                </div>
            )) }
            <Button
                type="primary"
                onClick={ addVS }
            >
                { ADD_SETTING }
            </Button>
        </div>
    );
};

export default StepVisibility;