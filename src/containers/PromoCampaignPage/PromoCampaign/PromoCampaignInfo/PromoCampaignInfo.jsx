import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { generatePath, useHistory, useLocation } from 'react-router-dom';
import { Button } from 'antd';
import { deletePromoCampaign } from '../../../../api/services/promoCampaignService';
import { getFormattedDate } from '../../../../utils/helper';
import { PROMO_CAMPAIGN_PAGES } from '../../../../constants/route';
import Header from '../../../../components/Header/Header';
import PromoCampaignSideBar from '../PromoCampaignSideBar/PromoCampaignSideBar';
import StepInfo from './Steps/StepInfo';
import StepTextAndImage from './Steps/StepTextAndImage';
import StepVisibility from './Steps/StepVisibility';

import styles from './PromoCampaignInfo.module.css';

const EDIT = 'Редактировать';
const DELETE = 'Удалить';

const PromoCampaignInfo = ({ matchUrl }) => {
    const history = useHistory();
    const [promoCampaign, setPromoCampaign] = useState({});
    const { state: stateFromLocation } = useLocation();
    const [step, setStep] = useState(0);

    useEffect(() => {
        const { promoCampaign } = stateFromLocation || {};
        if (!stateFromLocation) {
            return history.push(matchUrl);
        }
        setPromoCampaign({
            ...promoCampaign,
            startDate: getFormattedDate(promoCampaign.startDate),
            finishDate: getFormattedDate(promoCampaign.finishDate),
        });
        setStep(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onEdit = useCallback(() => {
        const path = `${ matchUrl }${ PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_EDIT }`;
        const { promoCampaign } = stateFromLocation || {};
        history.push(generatePath(path, { promoCampaignId: promoCampaign.id }), { promoCampaign });
    }, [history, matchUrl, stateFromLocation]);

    const onDelete = useCallback(() => {
        deletePromoCampaign(promoCampaign.id);
        history.push(matchUrl);
    }, [promoCampaign.id, history, matchUrl]);

    const StepContainer = useMemo(() => {
        switch (step) {
            case 1:
                return <StepInfo promoCampaign={ promoCampaign } />;
            case 2:
                return <StepTextAndImage
                            type={ promoCampaign.type }
                            banners={ promoCampaign.promoCampaignBanners }
                            texts={ promoCampaign.promoCampaignTexts }
                        />;
            case 3:
                return <StepVisibility />;
            default:
                return null;
        }
    }, [step, promoCampaign]);

    return (
        <div className={ styles.promoContainer }>
            <PromoCampaignSideBar
                active={ step }
                onClick={ setStep }
            />
            <div className={ styles.wrapper }>
                <Header />
                { step !== 3 && (
                    <div className={ styles.header }>
                        <div className={ styles.title }>{ promoCampaign.name }</div>
                        <div className={ styles.buttonGroup }>
                            <Button
                                type="primary"
                                onClick={ onEdit }
                            >
                                { EDIT }
                            </Button>
                            <Button
                                className={ styles.deleteBtn }
                                type="primary"
                                danger
                                onClick={ onDelete }
                            >
                                { DELETE }
                            </Button>
                        </div>
                    </div>
                )}
                { StepContainer }
            </div>
        </div>
    );
};

export default PromoCampaignInfo;
