import React, { useEffect, useState } from 'react';
import { PromoCampaignFormInitialState } from '../../types';
import { CategoryDto, ClientAppDto, DzoDto } from '@types';
import noop from 'lodash/noop';
import { Input, Switch, Select, DatePicker, Form, Row, Col, Radio, SwitchProps } from 'antd';
import localeDatePicker from 'antd/es/date-picker/locale/ru_RU';
import SelectTags from '@components/SelectTags';
import { getDzoList } from '@apiServices/dzoService';
import { getActiveClientApps } from '@apiServices/clientAppService';
import { getCategoryList } from '@apiServices/categoryService';
import { getExactExternalIDPromoCampaignList, getExactFilteredPromoCampaignList } from '@apiServices/promoCampaignService';
import { TOOLTIP_TEXT_FOR_URL_LABEL } from '@constants/jsxConstants';
import PROMO_CAMPAIGNS from '@constants/promoCampaigns';
import { urlCheckRule } from '@utils/urlValidator';
import { FORM_RULES, getPatternAndMessage } from '@utils/validators';
import { getLabel } from '@components/LabelWithTooltip/LabelWithTooltip';
import { getAppCode } from '@apiServices/sessionService';
import promoCodeTypes from '@constants/promoCodeTypes';
import { removeExtraSpaces, trimValue } from '@utils/helper';
import { BANNER_TYPE } from '@constants/common';

import styles from './StepInfo.module.css';

export type StepInfoProps = {
    state: PromoCampaignFormInitialState;
    isCopy: boolean | undefined;
    oldName: string;
    mode: string;
    copyPromoCampaignId: number | null;
    oldExternalId: number | null | string;
    changeTypePromo: () => void;
};

const SELECT = 'Выбрать';
const URL = 'URL';
const NAME_PROMO_CAMPAIGN = 'Название промо-кампании';
const CATEGORY = 'Категории';
const CATEGORY_PROMO_CAMPAIGN = 'Выберите категорию';
const TEMPLATE_PROMO_NAME = 'Например: Промо-кампания СберМаркет';
const URL_PROMO_CAMPAIGN = 'Ссылка на промо-кампанию';
const TYPE_PROMO_CAMPAIGN = 'Тип промо-кампании';
const TYPE_PROMO_CODE = 'Тип промокода';
const ACTIVE_PERIOD = 'Период действия';
const CHOOSE_SHOWCASE = 'Выберите витрину';
const SHOW_PROMO_CAMPAIGN = 'Витрина, в которой показывать промо-кампанию';
const DZO = 'ДЗО';
const STATUS_ON = 'Промо-кампания включена';
const STATUS_OFF = 'Промо-кампания отключена';
const DATE_PICKER_PLACEHOLDER: [string, string] = ['дд.мм.гг', 'дд.мм.гг'];
const STATUS_TEXT_OFF = 'Пользователи не видят промо-кампанию';
const STATUS_TEXT_ON = 'Пользователи видят промо-кампанию';
const URL_SOURCE_LABEL = 'Источник ссылки';
const URL_SOURCE_VALUE_DZO = 'DZO';
const URL_SOURCE_VALUE_PROMO_CAMPAIGN = 'PROMO_CAMPAIGN';
const URL_SOURCE_DZO_LABEL = 'ДЗО';
const URL_SOURCE_PROMO_CAMPAIGN_LABEL = 'Промо-кампания';
const SHOW_VIDEO_TOUR_LABEL = 'Отображать видеоэкскурсию';
const SHOW_GO_TO_LINK_LABEL = 'Отображать кнопку "Перейти на сайт"';
const SHOW_ONLY_IN_BUNDLE = 'Отображать только в составе бандла';
const EXTERNAL_ID_LABEL = 'Внешний ID';
const EXTERNAL_ID_PLACEHOLDER = 'Введите внешний ID';
const EXTERNAL_ID_DUPLICATE = 'Введенный внешний ID уже используется в другой промо-кампании';
const DETAIL_BTN_LABEL = 'Текст кнопки';
const DETAIL_BTN_URL = 'Ссылка для кнопки';
const BEHAVIOR_TYPE_LABEL = 'Отображать QR-код';
const types_promo = Object.values(promoCodeTypes);

const namePathPriorityOnWebUrl = ['settings', 'priority_on_web_url'];
const namePathAlternativeOfferMechanic = ['settings', 'alternative_offer_mechanic'];
const namePathDisableBannerTypes = ['settings', 'disabled_banner_types'];
const detailsButtonLabelName = ['settings', 'details_button_label'];
const detailsButtonURLName = ['settings', 'details_button_url'];

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

