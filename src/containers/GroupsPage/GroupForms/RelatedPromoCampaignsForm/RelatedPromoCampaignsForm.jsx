import React, { useCallback, useMemo, useState, useRef, useLayoutEffect } from 'react';
import { Form, Input, Row, Col, Button, Select, notification } from 'antd';
import UploadPicture from '../../../../components/UploadPicture/UploadPicture';
import { ReactComponent as Cross } from '../../../../static/images/cross.svg';
import { ReactComponent as LoadingSpinner } from '../../../../static/images/loading-spinner.svg';
import { createGroupLink, editCampaignGroupTextAndBanners, editCampaignGroupLinks, getInitialValue } from '../groupForm.utils.js';
import { createCampaignGroup, editCampaignGroup, getCampaignGroupList } from '../../../../api/services/campaignGroupService';
import { getDataForAssociationCreate, normalizeAssociationData } from './RelatedPromoCampaignForm.utils.js';
import { BUNDLE_LOCATION_KEY, BUNDLE_TYPE, MODES } from '../../groupPageConstants';

import styles from './RelatedPromoCampaignsForm.module.css';

const CREATE = 'Создать';
const EDIT = 'Сохранить';
const CANCEL = 'Отменить';
const ASSOCIATION_CREATE = 'Новая связанная промо-кампания';
const ADD_ASSOCIATION_CAMPAIGN = 'Добавить связанную кампанию';
const SELECT_CAMPAIGN_PLACEHOLDER = 'Выберите промо-кампанию';
const HEADER_PLACEHOLDER = 'Заголовок';

const formItemProps = {
    ASSOCIATION_HEADER_FIELD: {
        name: ['texts', 'HEADER'],
        label: 'Текст заголовка',
        rules: [{ message: 'Текст заголовка обязателен' }],
    },
    ASSOCIATION_MAIN_ID_FIELD: {
        required: true,
        label: 'Основная промо-кампания',
        name: 'mainCampaignId',
    },
    CAMPAIGN_BANNER_FIELD: {
        label: 'Логотип связанной промо-кампании',
        accept: '.svg',
        get setting() {
            return `370px x 220px, до ${this.maxFileSize}МБ .svg`;
        },
        maxFileSize: 2,
        required: true,
        message: 'Загрузите баннер',
    },
    CAMPAIGN_ID_FIELD: {
        label: 'Промо-кампания с которой нужно связать',
    },
    CAMPAIGN_HEADER_FIELD: {
        label: 'Заголовок для связанной промо-кампании',
        required: true,
        rules: [{ message: 'Текст заголовка обязателен', required: true }],
    },
};

const RULES_MESSAGE = {
    CAMPAIGN_ALREADY: 'Такая кампания уже используется',
    CAMPAIGN_REQUIRED: 'Кампания обязательна',
    CAMPAIGN_DIFF_OF_MAIN: 'Выбранная кампания должна отличаться от основной',
};

const showSuccessNotification = (campaignName) => {
    notification.success({
        message: `Связанная промо-кампания ${campaignName} успешно сохранена`,
    });
};

const showCreatedNotification = (campaignName) => {
    notification.success({
        message: `Связанная промо-кампания ${campaignName} добавлена`,
    });
};

