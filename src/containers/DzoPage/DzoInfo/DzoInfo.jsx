import React from 'react';
import { generatePath, useHistory, useLocation } from 'react-router-dom';
import { Col, Row, Space, Button } from 'antd';
import Header from '../../../components/Header/Header';
import { DZO_PAGES } from '../../../constants/route';
import { deleteDzo } from '../../../api/services/dzoService';
import { confirmModal, errorModal, successModal } from '../../../utils/utils';

import styles from './DzoInfo.module.css';

const DZO_NAME = 'Название';
const DZO_CODE = 'Код';
const DZO_DESCRIPTION = 'Описание';
const DZO_APP_TYPE = 'Тип приложения';
const DZO_QR_URL = 'Ссылка для QR-кода';
const EDIT = 'Редактировать';
const DELETE = 'Удалить';
const OK_TEXT = 'Хорошо';
const DELETE_CONFIRMATION_MODAL_TITLE = 'Вы действительно хотите удалить ДЗО';
const ERROR_DELETE_DZO = 'Ошибка удаления ДЗО';

const DZO_INFO_TEMPLATE_DATA = [
    [
        { key: 'dzoName', label: DZO_NAME },
        { key: 'dzoCode', label: DZO_CODE },
    ],
    [
        { key: 'description', label: DZO_DESCRIPTION },
    ],
];

const DZO_INFO_APPS_TEMPLATE = [
    { key: 'applicationType', label: DZO_APP_TYPE },
    { key: 'applicationUrl', label: DZO_QR_URL, type: 'url' },
];

const DzoInfo = ({ matchPath }) => {
    const history = useHistory();
    const { state: stateFromLocation } = useLocation();
    const { dzoData } = stateFromLocation || {};
    const redirectToDzoList = () => history.push(matchPath);
    if (!dzoData) {
        history.push(matchPath);
        return null;
    }

    const { dzoId, applicationList } = dzoData;

    const onEdit = () => {
        history.push(generatePath(`${ matchPath }${ DZO_PAGES.DZO_EDIT }`, { dzoId }), { dzoData });
    };

    const onDelete = async () => {

        try {
            await deleteDzo(dzoId);

            // TODO: maybe later change this to notification
            successModal({
                onOk: redirectToDzoList,
                title: (
                    <span>
                        ДЗО <span className={ styles.text }>{ dzoData.dzoName }</span> успешно удалено
                    </span>
                ),
                okText: OK_TEXT,
            });
        } catch (e) {
            const { message } = e;

            errorModal({
                title: (
                    <span>
                        { ERROR_DELETE_DZO } <span className={ styles.text }>{ message }</span>
                    </span>
                ),
            });
            console.warn(e);
        }

    };

    const onDeleteClick = () => {
        confirmModal({
            title: (
                    <span>
                        { DELETE_CONFIRMATION_MODAL_TITLE } <span className={ styles.text }>{ `${dzoData.dzoName}?` }</span>
                    </span>
                ),
            okText: DELETE,
            onOk: onDelete,
            okButtonProps: { danger: true },
        });
    };

    return (
        <div className={ styles.dzoWrapper }>
            <Header />
            <div className={ styles.container }>
                    <div className={ styles.dzoTitle }>
                        { dzoData.dzoName }
                    </div>
                <div className={ styles.infoWrapper }>
                    <div className={ styles.dzoInfo }>
                        { DZO_INFO_TEMPLATE_DATA.map((row, index) => (
                            <Row gutter={ [24, 16] } key={ index }>
                                { row.map(({ key, label }) => (
                                    <DzoInfoBlock
                                        key={ key }
                                        label={ label }
                                        value={ dzoData[key] }
                                        colSpan={ 24 / row.length }
                                    />
                                )) }
                            </Row>
                        )) }
                        { applicationList.map(dzoApp => (
                            <Row gutter={ [24, 16] } key={ dzoApp.applicationId }>
                                { DZO_INFO_APPS_TEMPLATE.map(({ key, label, type }) => (
                                    <DzoInfoBlock
                                        key={ key }
                                        label={ label }
                                        value={ dzoApp[key] }
                                        type={ type }
                                        colSpan={ 12 }
                                    />
                                )) }
                            </Row>
                        )) }
                    </div>
                </div>
                <div className={ styles.footer }>
                    <Space>
                        <Button
                            type="primary"
                            onClick={ onEdit }
                        >
                            { EDIT }
                        </Button>
                        <Button
                            type="primary"
                            danger
                            onClick={ onDeleteClick }
                        >
                            { DELETE }
                        </Button>
                    </Space>
                </div>
            </div>
        </div>
    );
};

export default DzoInfo;

function DzoInfoBlock({ label, value, type, colSpan }) {
    return (
        <Col span={ colSpan }>
            <div className={ styles.title }>{label}</div>
            <span className={ styles.text }>
                {type === 'url' ? decodeURI(value) : value}
            </span>
        </Col>
    );
}
