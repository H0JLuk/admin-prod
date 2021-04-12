import React, { useCallback } from 'react';
import { Form, Input, Select, DatePicker, Button } from 'antd';
import 'moment/locale/ru';
import locale from 'antd/es/date-picker/locale/ru_RU';

const auditEventTypes = ['LOGIN', 'LOGOUT', 'FILE_UPLOAD', 'FILE_COPY', 'OFFERS_EXPORT', 'APPLICATION_URL_ADD', 'APPLICATION_URL_EDIT', 'APPLICATION_URL_DELETE', 'DZO_ADD', 'DZO_EDIT', 'DZO_DELETE', 'LANDING_ADD', 'LANDING_EDIT', 'LANDING_DELETE', 'CATEGORY_ADD', 'CATEGORY_EDIT', 'CATEGORY_DELETE', 'OFFER_ADD', 'OFFER_USE', 'REGISTER_CLIENT', 'REGISTER_USERS_TABLE', 'DELETE_USERS_TABLE', 'REGISTER_PROMO_CAMPAIGN_CLIENT', 'CLIENT_APPLICATION_ADD', 'CLIENT_APPLICATION_COPY', 'PROMO_CAMPAIGN_ADD', 'PROMO_CAMPAIGN_EDIT', 'PROMO_CAMPAIGN_COPY', 'PROMO_CAMPAIGN_DELETE', 'PROMO_CAMPAIGN_LANDING_ADD', 'PROMO_CAMPAIGN_LANDING_LINK', 'PROMO_CAMPAIGN_LANDING_UNLINK', 'PROMO_CAMPAIGN_LANDING_DELETE', 'PROMO_CAMPAIGN_BANNER_ADD', 'PROMO_CAMPAIGN_BANNER_EDIT', 'PROMO_CAMPAIGN_BANNER_DELETE', 'TMP_PASSWORD_TO_PERMANENT', 'PROMO_CAMPAIGN_TEXT_ADD', 'PROMO_CAMPAIGN_TEXT_EDIT', 'PROMO_CAMPAIGN_TEXT_DELETE', 'REGISTER_USER', 'EDIT_USER', 'USER_CLIENT_APPLICATION_ASSIGN', 'USER_SALE_POINT_ASSIGN', 'DELETE_USER', 'CHANGE_USER_ROLE', 'RESET_USER', 'USER_LOCK_CHANGED', 'SETTING_ADD', 'SETTING_UPDATE', 'LOCATION_ADD', 'LOCATION_EDIT', 'LOCATION_DELETE', 'SALE_POINT_ADD', 'SALE_POINT_EDIT', 'SALE_POINT_DELETE', 'VISIBILITY_SETTING_ADD', 'VISIBILITY_SETTING_EDIT', 'VISIBILITY_SETTING_DELETE', 'CAMPAIGN_GROUP_ADD', 'CAMPAIGN_GROUP_EDIT', 'CAMPAIGN_GROUP_DELETE', 'CAMPAIGN_GROUP_LINK_ADD', 'CAMPAIGN_GROUP_LINK_EDIT', 'CAMPAIGN_GROUP_LINK_DELETE', 'CAMPAIGN_GROUP_BANNER_ADD', 'CAMPAIGN_GROUP_BANNER_EDIT', 'CAMPAIGN_GROUP_BANNER_DELETE', 'CAMPAIGN_GROUP_TEXT_ADD', 'CAMPAIGN_GROUP_TEXT_EDIT', 'CAMPAIGN_GROUP_TEXT_DELETE', 'CAMPAIGN_GROUP_LINK_BANNER_ADD', 'CAMPAIGN_GROUP_LINK_BANNER_EDIT', 'CAMPAIGN_GROUP_LINK_BANNER_DELETE', 'CAMPAIGN_GROUP_LINK_TEXT_ADD', 'CAMPAIGN_GROUP_LINK_TEXT_EDIT', 'CAMPAIGN_GROUP_LINK_TEXT_DELETE', 'SEND_PUSH', 'CREATE_NOTIFICATION', 'SEND_PHONE_NUMBER_VERIFICATION_CODE', 'VERIFY_PHONE_NUMBER_VERIFICATION_CODE', 'UPDATE_PHONE_NUMBER_APPROVAL'];
const auditEventOptions = auditEventTypes.map(el => ({ label: el, value: el }));

const auditEventStatus = [
    {
        label: 'Успех',
        value: true
    },
    {
        label: 'Ошибка',
        value: false
    },
    {
        label: 'Не важно',
        value: null
    }
];

const dateFormat = 'DD.MM.YYYY HH:mm:ss';

const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 10 },
};

const formFooterLayout = {
    span: 10,
    offset: 3
};

const resetBtnStyles = {
    margin: '0 8px'
};

const initialValues = {
    success: null
};

const notValidValue = [undefined, null, ''];

const trimValue = (value) => value.trim();

const AuditFilter = ({ submit, applications }) => {
    const [form] = Form.useForm();

    const onReset = useCallback(() => {
        form.resetFields();
        submit();
    }, [form, submit]);

    const onSubmit = useCallback((fieldsValue) => {
        const { date, ...otherFieldsValue } = fieldsValue;
        let data = {};

        if (Array.isArray(date)) {
            data = {
                from: date[0].format(dateFormat),
                till: date[1].format(dateFormat)
            };
        }

        data = {
            ...Object.entries(otherFieldsValue).reduce(
                (obj, [key, value]) =>
                    !notValidValue.includes(value)
                        ? { ...obj, [key]: value }
                        : obj,
                {}
            ),
            ...data,
        };

        submit(data);
    }, [submit]);
    return (
        <Form { ...layout } form={ form } onFinish={ onSubmit } initialValues={ initialValues }>
            <Form.Item label="Тип события" name="type">
                <Select mode="multiple" options={ auditEventOptions } />
            </Form.Item>
            <Form.Item label="Витрина" name="clientAppCode">
                <Select options={ applications } allowClear />
            </Form.Item>
            <Form.Item
                label="Пользователь"
                name="userLogin"
                normalize={ trimValue }
            >
                <Input autoComplete="off" />
            </Form.Item>
            <Form.Item
                label="IP пользователя"
                name="userIp"
                normalize={ trimValue }
            >
                <Input autoComplete="off" />
            </Form.Item>
            <Form.Item label="Дата" name="date">
                <DatePicker.RangePicker showTime format={ dateFormat } locale={ locale } />
            </Form.Item>
            <Form.Item label="Статус события" name="success">
                <Select options={ auditEventStatus } />
            </Form.Item>
            <Form.Item wrapperCol={ formFooterLayout }>
                <Button type="primary" htmlType="submit">
                    Применить
                </Button>
                <Button htmlType="button" style={ resetBtnStyles } onClick={ onReset }>
                    Очистить
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AuditFilter;