import React, { useEffect, useState } from 'react';
import { PromoCampaignFormInitialState } from '../../types';
import { CategoryDto, ClientAppDto, DzoDto } from '@types';
import noop from 'lodash/noop';
import { Input, Switch, Select, DatePicker, Form, Row, Col, Radio, SwitchProps } from 'antd';
import localeDatePicker from 'antd/es/date-picker/locale/ru_RU';
import SelectTags from '@components/SelectTags';
import ContentBlock from '@components/ContentBlock';
import { getDzoList } from '@apiServices/dzoService';
import { getActiveClientApps } from '@apiServices/clientAppService';
import { getCategoryList } from '@apiServices/categoryService';
import { getExactExternalIDPromoCampaignList, getExactFilteredPromoCampaignList } from '@apiServices/promoCampaignService';
import PROMO_CAMPAIGNS from '@constants/promoCampaigns';
import { urlCheckRule, urlHttpsRule } from '@utils/urlValidator';
import { FORM_RULES, getPatternAndMessage } from '@utils/validators';
import { getAppCode } from '@apiServices/sessionService';
import promoCodeTypes from '@constants/promoCodeTypes';
import { removeExtraSpaces, trimValue } from '@utils/helper';
import { BANNER_TYPE } from '@constants/common';

import styles from './StepInfo.module.css';
import {
    ACTIVE_PERIOD,
    BEHAVIOR_TYPE,
    CHECKOUT_SALE,
    DETAIL_BTN_TEXT,
    DETAIL_BTN_URL,
    DZO,
    EXTERNAL_ID,
    PRODUCT_OFFER_ID,
    PROMO_CAMPAIGN_CATEGORY,
    PROMO_CAMPAIGN_NAME,
    PROMO_CAMPAIGN_TYPE,
    PROMO_CAMPAIGN_URL,
    SHOW_GO_TO_LINK,
    SHOW_ONLY_IN_BUNDLE,
    PROMO_CAMPAIGN_SHOW,
    SHOW_VIDEO_TOUR,
    STATUS,
    TYPE_PROMO_CODE,
    URL_SOURCE,
    OFFER_DURATION,
} from './stepInfoConstants';

export type StepInfoProps = {
    state: PromoCampaignFormInitialState;
    isCopy: boolean | undefined;
    oldName: string;
    mode: string;
    copyPromoCampaignId: number | null;
    oldExternalId: number | null | string;
    changeTypePromo: () => void;
};


const types_promo = Object.values(promoCodeTypes);

type ReverseSwitchProps = {
    checked?: boolean;
    onChange?: (value: boolean) => void;
} & SwitchProps;

export const ReverseSwitch: React.FC<ReverseSwitchProps> = ({ checked, onChange = noop, ...restProps }) => (
    <Switch
        checked={!checked}
        onChange={(value) => onChange(!value)}
        {...restProps}
    />
);

type DisableBannersSwitchProps = {
    value?: string[];
    onChange?: (value: string[]) => void;
    controlledValue: string;
} & Omit<SwitchProps, 'checked' | 'onChange'>;

export const DisableBannersSwitch: React.FC<DisableBannersSwitchProps> = ({
    value = [],
    onChange = noop,
    controlledValue = '',
    ...restProps
}) => {
    const onChangeHandler = (checked: boolean) => {
        onChange(
            checked
                ? value.filter(el => el !== controlledValue)
                : [...value, controlledValue],
        );
    };

    return (
        <Switch
            checked={!value.includes(controlledValue)}
            onChange={onChangeHandler}
            {...restProps}
        />
    );
};

const initData = {
    dzoList: [] as DzoDto[],
    categories: [] as CategoryDto[],
    clientApps: [] as ClientAppDto[],
};

