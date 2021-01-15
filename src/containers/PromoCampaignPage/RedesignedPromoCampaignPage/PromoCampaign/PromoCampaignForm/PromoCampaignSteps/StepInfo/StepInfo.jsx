import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Input, Switch, Select, DatePicker, Form, Row, Col, Radio, Checkbox } from 'antd';
import { getDzoList } from '../../../../../../../api/services/dzoService';
import { getClientAppList } from '../../../../../../../api/services/clientAppService';
import { getCategoryList } from '../../../../../../../api/services/categoryService';
import { steps } from '../../PromoCampaignFormConstants';
import promoCodeTypes from '../../../../../../../constants/promoCodeTypes';

import { ReactComponent as Cross } from '../../../../../../../static/images/cross.svg';

import { CloseOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import styles from './StepInfo.module.css';

const SELECT = 'Выбрать';
const URL = 'url';
const NAME_PROMO_CAMPAIGN = 'Название промо-кампании';
const CATEGORY = 'Категории';
const CATEGORY_PROMO_CAMPAIGN = 'Выберите категорию';
const TEMPLATE_PROMO_NAME = 'Например: Промо-кампания СберМаркет';
const URL_PROMO_CAMPAIGN = 'Ссылка на страницу промо-кампании';
const TYPE_PROMO_CAMPAIGN = 'Тип промо-кампании';
const TYPE_PROMO_CODE = 'Тип промокода';
const ACTIVE_PERIOD = 'Период действия';
const CHOOSE_SHOWCASE = 'Выберите витрину';
const SHOW_PROMO_CAMPAIGN = 'Витрины в которых показывать промо-кампанию';
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
const types_promo = Object.values(promoCodeTypes);

const EXCURSION = 'Экскурсия';
const GIFT = 'Подарок';
// const LANDING = 'Лендинг';


const selectTagRender = ({ label, onClose }) => (
    <div className={ styles.tagSelect }>
        <p className={ styles.selectText }>{ label[1] }</p>
        <Cross height="15px" width="15px" color="#09A552" onClick={ onClose } />
    </div>
);

const StepInfo = ({ state, handlerNextStep, validStepChange, changeTypePromo, changeUrlSource }) => {

    const [dzoList, setDzoList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [clientApps, setClientApps] = useState([]);
    const [active, setActive] = useState(false);
    const [selectCategory, setSelectCategory] = useState([]);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();

    useEffect(()=> {
        (async ()=> {
            const { dzoDtoList = [] } = await getDzoList();
            const { categoryList = [] } = await getCategoryList();
            const { clientApplicationDtoList: allApps = [] } = await getClientAppList();
            setDzoList(dzoDtoList.filter(item => !item.isDeleted));
            setCategories(categoryList.filter(({ active }) => active));
            setClientApps(allApps.filter(({ isDeleted }) => !isDeleted));
            setSelectCategory(state.categoryIdList);
            setActive(state.active);
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clearSelect = useCallback((name) => () => {
        form.setFieldsValue({ [name]: [] });
        setSelectCategory([]);
    }, [form]);

    const toggleSelect = useCallback(() => {
        setOpen(!open);
    }, [open]);

    const onUrlSourceChanged = (e) => changeUrlSource(e.target.value === URL_SOURCE_VALUE_PROMO_CAMPAIGN);

    const renderSelectSuffix = useMemo(() => (
        <div className={ styles.suffixBlock }>
            { open ?
                <UpOutlined className={ styles.icon } onClick={ toggleSelect } />:
                <DownOutlined className={ styles.icon } onClick={ toggleSelect } />
            }
            { Boolean(selectCategory.length) &&
                <CloseOutlined
                    className={ styles.icon }
                    onClick={ clearSelect('categoryIdList') }
                />
            }
            { Boolean(selectCategory.length) && <div className={ styles.selectCount }>{selectCategory.length}</div> }
        </div>
    ), [open, toggleSelect, selectCategory.length, clearSelect]);

    const onFinish = useCallback((val) => {
        const [startDate, finishDate] = val.datePicker || [];
        validStepChange(steps.textAndBanners);
        handlerNextStep({
            ...val,
            startDate: startDate?.toISOString(),
            finishDate: finishDate?.toISOString(),
            offerDuration: finishDate?.diff(startDate, 'days') + 1,
        });
    }, [handlerNextStep, validStepChange]);

    const isChanged = useCallback(changedFields => {
        if (changedFields.some(({ touched }) => touched)) {
            validStepChange(steps.main_info, false);
        }
    }, [validStepChange]);

    return (
        <Form
            id="info"
            form={ form }
            layout="vertical"
            className={ styles.containerStep }
            onFieldsChange={ isChanged }
            onFinish={ onFinish }
        >
            <div className={ styles.container }>
                <Form.Item
                    label={ NAME_PROMO_CAMPAIGN }
                    className={ styles.promoCampaignName }
                    name="name"
                    initialValue={ state.name }
                    rules={ [{ required: true, message: 'Укажите название промо-кампании' }] }
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
                    <Col span={ 12 }>
                        <Form.Item
                            label={ URL_PROMO_CAMPAIGN }
                            className={ styles.formItem }
                            name="webUrl"
                            rules={ [{ required: state?.settings?.priorityOnWebUrl === true, message: 'Укажите ссылку' }] }
                            initialValue={ state.webUrl }
                        >
                            <Input placeholder={ URL } />
                        </Form.Item>
                    </Col>
                    <Col span={ 12 }>
                        <Form.Item
                            name="urlSource"
                            label={ URL_SOURCE_LABEL }
                            rules={ [{ required: true, message: 'Укажите источник ссылки для QR-кода' }] }
                            initialValue={ state?.settings?.priorityOnWebUrl === true
                                ? URL_SOURCE_VALUE_PROMO_CAMPAIGN
                                : URL_SOURCE_VALUE_DZO
                            }
                        >
                            <Radio.Group className={ styles.urlSource } onChange={ onUrlSourceChanged }>
                                <Radio
                                    className={ styles.checkbox }
                                    value={ URL_SOURCE_VALUE_DZO }
                                >
                                    { URL_SOURCE_DZO_LABEL }
                                </Radio>
                                <Radio
                                    className={ styles.checkbox }
                                    value={ URL_SOURCE_VALUE_PROMO_CAMPAIGN }
                                >
                                    { URL_SOURCE_PROMO_CAMPAIGN_LABEL }
                                </Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={ [24, 16] }>
                    <Col span={ 12 }>
                        <Form.Item
                            label={ DZO }
                            className={ styles.formItem }
                            name="dzoId"
                            initialValue={ state.dzoId }
                            rules={ [{ required: true, message: 'Выберите ДЗО' }] }
                        >
                            <Select placeholder={ SELECT }>
                                {dzoList.map(option => (
                                    <Select.Option key={ option.dzoCode } value={ option.dzoId }>
                                        { option.dzoName } ({ option.dzoCode })
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={ 12 }>
                        <Form.Item
                            label={ ACTIVE_PERIOD }
                            className={ styles.formItem }
                            name="datePicker"
                            initialValue={ state.datePicker }
                        >
                            <DatePicker.RangePicker placeholder={ DATE_PICKER_PLACEHOLDER } />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={ [24, 16] }>
                    <Col span={ 12 }>
                        <Form.Item
                            label={ TYPE_PROMO_CODE }
                            className={ styles.formItem }
                            name="promoCodeType"
                            initialValue={ state.promoCodeType }
                            rules={ [{ required: true, message: 'Выберите тип промокодов' }] }
                        >
                            <Select placeholder={ SELECT }>
                                {types_promo.map(type => (
                                    <Select.Option
                                        key={ type.value }
                                        value={ type.value }
                                        disabled={ type.disabled }
                                    >
                                        { `${type.label} ${type.description}` }
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={ 12 } className={ styles.flexCenter }>
                        <div className={ styles.flexCenter }>
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
                                        className={ styles.blockActive }
                                        initialValue={ state.active }
                                    >
                                        <Switch
                                            id='active'
                                            size="default"
                                            onChange={ setActive }
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
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
                                    { clientApps.map(({ code, name }) => (
                                        <Select.Option value={ code } key={ code }>
                                            { name }
                                        </Select.Option>
                                    )) }
                                </Select>
                            </Form.Item>
                        </div>
                    </Col>
                    <Col span={ 12 }>
                        <div className={ styles.container }>
                            <Form.Item
                                name="typePromoCampaign"
                                label={ TYPE_PROMO_CAMPAIGN }
                                rules={ [{ required: true, message: 'Укажите тип промо-кампании' }] }
                                initialValue={ state.typePromoCampaign }
                            >
                                <Radio.Group className={ styles.typePromoCampaign } onChange={ changeTypePromo }>
                                    <Radio
                                        className={ styles.checkbox }
                                        value="NORMAL"
                                    >
                                        { EXCURSION }
                                    </Radio>
                                    <Radio
                                        className={ styles.checkbox }
                                        value="PRESENT"
                                    >
                                        { GIFT }
                                    </Radio>
                                    {/* <Radio
                                        className={ styles.checkbox }
                                        value="landing"
                                    >
                                        { LANDING }
                                    </Radio> */}
                                </Radio.Group>
                            </Form.Item>
                        </div>
                    </Col>
                </Row>
            </div>
        </Form>
    );
};

export default StepInfo;