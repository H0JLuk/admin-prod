import React, { useCallback } from 'react';
import Template from './Templates/Template';
import { Form } from 'antd';
import { steps } from '../../PromoCampaignFormConstants';
import PROMO_CAMPAIGNS from '../../../../../../constants/promoCampaigns';
import styles from './StepTextAndImage.module.css';

const templateTypes = {
    excursion: 'excursion',
    gift: 'gift',
};

const StepTextAndImage = ({
    typePromoCampaign,
    handlerNextStep,
    validStepChange,
    addChangedImg,
    banners,
    texts,
    isCopy,
}) => {
    const [form] = Form.useForm();

    const onFinish = useCallback((val) => {
        validStepChange(steps.landing);
        handlerNextStep(val, isCopy);
    }, [handlerNextStep, validStepChange, isCopy]);

    const onRemoveImg = useCallback((name) => {
        form.setFields([{ name, value: [] }]);
        addChangedImg(name[1]);
    }, [form, addChangedImg]);

    /** @type {import('antd/lib/form').FormProps['onFieldsChange']} */
    const isChanged = useCallback(changedFields => {
        if (changedFields.some(({ touched }) => touched)) {
            validStepChange(steps.textAndBanners, false);
        }

        if (changedFields.length === 1) {
            const [, fieldName] = changedFields[0].name;
            addChangedImg(fieldName);
        }
    }, [validStepChange, addChangedImg]);

    const templateProps = {
        banners,
        texts,
        onRemoveImg,
    };

    return (
        <Form
            id="info"
            form={ form }
            className={ styles.containerStep }
            onFinish={ onFinish }
            onFieldsChange={ isChanged }
            layout='vertical'
        >
            <div className={ styles.containerStep }>
                {typePromoCampaign === PROMO_CAMPAIGNS.NORMAL.value && (
                    <div className={ styles.infoDetail }>
                        <div className={ styles.title }>{ PROMO_CAMPAIGNS.NORMAL.label }</div>
                        <div className={ styles.container }>
                            <Template
                                { ...templateProps }
                                type={ templateTypes.excursion }
                            />
                        </div>
                    </div>
                )}
                {typePromoCampaign === PROMO_CAMPAIGNS.PRESENT.value && (
                    <div className={ styles.infoDetail }>
                        <div className={ styles.title }>{ PROMO_CAMPAIGNS.PRESENT.label }</div>
                        <div className={ styles.container }>
                            <Template
                                { ...templateProps }
                                type={ templateTypes.gift }
                            />
                        </div>
                    </div>
                )}
            </div>
        </Form>
    );
};

export default StepTextAndImage;
