import React, { useCallback, useMemo, useState, useRef, useLayoutEffect } from 'react';
import { Form, Input, Switch, Row, Col, Button, Select, FormItemProps, SelectProps } from 'antd';
import { History } from 'history';
import { BundleDto, BundleLink, PromoCampaignDto } from '@types';
import { BundleGroupDto } from '../types';
import { RuleObject, RuleRender } from 'antd/lib/form';
import UploadPicture from '@components/UploadPicture';
import { ReactComponent as Cross } from '@imgs/cross.svg';
import { ReactComponent as LoadingSpinner } from '@imgs/loading-spinner.svg';
import {
    createCampaignGroup,
    editCampaignGroup,
    getCampaignGroupList,
} from '@apiServices/campaignGroupService';
import { customNotifications } from '@utils/notifications';
import {
    // createGroupTexts,
    editCampaignGroupLinks,
    createGroupLink,
    createGroupBanner,
    editCampaignGroupTextAndBanners,
    getInitialValue,
} from '../groupForm.utils';
import { BundleTypes, BUNDLE_LOCATION_KEY, MODES } from '../../groupPageConstants';
import { normalizeBundle, getDataForBundleCreate } from './Bundle.utils';
import { BANNER_TYPE, BANNER_TEXT_TYPE, BUTTON_TEXT } from '@constants/common';

import styles from './BundleForm.module.css';

export type BundleFormProps = {
    matchPath: string;
    history: History;
    mode: string;
    promoCampaignList: PromoCampaignDto[];
    loadCampaignGroupList: () => Promise<BundleDto | undefined>;
    bundleData: BundleDto;
    loading: boolean;
    showLoading: () => void;
    hideLoading: () => void;
    redirectToBundleList: () => void;
};

const NEW_BUNDLE = 'Новый бандл';
const BUNDLE_ON = 'Бандл включен';
const BUNDLE_OFF = 'Бандл выключен';
const BUNDLE_SHOW = 'Пользователи видят бандл';
const BUNDLE_HIDE = 'Пользователи не видят бандл';
const BUNDLE_BIND = 'Связать бандл';
const SELECT_CAMPAIGN_PLACEHOLDER = 'Выберите промо-кампанию';
const BUNDLE_NAME_PLACEHOLDER = 'Название';
const MAX_BUNDLE_CAMPAIGN = 4;

const formItemProps = {
    BUNDLE_NAME_FIELD: {
        name: 'name',
        label: 'Название бандла',
        rules: [{ required: true, message: 'Укажите название бандла', whitespace: true }],
    },
    BUNDLE_HEADER_FIELD: {
        name: ['texts', BANNER_TEXT_TYPE.HEADER],
        label: 'Текст заголовка',
        rules: [{ message: 'Текст заголовка обязателен' }],
    },
    BUNDLE_ACTIVE_FIELD: { name: 'active', valuePropName: 'checked', initialValue: false },
    BUNDLE_BANNER_FIELD: {
        name: ['banners', BANNER_TYPE.CARD],
        label: 'Баннер на главной',
        accept: '.jpg',
        get setting() {
            return `370px x 220px, до ${this.maxFileSize}МБ .jpg`;
        },
        maxFileSize: 2,
        required: true,
        message: 'Загрузите баннер',
    },
    BUNDLE_DESCRIPTION_FIELD: {
        name: ['texts', BANNER_TEXT_TYPE.DESCRIPTION],
        label: 'Текст описания',
        rules: [{ required: true, message: 'Текст описания обязателен' }],
    },
    CAMPAIGN_ID_FIELD: {
        label: 'Промо-кампания, с которой связать бандл',
        required: true,
    },
    CAMPAIGN_HEADER_FIELD: {
        label: 'Текст заголовка',
        rules: [{ message: 'Текст заголовка обязателен', required: true }],
    },
    CAMPAIGN_DESCRIPTION_FIELD: {
        label: 'Текст описания',
        placeholder: 'Описание',
        rules: [{ message: 'Текст описания обязателен', required: true }],
    },
    CAMPAIGN_BANNER_FIELD: {
        label: 'Баннер на карточке',
        get setting() {
            return `370px x 220px, до ${this.maxFileSize}МБ .png,.svg`;
        },
        maxFileSize: 2,
        accept: '.png,.svg',
    },
};

