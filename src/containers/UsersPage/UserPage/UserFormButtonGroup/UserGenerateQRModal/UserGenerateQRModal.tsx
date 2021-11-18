import React, { useState } from 'react';
import { Button, Modal, Form, Select } from 'antd';
import { OptionData } from 'rc-select/lib/interface';
import { FormItemProps } from 'antd/lib/form';
import { toDataURL } from 'qrcode';
import { INFO_USER_BUTTONS } from '../UserFormButtonGroup';
import { getLinkForQR } from '@apiServices/usersService';
import { getFilteredPromoCampaignList } from '@apiServices/promoCampaignService';
import { getCampaignGroupList } from '@apiServices/campaignGroupService';
import { downloadFileFunc } from '@utils/helper';
import { showNotify, MODE } from '../../UserFormHelper';
import { ClientAppDto, UserInfo } from '@types';
import { FORM_RULES } from '@utils/validators';
import EmptyMessage from '@components/EmptyMessage';
import { ReactComponent as Cross } from '@imgs/cross.svg';

import styles from './UserGenerateQRModal.module.css';

type UserGenerateQRModalProps = {
    clientApps?: ClientAppDto[];
    personalNumber?: UserInfo['personalNumber'];
    userId?: UserInfo['id'];
    buttonDisabled?: boolean;
    userClientAppIds?: UserInfo['clientAppIds'];
};

const MODAL_BUTTON_OK_LABEL = 'Сгенерировать';
const MODAL_BUTTON_CANCEL_LABEL = 'Отменить';
const MODAL_APP_LABEL_TEXT = 'Витрина';
const APP_CODE_PLACEHOLDER = 'Выберите витрину';
const TYPE_SELECT_OPTIONS = [
    { value: 'promoCampaign', label: 'Промокампания Продукт' },
    { value: 'group', label: 'Бандл' },
];
const TYPE_PLACEHOLDER = 'Выберите тип';
const TYPE_LABEL_TEXT = 'Тип';
const MODAL_TEXT = 'Выберите витрину, для которой нужно сгенерировать QR-код';
const options = {
    scale: 8,
};


const PROMOCAMPAIGN_OR_BUNDLE = {
    'promoCampaign': 'Выберите промокампанию',
    'group': 'Выберите бандл',
};

const FIELD_PROPS = {
    'promoCampaign': {
        name: 'campaignId',
        label: 'Промокампания',
    },
    'group': {
        name: 'groupId',
        label: 'Бандл',
    },
};

