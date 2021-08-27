import React, { useEffect, useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { StaticContext } from 'react-router';
import { Col, Form, Row, Input, Button } from 'antd';
import Loading from '@components/Loading';
import {
    createBusinessRole,
    deleteBusinessRole,
    editBusinessRole,
    getBusinessRoleById,
} from '@apiServices/businessRoleService';
import { customNotifications } from '@utils/notifications';
import { confirmModal } from '@utils/utils';
import { getFormattedDate } from '@utils/helper';
import { BUTTON_TEXT } from '@constants/common';
import { BusinessRoleDto, SaveBusinessRoleRequest } from '@types';
import { FORM_RULES, getPatternAndMessage } from '@utils/validators';

import styles from './BusinessRoleForm.module.css';

type LocationState = {
    businessRole?: BusinessRoleDto;
};

export type BusinessRoleFormRouteProps = RouteComponentProps<{ businessRoleId: string; }, StaticContext, LocationState>;

interface BusinessRoleFormProps extends BusinessRoleFormRouteProps {
    matchPath: string;
    mode: string;
}

type FormDataBusinessRole = SaveBusinessRoleRequest & {
    startDate?: string;
    endDate?: string;
};

const NEW_BUSINESS_ROLE_TITLE = 'Новая бизнес-роль';

export const PLACEHOLDER = {
    NAME: 'Укажите название',
    DESCRIPTION: 'Укажите описание',
};

const LABEL = {
    NAME: 'Название',
    DESCRIPTION: 'Описание',
    START_DATE: 'Начало действия',
};

const ACTION_TEXT_BY_TYPE = {
    create: 'создана',
    edit: 'обновлена',
    delete: 'удалена',
};

function getNotifyMessage(type: keyof typeof ACTION_TEXT_BY_TYPE, name: string) {
    return <span>Бизнес-роль <b>{name}</b> успешно {ACTION_TEXT_BY_TYPE[type]}</span>;
}

function getInitialValue({ name, description, startDate }: BusinessRoleDto) {
    return {
        name: name ?? '',
        description: description ?? '',
        startDate: startDate as string,
    };
}

const BusinessRoleForm: React.FC<BusinessRoleFormProps> = ({
    matchPath,
    mode,
    location,
    history,
    match,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [error, setError] = useState('');
    const { businessRoleId } = match.params;
    const initialData = useRef({} as FormDataBusinessRole);
    const isEdit = mode === 'edit';

    const goToBusinessRolesList = (redirect?: boolean) => history[redirect ? 'replace' : 'push'](matchPath);

    useEffect(() => {
        (async () => {
            if (isEdit) {
                if (!businessRoleId) {
                    goToBusinessRolesList(true);
                    return;
                }

                let { businessRole } = location.state || {};

                if (!businessRole) {
                    businessRole = await getBusinessRoleById(businessRoleId);

                    if (!businessRole) {
                        goToBusinessRolesList(true);
                        return;
                    }

                    businessRole = {
                        ...businessRole,
                        startDate: getFormattedDate(businessRole.startDate),
                        endDate: getFormattedDate(businessRole.endDate),
                    };

                    history.replace(location.pathname, { businessRole });
                }

                initialData.current = getInitialValue(businessRole);
                form.setFieldsValue(initialData.current);
            }

            setLoading(false);
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onFinish = async (formData: SaveBusinessRoleRequest) => {
        setLoading(true);
        try {
            if (isEdit) {
                await editBusinessRole(businessRoleId, formData);
                history.replace(location.pathname);
            } else {
                await createBusinessRole(formData);
            }

            customNotifications.success({
                message: getNotifyMessage(isEdit ? 'edit' : 'create', formData.name),
            });
            goToBusinessRolesList();
        } catch (e) {
            setError(e.message);
            setLoading(false);
        }
    };

    const deleteRole = async () => {
        setLoading(true);
        try {
            await deleteBusinessRole(businessRoleId);
            customNotifications.success({
                message: getNotifyMessage('delete', initialData.current.name),
            });
            goToBusinessRolesList(true);
        } catch (e) {
            setLoading(false);
            setError(e.message);
        }
    };

    const onDeleteClick = () => {
        confirmModal({
            onOk: deleteRole,
            title: <span>Вы действительно хотите удалить бизнес-роль <b>{initialData.current.name}</b></span>,
        });
    };

    return (
        <>
            {loading && <Loading />}
            <div className={styles.container}>
                <div className={styles.title}>
                    {isEdit ? initialData.current.name : NEW_BUSINESS_ROLE_TITLE}
                </div>
                <div className={styles.formWrapper}>
                    <Form
                        id="businessRole"
                        className={styles.formContainer}
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        onFieldsChange={isEdit ? (() => setIsSubmitDisabled(false)) : undefined}
                        validateTrigger="onSubmit"
                    >
                        <Row gutter={[24, 6]}>
                            <Col span={12}>
                                <Form.Item
                                    name="name"
                                    label={LABEL.NAME}
                                    rules={[
                                        FORM_RULES.REQUIRED,
                                        {
                                            ...getPatternAndMessage('businessRole', 'name'),
                                        },
                                    ]}
                                    required
                                >
                                    <Input
                                        placeholder={PLACEHOLDER.NAME}
                                        allowClear
                                        maxLength={50}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    name="description"
                                    label={LABEL.DESCRIPTION}
                                    rules={[
                                        {
                                            ...getPatternAndMessage('businessRole', 'description'),
                                        },
                                    ]}
                                >
                                    <Input.TextArea
                                        placeholder={PLACEHOLDER.DESCRIPTION}
                                        rows={2}
                                        maxLength={300}
                                    />
                                </Form.Item>
                            </Col>

                            {isEdit && (
                                <Col span={12}>
                                    <div>{LABEL.START_DATE}</div>
                                    <div className={styles.noEditField}>
                                        {form.getFieldValue('startDate')}
                                    </div>
                                </Col>
                            )}
                        </Row>
                    </Form>
                    {error && <span className={styles.error}>{error}</span>}
                </div>
                <div className={styles.btnGroup}>
                    <Button onClick={() => goToBusinessRolesList()}>
                        {BUTTON_TEXT.CANCEL}
                    </Button>
                    <Button
                        htmlType="submit"
                        form="businessRole"
                        type="primary"
                        disabled={isEdit && isSubmitDisabled}
                    >
                        {isEdit ? BUTTON_TEXT.SAVE : BUTTON_TEXT.ADD}
                    </Button>
                    {isEdit && (
                        <Button
                            type="primary"
                            onClick={onDeleteClick}
                            danger
                        >
                            {BUTTON_TEXT.DELETE}
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
};

export default BusinessRoleForm;