const RULES_MESSAGE = {
    BUNDLE_NAME_REQUIRED: 'Укажите название бандла',
    BUNDLE_NAME_ALREADY: 'Бандл с таким названием уже существует',
    CAMPAIGN_ALREADY: 'Такая кампания уже используется',
    CAMPAIGN_REQUIRED: 'Кампания обязательна',
    CAMPAIGN_DIFF_OF_MAIN: 'Выбранная кампания должна отличаться от основной',
};

const showSuccessNotification = (campaignName?: string) => {
    customNotifications.success({
        message: <>Бандл <b>{campaignName}</b> успешно сохранен</>,
    });
};

const showCreatedNotification = (campaignName?: string) => {
    customNotifications.success({
        message: <>Бандл <b>{campaignName}</b> добавлен</>,
    });
};

const BundleForm: React.FC<BundleFormProps> = ({
    matchPath,
    history,
    mode,
    promoCampaignList,
    loadCampaignGroupList,
    bundleData,
    loading,
    showLoading,
    hideLoading,
    redirectToBundleList,
}) => {
    const [form] = Form.useForm<BundleGroupDto>();
    const bundle = useRef(getInitialValue(bundleData));
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const isEdit = mode === MODES.EDIT;

    const disabledSelect = (fieldName: FormItemProps['name']) => isEdit && !!fieldName && typeof form.getFieldValue(fieldName) === 'number';

    const getCampaignGroup = async (needUpdate?: boolean) => {
        try {
            if (isEdit) {
                let groupData = bundleData;
                if (!bundleData || needUpdate) {
                    groupData = (await loadCampaignGroupList())!;
                }
                const normalizeBundleData = normalizeBundle(groupData);
                form.setFieldsValue(normalizeBundleData);
                bundle.current = groupData;
                setSelectedItems((groupData.links.map(({ campaignId }) => campaignId)));

                history.replace(`${matchPath}/${groupData.id}/edit?type=${BundleTypes.IDEA}`, {
                    [BUNDLE_LOCATION_KEY]: groupData,
                });

                return groupData;
            }
        } catch ({ message }) {
            console.warn(message);
        }
    };

    const selectOptions = useMemo(() =>
        promoCampaignList
            .map(({ name, id }) => ({ label: name, value: id, hidden: selectedItems.includes(id) })),
    [selectedItems, promoCampaignList]);

    useLayoutEffect(() => {
        getCampaignGroup();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bundleData]);

    const handleCreate = async () => {
        showLoading();
        try {
            const groupData = await form.validateFields();
            const { id } = await createCampaignGroup(getDataForBundleCreate(groupData));
            await createGroupBanner(groupData.banners, id);
            // await createGroupTexts(groupData.texts, id);
            await createGroupLink(groupData.links, id);
            hideLoading();
            showCreatedNotification(groupData.name);
            redirectToBundleList();
        } catch ({ message }) {
            hideLoading();
            setErrorMessage(message);
        }
    };

    const handleEdit = async () => {
        showLoading();
        try {
            const bundleID = bundle.current.id;
            const groupData = await form.validateFields();
            await editCampaignGroup(getDataForBundleCreate(groupData), bundleID);
            await editCampaignGroupTextAndBanners(groupData, bundle.current, bundleID);
            await editCampaignGroupLinks(groupData.links, bundle.current, bundleID);
            const bundleData = await getCampaignGroup(true);
            showSuccessNotification(bundleData!.name);
            hideLoading();
        } catch ({ message }) {
            setErrorMessage(message);
            hideLoading();
        }
    };

    const onRemoveImg = useCallback((name) => {
        form.setFields([{ name, value: [] }]);
    }, [form]);

    const onSearch: SelectProps<any>['filterOption'] = (input, option) => (option?.label as string).toLowerCase().includes(input.toLowerCase());

    const filterSelectedItems = (links: BundleDto['links']) => {
        setSelectedItems((links || []).map(({ campaignId }) => campaignId));
    };

    const validateCampaignId = () => {
        const links = form.getFieldValue('links');
        (links || []).forEach((_: unknown, index: number) => form.validateFields([['links', index, 'campaignId']]));
        filterSelectedItems(links);
    };

    const clearErrors = () => {
        setErrorMessage('');
    };

    return (
        <div>
            <div className={styles.headerActions}>
                <div className={styles.title}>{isEdit ? bundle.current.name : NEW_BUNDLE}</div>
                <div className={styles.buttonBlock}>
                    <Button type="default" onClick={redirectToBundleList}>
                        {BUTTON_TEXT.CANCEL}
                    </Button>
                    <Button type="primary" onClick={isEdit ? handleEdit : handleCreate} disabled={loading}>
                        {isEdit ? BUTTON_TEXT.SAVE : BUTTON_TEXT.CREATE}
                    </Button>
                </div>
            </div>
            <Form layout="vertical" className={styles.form} form={form} onValuesChange={clearErrors}>
                {errorMessage && <div className={styles.error}>{errorMessage}</div>}
                <div className={styles.rowWrapper}>
                    <Row gutter={[24, 16]} className={styles.row}>
                        <Col span={13}>
                            <Form.Item
                                {...formItemProps.BUNDLE_NAME_FIELD}
                                rules={[
                                    { required: true, message: RULES_MESSAGE.BUNDLE_NAME_REQUIRED, whitespace: true },
                                    {
                                        validator: async (_, value) => {
                                            if (value?.trim() === bundle.current.name.trim()) return Promise.resolve();

                                            const { groups } = await getCampaignGroupList();
                                            const isExist = groups.some(({ name }) => name === value);

                                            return isExist
                                                ? Promise.reject(RULES_MESSAGE.BUNDLE_NAME_ALREADY)
                                                : Promise.resolve();
                                        },
                                        validateTrigger: 'onSubmit',
                                    },
                                ]}
                            >
                                <Input placeholder={BUNDLE_NAME_PLACEHOLDER} allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={11} className={styles.col}>
                            <Form.Item noStyle dependencies={[formItemProps.BUNDLE_ACTIVE_FIELD.name]}>
                                {({ getFieldValue }) => (
                                    <div className={styles.switchWrapper}>
                                        <div>
                                            <b>{getFieldValue('active') ? BUNDLE_ON : BUNDLE_OFF}</b>
                                        </div>
                                        <div className={styles.switchBlock}>
                                            <div className={styles.switchText}>
                                                {getFieldValue('active') ? BUNDLE_SHOW : BUNDLE_HIDE}
                                            </div>
                                            <Form.Item {...formItemProps.BUNDLE_ACTIVE_FIELD}>
                                                <Switch />
                                            </Form.Item>
                                        </div>
                                    </div>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={13}>
                            <Form.Item noStyle dependencies={[formItemProps.BUNDLE_BANNER_FIELD.name]}>
                                {({ getFieldValue }) => (
                                    <UploadPicture
                                        {...formItemProps.BUNDLE_BANNER_FIELD}
                                        uploadFileClassName={styles.uploadBackground}
                                        initialValue={getFieldValue(formItemProps.BUNDLE_BANNER_FIELD.name)}
                                        onRemoveImg={onRemoveImg}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        {/* <Col span={ 12 }>
                            <Form.Item { ...formItemProps.BUNDLE_HEADER_FIELD }>
                                <Input.TextArea placeholder='Заголовок' maxLength={ 48 } showCount autoSize allowClear />
                            </Form.Item>
                            <Form.Item { ...formItemProps.BUNDLE_DESCRIPTION_FIELD }>
                                <Input.TextArea
                                    placeholder='Описание'
                                    maxLength={ 70 }
                                    showCount
                                    autoSize={ { minRows: 3 } }
                                    allowClear
                                />
                            </Form.Item>
                        </Col> */}
                    </Row>
                </div>

                <Form.List name="links" rules={[{ validator: tagsValidator }]}>
                    {(fields, { add, remove }, { errors }) => (
                        <>
                            {fields.map((field) => (
                                <div key={form.getFieldValue(['links', field.name, 'id']) ?? field.key} className={styles.rowWrapper}>
                                    <Row gutter={[24, 16]} className={styles.row}>
                                        <Col span={13}>
                                            <Form.Item
                                                rules={[
                                                    { required: true, message: RULES_MESSAGE.CAMPAIGN_REQUIRED },
                                                    campaignIdValidator,
                                                ]}
                                                name={[field.name, 'campaignId']}
                                                {...formItemProps.CAMPAIGN_ID_FIELD}
                                                validateFirst
                                            >
                                                <Select
                                                    showSearch
                                                    filterOption={onSearch}
                                                    onSelect={validateCampaignId}
                                                    options={selectOptions}
                                                    placeholder={SELECT_CAMPAIGN_PLACEHOLDER}
                                                    disabled={disabledSelect(['links', field.name, 'id'])}
                                                    virtual={false}
                                                />
                                            </Form.Item>
                                        </Col>
                                        {/* <Col span={ 12 }>
                                            <Form.Item
                                                { ...formItemProps.CAMPAIGN_HEADER_FIELD }
                                                name={ [field.name, 'texts', BANNER_TEXT_TYPE.HEADER] }
                                            >
                                                <Input.TextArea
                                                    placeholder='Заголовок'
                                                    maxLength={ 70 }
                                                    showCount
                                                    autoSize={ { minRows: 3 } }
                                                />
                                            </Form.Item>
                                        </Col> */}
                                        <Col span={13}>
                                            <Form.Item
                                                noStyle
                                                dependencies={['links', field.name, 'banners', BANNER_TYPE.LOGO_ICON]}
                                            >
                                                {({ getFieldValue }) => (
                                                    <UploadPicture
                                                        {...formItemProps.CAMPAIGN_BANNER_FIELD}
                                                        name={[field.name, 'banners', BANNER_TYPE.LOGO_ICON]}
                                                        uploadFileClassName={styles.uploadBackground}
                                                        initialValue={getFieldValue([
                                                            'links',
                                                            field.name,
                                                            'banners',
                                                            BANNER_TYPE.LOGO_ICON,
                                                        ])}
                                                        onRemoveImg={() =>
                                                            onRemoveImg(['links', field.name, 'banners', BANNER_TYPE.LOGO_ICON])
                                                        }
                                                    />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        {/* <Col span={ 12 }>
                                            <Form.Item
                                                { ...formItemProps.CAMPAIGN_DESCRIPTION_FIELD }
                                                name={ [field.name, 'texts', BANNER_TEXT_TYPE.DESCRIPTION] }
                                            >
                                                <Input.TextArea
                                                    placeholder='Описание'
                                                    maxLength={ 70 }
                                                    showCount
                                                    autoSize={ { minRows: 3 } }
                                                />
                                            </Form.Item>
                                        </Col> */}
                                        <Form.Item hidden name={[field.name, 'id']} initialValue={null}>
                                            <Input />
                                        </Form.Item>
                                        {fields?.length > 1 && (
                                            <Cross
                                                className={styles.cross}
                                                onClick={() => {
                                                    remove(field.name);
                                                    filterSelectedItems(form.getFieldValue('links'));
                                                }}
                                            />
                                        )}
                                    </Row>
                                </div>
                            ))}
                            {fields?.length < MAX_BUNDLE_CAMPAIGN && (
                                <Form.Item className={styles.addButton}>
                                    <Button onClick={() => add()}>{BUNDLE_BIND}</Button>
                                </Form.Item>
                            )}
                            {errors && (
                                <div className={styles.errorBlock}>
                                    <Form.ErrorList errors={errors} />
                                </div>
                            )}
                        </>
                    )}
                </Form.List>
                <Form.Item hidden name="type" initialValue={BundleTypes.IDEA.toUpperCase()}>
                    <Input />
                </Form.Item>
            </Form>
            {loading && (
                <div className={styles.loadingWrapper}>
                    <div className={styles.loading}>
                        <LoadingSpinner />
                    </div>
                </div>
            )}
        </div>
    );
};

export default BundleForm;

const campaignIdValidator: RuleRender = ({ getFieldValue }) => ({
    validator(_, value) {
        const campaignIdList = getFieldValue('links') as BundleLink[];

        const { length } = campaignIdList.filter(({ campaignId }) => campaignId === value);

        if (length > 1) {
            return Promise.reject(RULES_MESSAGE.CAMPAIGN_ALREADY);
        }
        return Promise.resolve();
    },
    validateTrigger: 'onChange',
});

async function tagsValidator(_: RuleObject, data: any[]) {
    if (data?.length < 1 || !data) {
        return Promise.reject(Error('Создайте хотя бы одну связь для бандлов'));
    }
}
