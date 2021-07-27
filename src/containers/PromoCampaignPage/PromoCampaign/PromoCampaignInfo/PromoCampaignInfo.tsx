import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { generatePath, useHistory, useLocation } from 'react-router-dom';
import { Button } from 'antd';
import { getFormattedDate } from '@utils/helper';
import { PROMO_CAMPAIGN_PAGES } from '@constants/route';
import Header from '@components/Header';
import PromoCampaignSideBar from '../PromoCampaignSideBar';
import StepInfo from './Steps/StepInfo';
import StepTextAndImage from './Steps/StepTextAndImage';
import StepVisibility from './Steps/StepVisibility';
import PromoCampaignCopyModal from '../PromoCampaignCopyModal';
import { confirmModal } from '@utils/utils';
import { onConfirmDeletePromoCampaign, getDeleteTitleConfirm } from '../../PromoCampaignUtils';
import { BUTTON_TEXT } from '@constants/common';
import { PromoCampaignDto } from '@types';

import styles from './PromoCampaignInfo.module.css';

type PromoCampaignInfoProps = {
    matchPath: string;
};

interface ILocationState {
    promoCampaign: PromoCampaignDto;
}

const PromoCampaignInfo: React.FC<PromoCampaignInfoProps> = ({ matchPath }) => {
    const history = useHistory();
    const [promoCampaign, setPromoCampaign] = useState({} as PromoCampaignDto);
    const { state: stateFromLocation } = useLocation<ILocationState>();
    const [step, setStep] = useState(0);

    useEffect(() => {
        const { promoCampaign: promoCampaignFromLocation } = stateFromLocation || {};
        if (!promoCampaignFromLocation) {
            return history.push(matchPath);
        }
        setPromoCampaign({
            ...promoCampaignFromLocation,
            startDate: getFormattedDate(promoCampaignFromLocation.startDate),
            finishDate: getFormattedDate(promoCampaignFromLocation.finishDate),
        });
        setStep(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onEdit = useCallback(() => {
        const path = `${ matchPath }${ PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_EDIT }`;
        const { promoCampaign: promoCampaignFromLocation } = stateFromLocation || {};
        history.push(generatePath(path, { promoCampaignId: promoCampaignFromLocation.id }), { promoCampaign: promoCampaignFromLocation });
    }, [history, matchPath, stateFromLocation]);

    const onConfirmDelete = useCallback(async () => {
        try {
            await onConfirmDeletePromoCampaign(promoCampaign.id, promoCampaign.name);
            history.push(matchPath);
        } catch (e) {
            console.warn(e);
        }
    }, [promoCampaign.id, promoCampaign.name, history, matchPath]);

    const onDeleteClick = useCallback(() => confirmModal({
        onOk: onConfirmDelete,
        title: getDeleteTitleConfirm(promoCampaign.name),
        centered: false,
    }), [promoCampaign.name, onConfirmDelete]);

    const StepContainer = useMemo(() => {
        switch (step) {
            case 1:
                return <StepInfo promoCampaign={promoCampaign} />;
            case 2:
                return (
                    <StepTextAndImage
                        type={promoCampaign.type}
                        banners={promoCampaign.banners}
                        texts={promoCampaign.texts}
                    />
                );
            case 3:
                return <StepVisibility />;
            default:
                return null;
        }
    }, [step, promoCampaign]);

    return (
        <div className={styles.promoContainer}>
            <PromoCampaignSideBar
                active={step}
                onClick={setStep}
            />
            <div className={styles.wrapper}>
                <Header />
                {step !== 3 && (
                    <div className={styles.header}>
                        <div className={styles.title}>{promoCampaign?.name}</div>
                        <div className={styles.buttonGroup}>
                            <Button
                                type="primary"
                                onClick={onEdit}
                            >
                                {BUTTON_TEXT.EDIT}
                            </Button>
                            <PromoCampaignCopyModal promoCampaignData={stateFromLocation?.promoCampaign}>
                                <Button type="primary">
                                    {BUTTON_TEXT.COPY}
                                </Button>
                            </PromoCampaignCopyModal>
                            <Button
                                type="primary"
                                danger
                                onClick={onDeleteClick}
                            >
                                {BUTTON_TEXT.DELETE}
                            </Button>
                        </div>
                    </div>
                )}
                {StepContainer}
            </div>
        </div>
    );
};

export default PromoCampaignInfo;
