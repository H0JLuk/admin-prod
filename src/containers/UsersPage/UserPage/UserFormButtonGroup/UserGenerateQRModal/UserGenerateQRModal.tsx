import React, { useState } from 'react';
import { Button, Modal, Form, Select } from 'antd';
import { OptionData } from 'rc-select/lib/interface';
import { toDataURL } from 'qrcode';
import { INFO_USER_BUTTONS } from '../UserFormButtonGroup';
import { getLinkForQR } from '@apiServices/usersService';
import { downloadFileFunc } from '@utils/helper';
import { showNotify, MODE } from '../../UserFormHelper';
import { ClientAppDto, UserInfo } from '@types';
import { FORM_RULES } from '@utils/validators';

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
const MODAL_TEXT = 'Выберите витрину, для которой нужно сгенерировать QR-код';
const options = {
    scale: 8,
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

    const handleFinish = async ({ clientAppCode }: { clientAppCode: string; }) => {
        if (userId !== undefined) {
            setLoading(true);
            try {
                const qrCodeData = await getLinkForQR({ clientAppCode, userId });
                const qrUrl = await toDataURL(qrCodeData, options);

                downloadFileFunc(qrUrl, personalNumber, 'png');
                showNotify({ login: personalNumber, mode: MODE.QR_DOWNLOAD });
            } catch (err) {
                showNotify({ mode: MODE.ERROR, errorMessage: err.message });
            }
            setLoading(false);
            onCancelModal();
        }
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
                >
                    <Form.Item
                        label={MODAL_APP_LABEL_TEXT}
                        name="clientAppCode"
                        rules={[FORM_RULES.REQUIRED]}
                    >
                        <Select
                            placeholder={APP_CODE_PLACEHOLDER}
                            options={appsOptions}
                            disabled={loading}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UserGenerateQRModal;