const RelatedPromoCampaignsForm = ({
    promoCampaignList,
    mode,
    matchPath,
    history,
    loadCampaignGroupList,
    bundleData,
    showLoading,
    hideLoading,
    loading,
    redirectToBundleList,
}) => {
    const [form] = Form.useForm();
    const mainCampaignName = useRef('');
    const association = useRef(getInitialValue(bundleData));
    const [errorMessage, setErrorMessage] = useState('');

    const isEdit = mode === MODES.EDIT;

    const disabledSelect = (fieldName) => isEdit && typeof form.getFieldValue(fieldName) === 'number';

    const getCampaignGroup = async (needUpdate) => {
        try {
            showLoading();

            if (isEdit) {
                let groupData = bundleData;

                if (!bundleData || needUpdate) {
                    groupData = await loadCampaignGroupList();
                }

                const normalizeBundleData = normalizeAssociationData(groupData);
                form.setFieldsValue(normalizeBundleData);
                association.current = { ...groupData, mainCampaignId: normalizeBundleData.mainCampaignId };
                mainCampaignName.current = association.current.name;

                history.replace(`${matchPath}/${groupData.id}/edit?type=${BUNDLE_TYPE.ASSOCIATION}`, {
                    [BUNDLE_LOCATION_KEY]: groupData,
                });
                return groupData;
            }
        } catch (e) {
            console.warn(e);
        } finally {
            hideLoading();
        }
    };

    useLayoutEffect(() => {
        getCampaignGroup();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bundleData]);

    const selectOptions = useMemo(() => (
        promoCampaignList.map(({ id, name }) => ({ label: name, value: id }))
    ), [promoCampaignList]);

    const handleCreate = async () => {
        showLoading();
        try {
            const associationData = await form.validateFields();
            const { id } = await createCampaignGroup(
                getDataForAssociationCreate({ ...associationData, name: mainCampaignName.current })
            );
            await createGroupLink(associationData.links, id);
            hideLoading();

            showCreatedNotification(mainCampaignName.current);
            redirectToBundleList();
        } catch ({ message }) {
            setErrorMessage(message);
            hideLoading();
        }
    };

    const handleEdit = async () => {
        showLoading();
        try {
            const associationData = await form.validateFields();
            await editCampaignGroup(
                getDataForAssociationCreate({ ...associationData, name: mainCampaignName.current }),
                association.current.id
            );
            await editCampaignGroupTextAndBanners(associationData, association.current, association.current.id);
            await editCampaignGroupLinks(associationData.links, association.current, association.current.id);
            const newAssociationData = await getCampaignGroup(true);
            showSuccessNotification(newAssociationData.name);
            hideLoading();

        } catch ({ message }) {
            setErrorMessage(message);
            hideLoading();
        }
    };

    const onSelect = (_, option) => {
        mainCampaignName.current = option.label;
    };

    const onRemoveImg = useCallback((name) => {
        form.setFields([{ name, value: [] }]);
    }, [form]);

    const onSearch = (input, option) => option.label.includes(input);

    const clearErrors = () => {
        setErrorMessage('');
    };

    return (
        <div>
            <div className={ styles.headerActions }>
                <div className={ styles.title }>{ isEdit ? association.current.name : ASSOCIATION_CREATE }</div>
                <div className={ styles.buttonBlock }>
                    <Button type="default" onClick={ redirectToBundleList }>
                        { CANCEL }
                    </Button>
                    <Button type="primary" onClick={ isEdit ? handleEdit : handleCreate } disabled={ loading }>
                        { isEdit ? EDIT : CREATE }
                    </Button>
                </div>
            </div>
            <Form layout="vertical" className={ styles.form } form={ form } onValuesChange={ clearErrors }>
                { errorMessage && <div className={ styles.error }>{ errorMessage }</div> }
                <div className={ styles.rowWrapper }>
                    <Row gutter={ [24, 16] } className={ styles.row }>
                        <Col span={ 12 }>
                            <Form.Item
                                { ...formItemProps.ASSOCIATION_MAIN_ID_FIELD }
                                rules={ [
                                    { required: true, message: RULES_MESSAGE.CAMPAIGN_REQUIRED },
                                    {
                                        validator: async (_, value) => {
                                            if (association.current?.mainCampaignId === value) return Promise.resolve();

                                            const { groups } = await getCampaignGroupList();
                                            const currentCampaign = promoCampaignList.find(({ id }) => id === value);
                                            const isAlreadyExists = groups.some(
                                                ({ name }) => currentCampaign?.name === name
                                            );

                                            return isAlreadyExists
                                                ? Promise.reject(RULES_MESSAGE.CAMPAIGN_ALREADY)
                                                : Promise.resolve();
                                        },
                                        validateTrigger: 'onSubmit',
                                    },
                                ] }
                            >
                                <Select
                                    showSearch
                                    filterOption={ onSearch }
                                    options={ selectOptions }
                                    placeholder={ SELECT_CAMPAIGN_PLACEHOLDER }
                                    onSelect={ onSelect }
                                    disabled={ isEdit }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>
                <Form.List name="links" rules={ validatorsContentData }>
                    { (fields, { add, remove }, { errors }) => (
                        <>
                            { fields.map((field) => (
                                <div key={ form.getFieldValue(['links', field.name, 'id']) ?? field.key } className={ styles.rowWrapper }>
                                    <Row gutter={ [24, 16] } className={ styles.row }>
                                        <Col span={ 12 }>
                                            <Form.Item
                                                name={ [field.name, 'campaignId'] }
                                                { ...formItemProps.CAMPAIGN_ID_FIELD }
                                                rules={ [
                                                    { required: true, message: RULES_MESSAGE.CAMPAIGN_REQUIRED },
                                                    {
                                                        validator: (_, value) => {
                                                            const mainCampaignId = form.getFieldValue('mainCampaignId');
                                                            return value !== mainCampaignId
                                                                ? Promise.resolve()
                                                                : Promise.reject(RULES_MESSAGE.CAMPAIGN_DIFF_OF_MAIN);
                                                        },
                                                    },
                                                    campaignIdValidator,
                                                ] }
                                                validateFirst
                                            >
                                                <Select
                                                    showSearch
                                                    filterOption={ onSearch }
                                                    options={ selectOptions }
                                                    placeholder={ SELECT_CAMPAIGN_PLACEHOLDER }
                                                    disabled={ disabledSelect(['links', field.name, 'id']) }
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={ 12 }>
                                            <Form.Item
                                                name={ [field.name, 'texts', 'HEADER'] }
                                                { ...formItemProps.CAMPAIGN_HEADER_FIELD }
                                            >
                                                <Input.TextArea
                                                    placeholder={ HEADER_PLACEHOLDER }
                                                    autoSize
                                                    maxLength={ 70 }
                                                    showCount
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={ 12 }>
                                            <Form.Item
                                                noStyle
                                                dependencies={ ['links', field.name, 'banners', 'LOGO_MAIN'] }
                                            >
                                                { ({ getFieldValue }) => (
                                                    <UploadPicture
                                                        uploadFileClassName={ styles.uploadBackground }
                                                        name={ [field.name, 'banners', 'LOGO_MAIN'] }
                                                        { ...formItemProps.CAMPAIGN_BANNER_FIELD }
                                                        initialValue={ getFieldValue([
                                                            'links',
                                                            field.name,
                                                            'banners',
                                                            'LOGO_MAIN',
                                                        ]) }
                                                        onRemoveImg={ () =>
                                                            onRemoveImg(['links', field.name, 'banners', 'LOGO_MAIN'])
                                                        }
                                                    />
                                                ) }
                                            </Form.Item>
                                        </Col>
                                        <Form.Item hidden name={ [field.name, 'id'] }>
                                            <Input />
                                        </Form.Item>
                                        { fields.length > 1 && (
                                            <Cross className={ styles.cross } onClick={ () => remove(field.name) } />
                                        ) }
                                    </Row>
                                </div>
                            )) }
                            <Form.Item className={ styles.addButton }>
                                <Button type="default" onClick={ () => add() }>
                                    { ADD_ASSOCIATION_CAMPAIGN }
                                </Button>
                            </Form.Item>
                            { errors && (
                                <div className={ styles.errorBlock }>
                                    <Form.ErrorList errors={ errors } />
                                </div>
                            ) }
                        </>
                    ) }
                </Form.List>
                <Form.Item hidden name="type" initialValue={ BUNDLE_TYPE.ASSOCIATION.toUpperCase() }>
                    <Input />
                </Form.Item>
            </Form>
            { loading && (
                <div className={ styles.loadingWrapper }>
                    <div className={ styles.loading }>
                        <LoadingSpinner />
                    </div>
                </div>
            ) }
        </div>
    );
};

export default RelatedPromoCampaignsForm;

const campaignIdValidator = ({ getFieldValue }) => {
    return {
        validator(_, value) {
            const campaignIdList = getFieldValue('links');

            const { length } = campaignIdList.filter(({ campaignId }) => campaignId === value);

            if (length > 1) {
                return Promise.reject(RULES_MESSAGE.CAMPAIGN_ALREADY);
            }
            return Promise.resolve();
        },
        validateTrigger: 'onChange'
    };
};

const validatorsContentData = [
    {
        validator: async (_, contentData) => {
            if (!contentData?.length) {
                return Promise.reject(Error('Добавьте хотя бы один блок'));
            }
        },
    }
];