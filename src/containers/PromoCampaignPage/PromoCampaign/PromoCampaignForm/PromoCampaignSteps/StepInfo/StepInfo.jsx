import React, { useCallback, useEffect, useMemo, useState } from 'react';
import noop from 'lodash/noop';
import { Input, Switch, Select, DatePicker, Form, Row, Col, Radio, Checkbox } from 'antd';
import localeDatePicker from 'antd/es/date-picker/locale/ru_RU';
import { CloseOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { getDzoList } from '../../../../../../api/services/dzoService';
import { getClientAppList } from '../../../../../../api/services/clientAppService';
import { getCategoryList } from '../../../../../../api/services/categoryService';
import { getExactExternalIDPromoCampaignList, getExactFilteredPromoCampaignList } from '../../../../../../api/services/promoCampaignService';
import promoCodeTypes from '../../../../../../constants/promoCodeTypes';
import { TOOLTIP_TEXT_FOR_URL_LABEL } from '../../../../../../constants/jsxConstants';
import { URL_REGEXP } from '../../../../../../constants/common';
import PROMO_CAMPAIGNS from '../../../../../../constants/promoCampaigns';
import { getLabel } from '../../../../../../components/LabelWithTooltip/LabelWithTooltip';
import { getAppCode } from '../../../../../../api/services/sessionService';

import { ReactComponent as Cross } from '../../../../../../static/images/cross.svg';

import styles from './StepInfo.module.css';

const SELECT = 'Выбрать';
const URL = 'url';
const NAME_PROMO_CAMPAIGN = 'Название промо-кампании';
const CATEGORY = 'Категории';
const CATEGORY_PROMO_CAMPAIGN = 'Выберите категорию';
const TEMPLATE_PROMO_NAME = 'Например: Промо-кампания СберМаркет';
const URL_PROMO_CAMPAIGN = 'Ссылка на промо-кампанию';
const TYPE_PROMO_CAMPAIGN = 'Тип промо-кампании';
const TYPE_PROMO_CODE = 'Тип промокода';
const ACTIVE_PERIOD = 'Период действия';
const CHOOSE_SHOWCASE = 'Выберите витрину';
const SHOW_PROMO_CAMPAIGN = 'Витрины, в которых показывать промо-кампанию';
const DZO = 'ДЗО';
const STATUS_ON = 'Промо-кампания включена';
const STATUS_OFF = 'Промо-кампания отключена';
const DATE_PICKER_PLACEHOLDER = ['дд.мм.гг', 'дд.мм.гг'];
const STATUS_TEXT_OFF = 'Пользователи не видят промо-кампанию';
const STATUS_TEXT_ON = 'Пользователи видят промо-кампанию';
const URL_SOURCE_LABEL = 'Источник ссылки';
const URL_SOURCE_VALUE_DZO = 'DZO';
const URL_SOURCE_VALUE_PROMO_CAMPAIGN = 'PROMO_CAMPAIGN';
const URL_SOURCE_DZO_LABEL = 'ДЗО';
const URL_SOURCE_PROMO_CAMPAIGN_LABEL = 'Промо-кампания';
const SHOW_GO_TO_LINK_LABEL = 'Отображать кнопку "Перейти на сайт"';
const SHOW_ONLY_IN_BUNDLE = 'Отображать только в составе бандла';
const EXTERNAL_ID_LABEL = 'Внешний ID';
const EXTERNAL_ID_PLACEHOLDER = 'Введите внешний ID';
const EXTERNAL_ID_DUPLICATE = 'Введенный внешний ID уже используется в другой промо-кампании';
const types_promo = Object.values(promoCodeTypes);

const namePathPriorityOnWebUrl = ['settings', 'priorityOnWebUrl'];
const namePathAlternativeOfferMechanic = [ 'settings', 'alternativeOfferMechanic' ];

const selectTagRender = ({ label, onClose }) => (
    <div className={ styles.tagSelect }>
        <p className={ styles.selectText }>{ label[1] }</p>
        <Cross height="15px" width="15px" color="#09A552" onClick={ onClose } />
    </div>
);

const ReverseSwitch = ({ checked, onChange = noop, ...restProps }) => (
    <Switch
        checked={ !checked }
        onChange={ (value) => onChange(!value) }
        { ...restProps }
    />
);

const StepInfo = ({
    state,
    changeTypePromo,
    isCopy,
    oldName,
    mode,
    setFieldsValue,
    copyPromoCampaignId,
    oldExternalId,
}) => {
    const [dzoList, setDzoList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [clientApps, setClientApps] = useState([]);
    const [selectCategory, setSelectCategory] = useState(state.categoryIdList ?? []);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        (async () => {
            const [
                { dzoDtoList = [] },
                { categoryList = [] },
                { clientApplicationDtoList: allApps = [] }
            ] = await Promise.all([
                getDzoList(),
                getCategoryList(),
                getClientAppList(),
            ]);
            // TODO: Переделать вызов setState на рефки или на один стейт. И возможно вынести эту логику в PromoCampaignForm что не делать каждый раз запросы при открытии этого шага
            setDzoList(dzoDtoList.filter(item => !item.isDeleted));
            setCategories(categoryList.filter(({ active }) => active));
            setClientApps(allApps.filter(({ isDeleted }) => !isDeleted));
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // TODO: remove this after change multi-select component
    const clearSelect = useCallback((name) => () => {
        setFieldsValue({ [name]: [] });
        setSelectCategory([]);
    }, [setFieldsValue]);

    const toggleSelect = useCallback(() => setOpen(prev => !prev), []);

    // TODO: remove this after change multi-select component
    const renderSelectSuffix = useMemo(() => (
        <div className={ styles.suffixBlock }>
            { open
                ? <UpOutlined className={ styles.icon } onClick={ toggleSelect } />
                : <DownOutlined className={ styles.icon } onClick={ toggleSelect } />
            }
            { Boolean(selectCategory.length) && (
                <>
                    <CloseOutlined
                        className={ styles.icon }
                        onClick={ clearSelect('categoryIdList') }
                    />
                    <div className={ styles.selectCount }>
                        { selectCategory.length }
                    </div>
                </>
            ) }
        </div>
    ), [open, toggleSelect, selectCategory.length, clearSelect]);

    return (
        <>
            <div className={ styles.container }>
                <Form.Item
                    label={ NAME_PROMO_CAMPAIGN }
                    className={ styles.promoCampaignName }
                    name="name"
                    initialValue={ isCopy ? `Копия: ${state.name}` : state.name }
                    normalize={ (value) => !value.trim() ? value.trim() : value }
                    validateFirst
                    rules={ [
                        { required: true, message: 'Укажите название промо-кампании', validateTrigger: 'onSubmit' },
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

                                const isModeCreate = mode === 'create';
                                const nameChanged = value.trim() !== (oldName ?? '').trim();
                                const isCopyCampaign = isCopy && typeof copyPromoCampaignId !== 'number';
                                const isModeEditAndValueChanged = mode === 'edit' && nameChanged;

                                if (isModeCreate || isModeEditAndValueChanged || (isCopyCampaign && !nameChanged && appCode !== getAppCode())) {
                                    const { promoCampaignDtoList = [] } = await getExactFilteredPromoCampaignList(
                                        value,
                                        appCode
                                    );

                                    if (promoCampaignDtoList.length) {
                                        throw new Error('Промо кампания с таким именем уже существует! Введите другое имя');
                                    }
                                }
                            },
                            validateTrigger: 'onSubmit',
                        }),
                    ] }
                >
                    <Input placeholder={ TEMPLATE_PROMO_NAME } />
                </Form.Item>
                <Form.Item
                    label={ CATEGORY }
                    className={ styles.selectCategories }
                    name="categoryIdList"
                    initialValue={ state.categoryIdList }
                >
                    <Select
                        showSearch={ false }
                        mode="multiple"
                        className={ styles.select }
                        onChange={ setSelectCategory }
                        showArrow
                        open={ open }
                        suffixIcon={ renderSelectSuffix }
                        onDropdownVisibleChange={ setOpen }
                        placeholder={ CATEGORY_PROMO_CAMPAIGN }
                        tagRender={ selectTagRender }
                    >
                        { categories.map(({ categoryId, categoryName }) => (
                            <Select.Option
                                className={ styles.dropdown }
                                value={ categoryId }
                                key={ categoryId }
                            >
                                <Checkbox
                                    className={ styles.mrr }
                                    checked={ selectCategory.includes(categoryId) }
                                />
                                { categoryName }
                            </Select.Option>
                        )) }
                    </Select>
                </Form.Item>

                <Row gutter={ [24, 16] }>
                    <Col span={ 8 }>
                        <Form.Item
                            noStyle
                            dependencies={ [namePathPriorityOnWebUrl] }
                        >
                            { ({ getFieldValue }) => (
                                <Form.Item
                                    label={ getLabel(URL_PROMO_CAMPAIGN, TOOLTIP_TEXT_FOR_URL_LABEL) }
                                    className={ styles.formItem }
                                    name="webUrl"
                                    validateTrigger="onSubmit"
                                    rules={ [
                                        {
                                            required: (
                                                getFieldValue(namePathPriorityOnWebUrl) === URL_SOURCE_VALUE_PROMO_CAMPAIGN
                                            ),
                                            message: 'Укажите ссылку',
                                        },
                                        {
                                            pattern: URL_REGEXP,
                                            message: 'Введите корректный URL',
                                            validateTrigger: 'onSubmit',
                                        },
                                    ] }
                                    initialValue={ decodeURI(state.webUrl || '') }
                                >
                                    <Input placeholder={ URL } />
                                </Form.Item>
                            ) }
                        </Form.Item>
                    </Col>

                    <Col span={ 8 }>
                        <Form.Item
                            name={ namePathPriorityOnWebUrl }
                            label={ URL_SOURCE_LABEL }
                            rules={ [{ required: true, message: 'Укажите источник ссылки для QR-кода' }] }
                            initialValue={
                                state.settings.priorityOnWebUrl === true
                                    ? URL_SOURCE_VALUE_PROMO_CAMPAIGN
                                    : URL_SOURCE_VALUE_DZO
                            }
                        >
                            <Radio.Group className={ styles.urlSource }>
                                <Radio value={ URL_SOURCE_VALUE_DZO }>
                                    { URL_SOURCE_DZO_LABEL }
                                </Radio>
                                <Radio value={ URL_SOURCE_VALUE_PROMO_CAMPAIGN }>
                                    { URL_SOURCE_PROMO_CAMPAIGN_LABEL }
                                </Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>

                    <Col span={ 8 } className={ styles.switchRow }>
                        <div className={ styles.statusInfo }>
                            <div className={ styles.viewInfo }>
                                <span className={ styles.statusText }>
                                    { SHOW_GO_TO_LINK_LABEL }
                                </span>
                                <Form.Item
                                    name={ namePathAlternativeOfferMechanic }
                                    initialValue={ state.settings.alternativeOfferMechanic }
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row gutter={ [24, 16] }>
                    <Col span={ 8 }>
                        <Form.Item
                            label={ DZO }
                            className={ styles.formItem }
                            name="dzoId"
                            initialValue={ state.dzoId }
                            rules={ [{ required: true, message: 'Выберите ДЗО' }] }
                        >
                            <Select placeholder={ SELECT }>
                                { dzoList.map(option => (
                                    <Select.Option key={ option.dzoCode } value={ option.dzoId }>
                                        { option.dzoName } ({ option.dzoCode })
                                    </Select.Option>
                                )) }
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={ 8 }>
                        <Form.Item
                            label={ ACTIVE_PERIOD }
                            className={ styles.formItem }
                            name="datePicker"
                            initialValue={ state.datePicker }
                        >
                            <DatePicker.RangePicker
                                locale={ localeDatePicker }
                                placeholder={ DATE_PICKER_PLACEHOLDER }
                            />
                        </Form.Item>
                    </Col>
                    <Col span={ 8 } className={ styles.switchRow }>
                        <div className={ styles.statusInfo }>
                            <div className={ styles.viewInfo }>
                                <span className={ styles.statusText }>
                                    { SHOW_ONLY_IN_BUNDLE }
                                </span>
                                <Form.Item
                                    name="standalone"
                                    initialValue={ state.standalone }
                                    valuePropName="checked"
                                >
                                    <ReverseSwitch />
                                </Form.Item>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row gutter={ [24, 16] }>
                    <Col span={ 8 }>
                        <Form.Item
                            label={ TYPE_PROMO_CODE }
                            className={ styles.formItem }
                            name="promoCodeType"
                            initialValue={ state.promoCodeType }
                            rules={ [{ required: true, message: 'Выберите тип промокодов' }] }
                        >
                            <Select placeholder={ SELECT }>
                                { types_promo.map(type => (
                                    <Select.Option
                                        key={ type.value }
                                        value={ type.value }
                                        disabled={ type.disabled }
                                    >
                                        { `${type.label} ${type.description}` }
                                    </Select.Option>
                                )) }
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={ 8 }>
                        <Form.Item
                            label={ EXTERNAL_ID_LABEL }
                            className={ styles.formItem }
                            name="externalId"
                            initialValue={ state.externalId }
                            validateFirst
                            normalize={ (value) => value.trim() }
                            rules={ [
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
                            ] }
                        >
                            <Input maxLength="64" placeholder={ EXTERNAL_ID_PLACEHOLDER } />
                        </Form.Item>
                    </Col>

                    <Col span={ 8 }>
                        <Form.Item
                            noStyle
                            dependencies={ ['active'] }
                        >
                            { ({ getFieldValue }) => {
                                const active = getFieldValue('active');

                                return (
                                    <div className={ styles.statusInfo }>
                                        <div>
                                            { active ? STATUS_ON : STATUS_OFF }
                                        </div>
                                        <div className={ styles.viewInfo }>
                                            <span className={ styles.statusText }>
                                                { active ? STATUS_TEXT_ON : STATUS_TEXT_OFF }
                                            </span>
                                            <Form.Item
                                                name="active"
                                                valuePropName="checked"
                                                initialValue={ state.active }
                                            >
                                                <Switch />
                                            </Form.Item>
                                        </div>
                                    </div>
                                );
                            } }
                        </Form.Item>
                    </Col>
                </Row>
            </div>

            <div className={ styles.infoDetail }>
                <Row gutter={ [24, 16] }>
                    <Col span={ 12 }>
                        <div className={ styles.container }>
                            <Form.Item
                                name="appCode"
                                label={ SHOW_PROMO_CAMPAIGN }
                                initialValue={ state.appCode }
                                rules={ [{ required: true, message: 'Выберите витрину' }] }
                            >
                                <Select placeholder={ CHOOSE_SHOWCASE }>
                                    { clientApps.map(({ code, displayName }) => (
                                        <Select.Option value={ code } key={ code }>
                                            { displayName }
                                        </Select.Option>
                                    )) }
                                </Select>
                            </Form.Item>
                        </div>
                    </Col>

                    <Col span={ 12 }>
                        <div className={ styles.container }>
                            <Form.Item
                                name="type"
                                label={ TYPE_PROMO_CAMPAIGN }
                                rules={ [{ required: true, message: 'Укажите тип промо-кампании' }] }
                                initialValue={ state.type }
                            >
                                <Radio.Group onChange={ changeTypePromo }>
                                    <Radio
                                        className={ styles.checkbox }
                                        value={ PROMO_CAMPAIGNS.NORMAL.value }
                                    >
                                        { PROMO_CAMPAIGNS.NORMAL.label }
                                    </Radio>
                                    <Radio
                                        className={ styles.checkbox }
                                        value={ PROMO_CAMPAIGNS.PRESENT.value }
                                    >
                                        { PROMO_CAMPAIGNS.PRESENT.label }
                                    </Radio>
                                    { /* <Radio
                                        className={ styles.checkbox }
                                        value="landing"
                                    >
                                        { LANDING }
                                    </Radio> */ }
                                </Radio.Group>
                            </Form.Item>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default StepInfo;