const StepInfo: React.FC<StepInfoProps> = ({
    state,
    changeTypePromo,
    isCopy,
    oldName,
    mode,
    copyPromoCampaignId,
    oldExternalId,
}) => {
    const [{ dzoList, categories, clientApps }, setData] = useState(initData);

    useEffect(() => {
        (async () => {
            const [
                { dzoDtoList = [] },
                { categoryList = [] },
                clientAppList,
            ] = await Promise.all([
                getDzoList(),
                getCategoryList(),
                getActiveClientApps(),
            ]);
            // TODO: ???????????????? ?????????????? ?????? ???????????? ?? PromoCampaignForm ?????? ???? ???????????? ???????????? ?????? ?????????????? ?????? ???????????????? ?????????? ????????
            setData({
                dzoList: dzoDtoList.filter(item => !item.deleted),
                categories: categoryList.filter(({ active }) => active),
                clientApps: clientAppList,
            });
        })();
    }, []);

    return (
        <>
            <ContentBlock className={styles.container}>
                <Row gutter={[24, 5]}>
                    <Col span={24}>
                        <Form.Item
                            className={styles.promoCampaignName}
                            label={PROMO_CAMPAIGN_NAME.label}
                            name={PROMO_CAMPAIGN_NAME.name}
                            initialValue={isCopy ? `??????????: ${state.name}` : state.name}
                            normalize={removeExtraSpaces}
                            validateFirst
                            validateTrigger="onSubmit"
                            rules={[
                                {
                                    ...FORM_RULES.REQUIRED,
                                    message: '?????????????? ???????????????? ??????????-????????????????',
                                },
                                {
                                    ...getPatternAndMessage(
                                        'promoCampaign',
                                        'name',
                                    ),
                                },
                                ({ getFieldValue }) => ({
                                    message: '???????????? ?????????????? ?????????? ??????????-???????????????? ?? ?????????? ???? ??????????????????',
                                    validator: (_, value) => {
                                        if (isCopy && typeof copyPromoCampaignId !== 'number' && value.trim() === oldName) {
                                            const appCode = getFieldValue('appCode');
                                            return appCode === getAppCode() ? Promise.reject() : Promise.resolve();
                                        }

                                        return Promise.resolve();
                                    },
                                }),
                                ({ getFieldValue }) => ({
                                    validator: async (_, value) => {
                                        const appCode = getFieldValue('appCode');

                                        if (!appCode) {
                                            throw new Error('?????? ???????????????? ?????????? ?????????? ?????????????? ??????????????!');
                                        }

                                        const nameChanged = value.trim() !== (oldName ?? '').trim();
                                        const isCopyCampaign = isCopy && typeof copyPromoCampaignId !== 'number';
                                        const isModeEditAndValueChanged = mode === 'edit' && nameChanged;
                                        if (
                                            mode === 'create' ||
                                            isModeEditAndValueChanged ||
                                            (isCopyCampaign && !nameChanged && appCode !== getAppCode())
                                        ) {
                                            const { promoCampaignDtoList = [] } = await getExactFilteredPromoCampaignList(
                                                value,
                                                appCode,
                                            );

                                            if (promoCampaignDtoList.length) {
                                                throw new Error('?????????? ???????????????? ?? ?????????? ???????????? ?????? ????????????????????! ?????????????? ???????????? ??????');
                                            }
                                        }
                                    },
                                }),
                            ]}
                        >
                            <Input placeholder={PROMO_CAMPAIGN_NAME.placeholder} />
                        </Form.Item>
                    </Col>
                    <Col span={16}>
                        <Form.Item
                            className={styles.selectCategories}
                            label={PROMO_CAMPAIGN_CATEGORY.label}
                            name={PROMO_CAMPAIGN_CATEGORY.name}
                            initialValue={state.categoryIdList}
                            normalize={(catArr) => catArr.map(Number)}
                        >
                            <SelectTags
                                data={categories}
                                nameKey="categoryName"
                                idKey="categoryId"
                                placeholder={PROMO_CAMPAIGN_CATEGORY.placeholder}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={8} className={styles.switchRow}>
                        <div className={styles.statusInfo}>
                            <div className={styles.viewInfo}>
                                <span className={styles.statusText}>
                                    {SHOW_VIDEO_TOUR.label}
                                </span>
                                <Form.Item
                                    name={SHOW_VIDEO_TOUR.name}
                                    initialValue={state.settings?.disabled_banner_types}
                                >
                                    <DisableBannersSwitch controlledValue={BANNER_TYPE.VIDEO} />
                                </Form.Item>
                            </div>
                        </div>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            noStyle
                            dependencies={[URL_SOURCE.name]}
                        >
                            {({ getFieldValue }) => (
                                <Form.Item
                                    label={PROMO_CAMPAIGN_URL.label}
                                    className={styles.formItem}
                                    name={PROMO_CAMPAIGN_URL.name}
                                    validateTrigger="onSubmit"
                                    rules={[
                                        {
                                            required: (
                                                getFieldValue(URL_SOURCE.name) === URL_SOURCE.buttonsValue.PROMO_CAMPAIGN
                                            ),
                                            message: '?????????????? ????????????',
                                        },
                                        urlHttpsRule,
                                        urlCheckRule,
                                    ]}
                                    initialValue={decodeURI(state.webUrl || '')}
                                >
                                    <Input placeholder={PROMO_CAMPAIGN_URL.placeholder} />
                                </Form.Item>
                            )}
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            name={URL_SOURCE.name}
                            label={URL_SOURCE.label}
                            rules={[
                                {
                                    ...FORM_RULES.REQUIRED,
                                    message: '?????????????? ???????????????? ???????????? ?????? QR-????????',
                                },
                            ]}
                            initialValue={
                                state.settings.priority_on_web_url === true
                                    ? URL_SOURCE.buttonsValue.PROMO_CAMPAIGN
                                    : URL_SOURCE.buttonsValue.DZO}
                        >
                            <Radio.Group className={styles.urlSource}>
                                <Radio value={URL_SOURCE.buttonsValue.DZO}>
                                    {URL_SOURCE.buttonsLabel.DZO}
                                </Radio>
                                <Radio value={URL_SOURCE.buttonsValue.PROMO_CAMPAIGN}>
                                    {URL_SOURCE.buttonsLabel.PROMO_CAMPAIGN}
                                </Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>

                    <Col span={8} className={styles.switchRow}>
                        <div className={styles.statusInfo}>
                            <div className={styles.viewInfo}>
                                <span className={styles.statusText}>
                                    {SHOW_GO_TO_LINK.label}
                                </span>
                                <Form.Item
                                    name={SHOW_GO_TO_LINK.name}
                                    initialValue={state.settings?.alternative_offer_mechanic || false}
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </div>
                        </div>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            label={DZO.label}
                            className={styles.formItem}
                            name={DZO.name}
                            initialValue={state.dzoId}
                            rules={[
                                {
                                    ...FORM_RULES.REQUIRED,
                                    message: '???????????????? ??????',
                                },
                            ]}
                            validateTrigger="onSubmit"
                        >
                            <Select placeholder={DZO.placeholder}>
                                {dzoList.map(option => (
                                    <Select.Option key={option.dzoCode} value={option.dzoId}>
                                        {option.dzoName} ({option.dzoCode})
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            label={ACTIVE_PERIOD.label}
                            className={styles.formItem}
                            name={ACTIVE_PERIOD.name}
                            initialValue={state.datePicker}
                        >
                            <DatePicker.RangePicker
                                locale={localeDatePicker}
                                placeholder={ACTIVE_PERIOD.placeholder}
                                allowEmpty={[true, true]}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8} className={styles.switchRow}>
                        <div className={styles.statusInfo}>
                            <div className={styles.viewInfo}>
                                <span className={styles.statusText}>
                                    {SHOW_ONLY_IN_BUNDLE.label}
                                </span>
                                <Form.Item
                                    name={SHOW_ONLY_IN_BUNDLE.name}
                                    initialValue={state.standalone}
                                    valuePropName="checked"
                                >
                                    <ReverseSwitch />
                                </Form.Item>
                            </div>
                        </div>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            label={TYPE_PROMO_CODE.label}
                            className={styles.formItem}
                            name={TYPE_PROMO_CODE.name}
                            initialValue={state.promoCodeType}
                            rules={[
                                {
                                    ...FORM_RULES.REQUIRED,
                                    message: '???????????????? ?????? ????????????????????',
                                },
                            ]}
                            validateTrigger="onSubmit"
                        >
                            <Select placeholder={TYPE_PROMO_CODE.label}>
                                {types_promo.map(type => (
                                    <Select.Option
                                        key={type.value}
                                        value={type.value}
                                        disabled={type.disabled}
                                    >
                                        {`${type.label} ${type.description}`}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            label={EXTERNAL_ID.label}
                            className={styles.formItem}
                            name={EXTERNAL_ID.name}
                            initialValue={state.externalId}
                            validateFirst
                            normalize={trimValue}
                            dependencies={[CHECKOUT_SALE.name]}
                            rules={[
                                ({ getFieldValue }) => ({
                                    required: getFieldValue(CHECKOUT_SALE.name),
                                    message: EXTERNAL_ID.requiredError,
                                }),
                                {
                                    validator: (_, value) => {
                                        const copyIdExists = typeof copyPromoCampaignId !== 'number';

                                        if (value && isCopy && value === oldExternalId && copyIdExists) {
                                            return Promise.reject();
                                        }
                                        return Promise.resolve();
                                    },
                                    message: EXTERNAL_ID.duplicateError,
                                    validateTrigger: 'onSubmit',
                                },
                                {
                                    validator: async (_, value) => {
                                        if (value) {
                                            const { promoCampaignDtoList = [] } = await getExactExternalIDPromoCampaignList(value);
                                            if (promoCampaignDtoList.length && value !== oldExternalId) {
                                                throw new Error();
                                            }
                                        }
                                    },
                                    message: EXTERNAL_ID.duplicateError,
                                    validateTrigger: 'onSubmit',
                                },
                            ]}
                        >
                            <Input maxLength={64} placeholder={EXTERNAL_ID.placeholder} />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            noStyle
                            dependencies={[STATUS.name]}
                        >
                            {({ getFieldValue }) => {
                                const active = getFieldValue(STATUS.name);

                                return (
                                    <div className={styles.statusInfo}>
                                        <div>
                                            {STATUS.label[active ? 'ON' : 'OFF']}
                                        </div>
                                        <div className={styles.viewInfo}>
                                            <span className={styles.statusText}>
                                                {STATUS.description[active ? 'ON' : 'OFF']}
                                            </span>
                                            <Form.Item
                                                name={STATUS.name}
                                                valuePropName="checked"
                                                initialValue={state.active}
                                            >
                                                <Switch />
                                            </Form.Item>
                                        </div>
                                    </div>
                                );
                            }}
                        </Form.Item>
                    </Col>

                    <Col span={8} className={styles.switchRow}>
                        <Form.Item
                            name={BEHAVIOR_TYPE.name}
                            initialValue={state.behaviorType}
                            label={BEHAVIOR_TYPE.label}
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={8} className={styles.switchRow}>
                        <Form.Item
                            name={CHECKOUT_SALE.name}
                            initialValue={state.settings.sale_enabled}
                            label={CHECKOUT_SALE.label}
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={8} className={styles.switchRow} >
                        <Form.Item
                            noStyle
                            dependencies={[CHECKOUT_SALE.name]}
                        >
                            {({ getFieldValue }) => {
                                const isActiveCheckout = getFieldValue(CHECKOUT_SALE.name);

                                return (
                                    <Form.Item
                                        label={PRODUCT_OFFER_ID.label}
                                        className={styles.formItem}
                                        hidden={!isActiveCheckout}
                                        name={PRODUCT_OFFER_ID.name}
                                        normalize={trimValue}
                                        initialValue={state.productOfferingId}
                                        rules={[
                                            {
                                                required: isActiveCheckout,
                                                message: PRODUCT_OFFER_ID.requiredError,
                                            },
                                            {
                                                ...getPatternAndMessage(
                                                    'promoCampaign',
                                                    'productOfferingId',
                                                ),
                                                validateTrigger: 'onSubmit',
                                            },
                                        ]}
                                    >
                                        <Input maxLength={36} placeholder={PRODUCT_OFFER_ID.placeholder} />
                                    </Form.Item>
                                );
                            }}
                        </Form.Item>
                    </Col>

                    <Col span={16} className={styles.formGroup}>
                        <span className={styles.formGroupLabel}>
                            ?????????????????? ?????????????????? ????????????
                        </span>
                        <Col span={12}>
                            <Form.Item
                                className={styles.formItem}
                                name={DETAIL_BTN_TEXT.name}
                                label={DETAIL_BTN_TEXT.label}
                                initialValue={state.settings.details_button_label}
                                normalize={removeExtraSpaces}
                                rules={[
                                    {
                                        ...getPatternAndMessage(
                                            'promoCampaign',
                                            'detailsButtonLabel',
                                        ),
                                        validateTrigger: 'onSubmit',
                                    },
                                ]}
                            >
                                <Input
                                    placeholder={DETAIL_BTN_TEXT.placeholder}
                                    maxLength={30}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                className={styles.formItem}
                                name={DETAIL_BTN_URL.name}
                                label={DETAIL_BTN_URL.label}
                                initialValue={state.settings.details_button_url}
                                normalize={removeExtraSpaces}
                                rules={[
                                    urlHttpsRule,
                                    urlCheckRule,
                                ]}
                            >
                                <Input placeholder={DETAIL_BTN_URL.placeholder} />
                            </Form.Item>
                        </Col>
                    </Col>
                </Row>

            </ContentBlock>

            <div className={styles.infoDetail}>
                <Row gutter={24}>
                    <Col span={12}>
                        <ContentBlock>
                            <Form.Item
                                name={PROMO_CAMPAIGN_SHOW.name}
                                label={PROMO_CAMPAIGN_SHOW.label}
                                initialValue={state.appCode}
                                rules={[
                                    {
                                        ...FORM_RULES.REQUIRED,
                                        message: '???????????????? ??????????????',
                                    },
                                ]}
                                validateTrigger="onSubmit"
                            >
                                <Select placeholder={PROMO_CAMPAIGN_SHOW.placeholder}>
                                    {clientApps.map(({ code, displayName }) => (
                                        <Select.Option value={code} key={code}>
                                            {displayName}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </ContentBlock>
                    </Col>

                    <Col span={12}>
                        <ContentBlock>
                            <Form.Item
                                name={PROMO_CAMPAIGN_TYPE.name}
                                label={PROMO_CAMPAIGN_TYPE.label}
                                rules={[
                                    {
                                        ...FORM_RULES.REQUIRED,
                                        message: '?????????????? ?????? ??????????-????????????????',
                                    },
                                ]}
                                initialValue={state.type}
                                validateTrigger="onSubmit"
                            >
                                <Radio.Group onChange={changeTypePromo}>
                                    <Radio
                                        className={styles.checkbox}
                                        value={PROMO_CAMPAIGNS.NORMAL.value}
                                    >
                                        {PROMO_CAMPAIGNS.NORMAL.label}
                                    </Radio>
                                    <Radio
                                        className={styles.checkbox}
                                        value={PROMO_CAMPAIGNS.PRESENT.value}
                                    >
                                        {PROMO_CAMPAIGNS.PRESENT.label}
                                    </Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item
                                name={OFFER_DURATION.name}
                                initialValue={state.offerDuration}
                            >
                                <Input />
                            </Form.Item>
                        </ContentBlock>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default StepInfo;
