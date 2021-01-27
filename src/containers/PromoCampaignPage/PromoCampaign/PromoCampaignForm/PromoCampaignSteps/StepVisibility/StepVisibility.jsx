import React, { useCallback } from 'react';
import { Button } from 'antd';
import PromoCampaignVisibilitySettingInput from '../../../PromoCampaignVisibilitySettingInput/PromoCampaignVisibilitySettingInput';
import PromoCampaignVisibilitySetting from '../../../../PromoCampaign/PromoCampaignVisibilitySetting/PromoCampaignVisibilitySetting';

import cross from '../../../../../../static/images/cross.svg';

import styles from './StepVisibility.module.css';

const TITLE_OF_STEP = 'Настройки видимости';
const ADD_SETTING = 'Добавить настройку';
const emptyLocation = { location: null, salePoint: null, visible: false, errors: {} };

const StepVisibility = ({ visibilitySettings = [], onChangeState, onDeleteState, viewMode }) => {

    const onChange = useCallback((val, idx, input) => {
        onChangeState('visibilitySettings', val, idx, input);

        if (input === 'salePoint') {
            onChangeState('visibilitySettings', {}, idx, 'errors');
        }
    }, [onChangeState]);

    const addVS = useCallback(() => {
        onChangeState('visibilitySettings', { ...emptyLocation }, visibilitySettings.length);
    }, [visibilitySettings, onChangeState]);

    const deleteBlock = useCallback((idx) => onDeleteState('visibilitySettings', idx), [onDeleteState]);

    return viewMode ? (
        <PromoCampaignVisibilitySetting
            searchAndSortMode={ false }
            hideHeader
        />
    ) : (
        <div className={ styles.containerStep }>
            <div className={ styles.titleStep }>{ TITLE_OF_STEP }</div>
            { visibilitySettings.map((setting, idx) => (
                <div key={ idx } className={ styles.content }>
                    { idx !== 0 && (
                        <img
                            src={ cross }
                            alt="delete"
                            className={ styles.deleteBlock }
                            onClick={ () => deleteBlock(idx) }
                        />
                    ) }
                    <PromoCampaignVisibilitySettingInput
                        error={ setting.errors }
                        onLocationChange={ (loc) => onChange(loc, idx, 'location') }
                        onSalePointChange={ (salePoint) => onChange(salePoint, idx, 'salePoint') }
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