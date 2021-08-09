import React, { useState, useEffect, useRef } from 'react';
import { generatePath, RouteComponentProps } from 'react-router-dom';
import { Col, Row, Button } from 'antd';

import Loading from '@components/Loading';
import { getBusinessRoleById, deleteBusinessRole } from '@apiServices/businessRoleService';

import { BusinessRoleDto } from '@types';
import { customNotifications } from '@utils/notifications';
import { confirmModal } from '@utils/utils';
import { BUSINESS_ROLE_PAGES } from '@constants/route';
import { getFormattedDate } from '@utils/helper';
import { BUTTON_TEXT } from '@constants/common';

import styles from './BusinessRoleInfo.module.css';

const BUSINESS_ROLE_INFO_FIELDS: { label: string; name: keyof BusinessRoleDto; }[] = [
    {
        label: 'Название',
        name: 'name',
    },
    {
        label: 'Описание',
        name: 'description',
    },
    {
        label: 'Начало действия',
        name: 'startDate',
    },
];

function getNotifyDeletedMessage(name: string) {
    return <span>Бизнес-роль <b>{name}</b> успешно удалена</span>;
}

interface BusinessRoleInfoProps extends RouteComponentProps<{ businessRoleId: string; }> {
    matchPath: string;
}

const BusinessRoleInfo: React.FC<BusinessRoleInfoProps> = ({
    matchPath,
    match,
    history,
}) => {
    const { businessRoleId } = match.params;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const businessRole = useRef({} as BusinessRoleDto);

    const goToBusinessRolesList = (redirect?: boolean) => history[redirect ? 'replace' : 'push'](matchPath);

    useEffect(() => {
        if (!businessRoleId) {
            goToBusinessRolesList(true);
            return;
        }

        (async () => {
            try {
                const businessRoleData = await getBusinessRoleById(businessRoleId);

                if (!businessRoleData) {
                    goToBusinessRolesList(true);
                    return;
                }

                businessRole.current = {
                    ...businessRoleData,
                    startDate: getFormattedDate(businessRoleData.startDate),
                    endDate:  getFormattedDate(businessRoleData.endDate),
                };
            } catch (err) {
                setError(err.message);
            }
            setLoading(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) {
        return (
            <div className={styles.container}>
                <Loading />
            </div>
        );
    }

    const onEdit = () => {
        history.push(generatePath(`${ matchPath }${ BUSINESS_ROLE_PAGES.EDIT_BUSINESS_ROLE }`, { businessRoleId }), { businessRole: businessRole.current });
    };

    const deleteRole = async () => {
        try {
            await deleteBusinessRole(businessRoleId);
            customNotifications.success({
                message: getNotifyDeletedMessage(businessRole.current.name),
            });
            goToBusinessRolesList(true);
        } catch (e) {
            setError(e.message);
        }
    };

    const onDeleteClick = () => {
        confirmModal({
            onOk: deleteRole,
            title: <span>Вы действительно хотите удалить бизнес-роль <b>{businessRole.current.name}</b>?</span>,
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.title}>
                {businessRole.current.name}
            </div>
            <div className={styles.wrapper}>
                <Row gutter={[24, 30]} className={styles.block}>
                    {BUSINESS_ROLE_INFO_FIELDS.map((field, index) => (
                        <Col
                            key={index}
                            span={12}
                        >
                            <div>{field.label}</div>
                            <div className={styles.fieldValue}>
                                {businessRole.current[field.name] || <i>{`${field.label} отсутствует`}</i>}
                            </div>
                        </Col>
                    ))}
                </Row>
                {error && <span className={styles.error}>{error}</span>}
            </div>
            <div className={styles.btnGroup}>
                <Button
                    type="primary"
                    onClick={onEdit}
                >
                    {BUTTON_TEXT.EDIT}
                </Button>
                <Button
                    type="primary"
                    danger
                    onClick={onDeleteClick}
                >
                    {BUTTON_TEXT.DELETE}
                </Button>
            </div>
        </div>
    );
};

export default BusinessRoleInfo;
