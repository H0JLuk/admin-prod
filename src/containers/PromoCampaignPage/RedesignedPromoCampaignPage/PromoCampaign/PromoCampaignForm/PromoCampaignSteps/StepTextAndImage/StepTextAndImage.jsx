import React, { useCallback } from 'react';
import Template from './Templates/Template';
import { Form } from 'antd';
import { steps } from '../../PromoCampaignFormConstants';
import PROMO_CAMPAIGNS from '../../../../../../../constants/promoCampaigns';
import styles from './StepTextAndImage.module.css';

const templateTypes = {
    excursion: 'excursion',
    gift: 'gift',
};

const StepTextAndImage = ({ state, handlerNextStep, validStepChange, addChangedImg }) => {
    const [form] = Form.useForm();
    const { typePromoCampaign } = state;

    const onFinish = useCallback((val) => {
        validStepChange(steps.visibility);
        handlerNextStep(Object.keys(val).reduce((result, key) => {
            const [fieldType, fieldName] = key.split('.');
            const value = val[key];

            return {
                ...result,
                [fieldType]: {
                    ...result[fieldType],
                    [fieldName]: value
                }
            };
        }, {}));
    }, [handlerNextStep, validStepChange]);

    const onRemoveImg = useCallback((name) => form.setFieldsValue({ [name]: [] }), [form]);

    /** @type {import('antd/lib/form').FormProps['onFieldsChange']} */
    const isChanged = useCallback(changedFields => {
        if (changedFields.some(({ touched }) => touched)) {
            validStepChange(steps.textAndBanners, false);
        }

        if (changedFields.length === 1) {
            const [fieldName] = changedFields[0].name;
            const [, imgTypeName] = String(fieldName).split('.');
            addChangedImg(imgTypeName);
        }
    }, [validStepChange, addChangedImg]);

    return (
        <Form
            id="info"
            form={ form }
            className={ styles.containerStep }
            onFinish={ onFinish }
            onFieldsChange={ isChanged }
        >
            <div className={ styles.containerStep }>
                {typePromoCampaign === PROMO_CAMPAIGNS.NORMAL.value && (
                    <div className={ styles.infoDetail }>
                        <div className={ styles.title }>{ PROMO_CAMPAIGNS.NORMAL.label }</div>
                        <div className={ styles.container }>
                            <Template
                                banners={ state.promoCampaignBanners }
                                texts={ state.promoCampaignTexts }
                                onRemoveImg={ onRemoveImg }
                                type= { templateTypes.excursion }
                            />
                        </div>
                    </div>
                )}
                {typePromoCampaign === PROMO_CAMPAIGNS.PRESENT.value && (
                    <div className={ styles.infoDetail }>
                        <div className={ styles.title }>{ PROMO_CAMPAIGNS.PRESENT.label }</div>
                        <div className={ styles.container }>
                            <Template
                                banners={ state.promoCampaignBanners }
                                texts={ state.promoCampaignTexts }
                                onRemoveImg={ onRemoveImg }
                                type= { templateTypes.gift }
                            />
                        </div>
                    </div>
                )}
            </div>
        </Form>
    );
};

export default StepTextAndImage;