const StepInfo: React.FC<StepInfoProps> = ({
    state,
    changeTypePromo,
    isCopy,
    oldName,
    mode,
    copyPromoCampaignId,
    oldExternalId,
}) => {
    const [dzoList, setDzoList] = useState<DzoDto[]>([]);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [clientApps, setClientApps] = useState<ClientAppDto[]>([]);

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
            // TODO: Переделать вызов setState на рефки или на один стейт. И возможно вынести эту логику в PromoCampaignForm что не делать каждый раз запросы при открытии этого шага
            setDzoList(dzoDtoList.filter(item => !item.deleted));
            setCategories(categoryList.filter(({ active }) => active));
            setClientApps(clientAppList);
        })();
    }, []);

    return (
        <>
            <div className={styles.container}>
                <Row gutter={[24, 5]}>
                    <Col span={24}>
                        <Form.Item
                            className={styles.promoCampaignName}
                            label={NAME_PROMO_CAMPAIGN}
                            name="name"
                            initialValue={isCopy ? `Копия: ${state.name}` : state.name}
                            normalize={removeExtraSpaces}
                            validateFirst
                            rules={[
                                {
                                    ...FORM_RULES.REQUIRED,
                                    message: 'Укажите название промо-кампании',
                                },
                                {
                                    ...getPatternAndMessage('promoCampaign', 'name'),
                                    validateTrigger: 'onSubmit',
                                },
                                ({ getFieldValue }) => ({
                                    message: 'Нельзя создать копию промо-кампании с таким же названием',
                                    validator: (_, value) => {
                                        if (isCopy && typeof copyPromoCampaignId !== 'number' && value.trim() === oldName) {
                                            const appCode = getFieldValue('appCode');
                                            return appCode === getAppCode() ? Promise.reject() : Promise.resolve();
                                        }

                                        return Promise.resolve();
                                    },
                                    validateTrigger: 'onSubmit',
                                }),
                                ({ getFieldValue }) => ({
                                    validator: async (_, value) => {
                                        const appCode = getFieldValue('appCode');

                                        if (!appCode) {
                                            throw new Error('Для проверки имени нужно выбрать витрину!');
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
                                                throw new Error('Промо кампания с таким именем уже существует! Введите другое имя');
                                            }
                                        }
                                    },
                                    validateTrigger: 'onSubmit',
                                }),
                            ]}
                        >
                            <Input placeholder={TEMPLATE_PROMO_NAME} />
                        </Form.Item>
                    </Col>
                    <Col span={16}>
                        <Form.Item
                            className={styles.selectCategories}
                            label={CATEGORY}
                            name="categoryIdList"
                            initialValue={state.categoryIdList}
                            normalize={(catArr) => catArr.map(Number)}
                        >
                            <SelectTags
                                data={categories}
                                nameKey="categoryName"
                                idKey="categoryId"
                                placeholder={CATEGORY_PROMO_CAMPAIGN}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={8} className={styles.switchRow}>
                        <div className={styles.statusInfo}>
                            <div className={styles.viewInfo}>
                                <span className={styles.statusText}>
                                    {SHOW_VIDEO_TOUR_LABEL}
                                </span>
                                <Form.Item
                                    name={namePathDisableBannerTypes}
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
                            dependencies={[namePathPriorityOnWebUrl]}
                        >
                            {({ getFieldValue }) => (
                                <Form.Item
                                    label={getLabel(URL_PROMO_CAMPAIGN, TOOLTIP_TEXT_FOR_URL_LABEL)}
                                    className={styles.formItem}
                                    name="webUrl"
                                    validateTrigger="onSubmit"
                                    rules={[
                                        {
                                            required: (
                                                getFieldValue(namePathPriorityOnWebUrl) === URL_SOURCE_VALUE_PROMO_CAMPAIGN
                                            ),
                                            message: 'Укажите ссылку',
                                        },
                                        urlCheckRule,
                                    ]}
                                    initialValue={decodeURI(state.webUrl || '')}
                                >
                                    <Input placeholder={URL} />
                                </Form.Item>
                            )}
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            name={namePathPriorityOnWebUrl}
                            label={URL_SOURCE_LABEL}
                            rules={[
                                {
                                    ...FORM_RULES.REQUIRED,
                                    message: 'Укажите источник ссылки для QR-кода',
                                },
                            ]}
                            initialValue={
                                state.settings.priority_on_web_url === true
                                    ? URL_SOURCE_VALUE_PROMO_CAMPAIGN
                                    : URL_SOURCE_VALUE_DZO}
                        >
                            <Radio.Group className={styles.urlSource}>
                                <Radio value={URL_SOURCE_VALUE_DZO}>
                                    {URL_SOURCE_DZO_LABEL}
                                </Radio>
                                <Radio value={URL_SOURCE_VALUE_PROMO_CAMPAIGN}>
                                    {URL_SOURCE_PROMO_CAMPAIGN_LABEL}
                                </Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>

                    <Col span={8} className={styles.switchRow}>
                        <div className={styles.statusInfo}>
                            <div className={styles.viewInfo}>
                                <span className={styles.statusText}>
                                    {SHOW_GO_TO_LINK_LABEL}
                                </span>
                                <Form.Item
                                    name={namePathAlternativeOfferMechanic}
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
                            label={DZO}
                            className={styles.formItem}
                            name="dzoId"
                            initialValue={state.dzoId}
                            rules={[
                                {
                                    ...FORM_RULES.REQUIRED,
                                    message: 'Выберите ДЗО',
                                },
                            ]}
                        >
                            <Select placeholder={SELECT}>
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
                            label={ACTIVE_PERIOD}
                            className={styles.formItem}
                            name="datePicker"
                            initialValue={state.datePicker}
                        >
                            <DatePicker.RangePicker
                                locale={localeDatePicker}
                                placeholder={DATE_PICKER_PLACEHOLDER}
                                allowEmpty={[true, true]}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8} className={styles.switchRow}>
                        <div className={styles.statusInfo}>
                            <div className={styles.viewInfo}>
                                <span className={styles.statusText}>
                                    {SHOW_ONLY_IN_BUNDLE}
                                </span>
                                <Form.Item
                                    name="standalone"
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
                            label={TYPE_PROMO_CODE}
                            className={styles.formItem}
                            name="promoCodeType"
                            initialValue={state.promoCodeType}
                            rules={[
                                {
                                    ...FORM_RULES.REQUIRED,
                                    message: 'Выберите тип промокодов',
                                },
                            ]}
                        >
                            <Select placeholder={SELECT}>
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
                            label={EXTERNAL_ID_LABEL}
                            className={styles.formItem}
                            name="externalId"
                            initialValue={state.externalId}
                            validateFirst
                            normalize={trimValue}
                            rules={[
                                {
                                    validator: (_, value) => {
                                        const copyIdExists = typeof copyPromoCampaignId !== 'number';

                                        if (value && isCopy && value === oldExternalId && copyIdExists) {
                                            return Promise.reject();
                                        }
                                        return Promise.resolve();
                                    },
                                    message: EXTERNAL_ID_DUPLICATE,
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
                                    message: EXTERNAL_ID_DUPLICATE,
                                    validateTrigger: 'onSubmit',
                                },
                            ]}
                        >
                            <Input maxLength={64} placeholder={EXTERNAL_ID_PLACEHOLDER} />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            noStyle
                            dependencies={['active']}
                        >
                            {({ getFieldValue }) => {
                                const active = getFieldValue('active');

                                return (
                                    <div className={styles.statusInfo}>
                                        <div>
                                            {active ? STATUS_ON : STATUS_OFF}
                                        </div>
                                        <div className={styles.viewInfo}>
                                            <span className={styles.statusText}>
                                                {active ? STATUS_TEXT_ON : STATUS_TEXT_OFF}
                                            </span>
                                            <Form.Item
                                                name="active"
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
                            name="behaviorType"
                            initialValue={state.behaviorType}
                            label={BEHAVIOR_TYPE_LABEL}
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={16} className={styles.formGroup}>
                        <span className={styles.formGroupLabel}>
                            Настройки детальной кнопки
                        </span>
                        <Col span={12}>
                            <Form.Item
                                className={styles.formItem}
                                name={detailsButtonLabelName}
                                label={DETAIL_BTN_LABEL}
                                initialValue={state.settings.details_button_label}
                                normalize={removeExtraSpaces}
                                rules={[
                                    {
                                        ...getPatternAndMessage('promoCampaign', 'detailsButtonLabel'),
                                        validateTrigger: 'onSubmit',
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Детали"
                                    maxLength={30}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                className={styles.formItem}
                                name={detailsButtonURLName}
                                label={DETAIL_BTN_URL}
                                initialValue={state.settings.details_button_url}
                                normalize={removeExtraSpaces}
                                rules={[
                                    urlCheckRule,
                                ]}
                            >
                                <Input placeholder={URL} />
                            </Form.Item>
                        </Col>
                    </Col>
                </Row>

            </div>

            <div className={styles.infoDetail}>
                <Row gutter={24}>
                    <Col span={12}>
                        <div className={styles.container}>
                            <Form.Item
                                name="appCode"
                                label={SHOW_PROMO_CAMPAIGN}
                                initialValue={state.appCode}
                                rules={[
                                    {
                                        ...FORM_RULES.REQUIRED,
                                        message: 'Выберите витрину',
                                    },
                                ]}
                            >
                                <Select placeholder={CHOOSE_SHOWCASE}>
                                    {clientApps.map(({ code, displayName }) => (
                                        <Select.Option value={code} key={code}>
                                            {displayName}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                    </Col>

                    <Col span={12}>
                        <div className={styles.container}>
                            <Form.Item
                                name="type"
                                label={TYPE_PROMO_CAMPAIGN}
                                rules={[
                                    {
                                        ...FORM_RULES.REQUIRED,
                                        message: 'Укажите тип промо-кампании',
                                    },
                                ]}
                                initialValue={state.type}
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
                                    {/* <Radio
                                        className={styles.checkbox}
                                        value="landing"
                                    >
                                        {LANDING}
                                    </Radio> */}
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item
                                hidden
                                name="offerDuration"
                                initialValue={state.offerDuration}
                            >
                                <Input />
                            </Form.Item>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default StepInfo;