const UserGenerateQRModal: React.FC<UserGenerateQRModalProps> = ({
    clientApps = [],
    personalNumber,
    userId,
    buttonDisabled,
    userClientAppIds,
}) => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [appsOptions, setAppsOptions] = useState<OptionData[]>([]);
    const [promoCampaignList, setPromoCampaignList] = useState<OptionData[]>([]);
    const [groupCampaignList, setGroupCampaignList] = useState<OptionData[]>([]);
    const [loading, setLoading] = useState(false);

    const onOpenModal = async () => {
        setIsModalVisible(true);

        if (!appsOptions.length) {
            const filteredOptions = clientApps.reduce<OptionData[]>((prev, curr) =>
                (userClientAppIds || []).includes(curr.id)
                    ? [ ...prev, { value: curr.code, label: curr.displayName }]
                    : prev,
            []);
            setAppsOptions(filteredOptions);
        }
    };

    const onCancelModal = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleFinish = async (
        { clientAppCode, groupId, campaignId }: { clientAppCode: string; groupId?: number; campaignId?: number; },
    ) => {
        if (userId !== undefined) {
            setLoading(true);
            try {
                const qrCodeData = await getLinkForQR(
                    { clientAppCode, userId, ...(groupId && { groupId }), ...(campaignId && { campaignId }) },
                );
                const qrUrl = await toDataURL(qrCodeData, options);

                downloadFileFunc(qrUrl, personalNumber, 'png');
                showNotify({ login: personalNumber, mode: MODE.QR_DOWNLOAD });
            } catch (err) {
                showNotify({ mode: MODE.ERROR, errorMessage: (err as Error).message });
            }
            setLoading(false);
            onCancelModal();
        }
    };

    const fetchPromoOrGroup = async(appType: string, appCode: string) => {
        setLoading(true);
        if (appType === 'promoCampaign') {
            form.setFieldsValue({ campaignId: null });
            try {
                const { promoCampaignDtoList } = await getFilteredPromoCampaignList(
                    { type: 'NORMAL' },
                    appCode,
                ) ?? {};
                const campaignList = promoCampaignDtoList.map((elem) => ({ value: elem.id, label: elem.name }));
                setPromoCampaignList(campaignList);
            } catch (e: any) {
                if (e.message) {
                    showNotify({ mode: MODE.ERROR, errorMessage: e.message });
                }
            }
        }
        if (appType === 'group') {
            form.setFieldsValue({ groupId: null });
            try {
                const { groups } = await getCampaignGroupList(appCode) ?? {};
                const groupList = groups.map((elem) => ({ value: elem.id, label: elem.name }));
                setGroupCampaignList(groupList);
            } catch (e: any) {
                if (e.message) {
                    showNotify({ mode: MODE.ERROR, errorMessage: e.message });
                }
            }
        }
        setLoading(false);
    };

    const onChangeAppCodeOrType = () => {
        const appType = form.getFieldValue('type');
        const appCode = form.getFieldValue('clientAppCode');
        fetchPromoOrGroup(appType, appCode);
    };

    return (
        <>
            <Button
                type="primary"
                onClick={onOpenModal}
                disabled={buttonDisabled}
            >
                {INFO_USER_BUTTONS.QR_CODE_GEN_TEXT}
            </Button>
            <Modal
                title={MODAL_TEXT}
                visible={isModalVisible}
                confirmLoading={loading}
                onOk={form.submit}
                onCancel={onCancelModal}
                okText={MODAL_BUTTON_OK_LABEL}
                cancelText={MODAL_BUTTON_CANCEL_LABEL}
                centered
            >
                <Form
                    form={form}
                    onFinish={handleFinish}
                    layout="vertical"
                    validateTrigger="onSubmit"
                >
                    <Form.Item
                        label={MODAL_APP_LABEL_TEXT}
                        name="clientAppCode"
                        rules={[FORM_RULES.REQUIRED]}
                    >
                        <Select
                            placeholder={APP_CODE_PLACEHOLDER}
                            options={appsOptions}
                            onChange={onChangeAppCodeOrType}
                            disabled={loading}
                        />
                    </Form.Item>
                    <Form.Item
                        label={TYPE_LABEL_TEXT}
                        name="type"
                    >
                        <Select
                            className={styles.filterItem}
                            placeholder={TYPE_PLACEHOLDER}
                            options={TYPE_SELECT_OPTIONS}
                            disabled={loading}
                            onChange={onChangeAppCodeOrType}
                            clearIcon={<Cross />}
                            allowClear
                        />
                    </Form.Item>
                    <Form.Item noStyle dependencies={['type']}>
                        {({ getFieldValue }) => (
                            <Form.Item
                                {...FIELD_PROPS[(getFieldValue('type') as keyof FormItemProps['name'])]}
                                style={!getFieldValue('type') && { display: 'none' }}
                                rules={getFieldValue('type') && [FORM_RULES.REQUIRED]}
                            >
                                <Select
                                    placeholder={PROMOCAMPAIGN_OR_BUNDLE[(getFieldValue('type') as keyof FormItemProps['name'])]}
                                    options={getFieldValue('type') === 'group' ? groupCampaignList : promoCampaignList}
                                    disabled={loading}
                                    notFoundContent={<EmptyMessage />}
                                />
                            </Form.Item>
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UserGenerateQRModal;
