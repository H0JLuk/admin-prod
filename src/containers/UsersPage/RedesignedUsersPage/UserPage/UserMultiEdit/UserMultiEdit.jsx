import React, { useState, useCallback, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Form } from 'antd';
import Header from '../../../../../components/Header/Redisegnedheader/Header';
import AutocompleteLocationAndSalePoint from '../../../../../components/Form/AutocompleteLocationAndSalePoint/AutocompleteLocationAndSalePoint';
import UserFormButtonGroup from '../UserFormButtonGroup/UserFormButtonGroup';
import { ROUTE_ADMIN } from '../../../../../constants/route';
import { editLocationAndSalePointUsers, removeUser } from '../../../../../api/services/adminService';

import styles from './UserMultiEdit.module.css';

const PAGE_TITLE = 'Пользователи';
const CHOSE_USERS_COUNT = 'Выбрано пользователей';

const LOCATION_FIELD = {
    label: 'Выберите локацию',
};
const SALE_POINT_FIELD = {
    label: 'Выберите точку продажи*',
};
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
};

const errorLayout = {
    wrapperCol: { offset: 9, span: 14 }
};
const buttonLayout = {
    wrapperCol: { span: 24 }
};

const UserMultiEdit = () => {
    const [location, setLocation] = useState(null);
    const [salePoint, setSalePoint] = useState(null);
    const [error, setError] = useState('');
    const [isSendingInfo, setIsSendingInfo] = useState(false);
    const [arrUsersIds, setArrUsersIds] = useState([]);
    const history = useHistory();
    const params = useParams();
    const { userIds } = params;

    const redirectToUsersPage = useCallback(() => {
        history.push(ROUTE_ADMIN.REDESIGNED_USERS);
    }, [history]);

    useEffect(() => {
        if (!userIds) {
            redirectToUsersPage();
        }

        setArrUsersIds(userIds.split(','));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onLocationChange = useCallback((location) => {
        setLocation(location);
        setError('');
    }, []);

    const onSalePointChange = useCallback((salePoint) => {
        setSalePoint(salePoint);
        setError('');
    }, []);

    const onCancel = useCallback(() => {
        redirectToUsersPage();
    }, [redirectToUsersPage]);

    const onDelete = useCallback(async () => {
        setIsSendingInfo(true);

        // TODO: изменить этот кусок кода, когда на бэке добавят API для удаления нескольких пользователей
        try {
            const requestPromises = arrUsersIds.map(userId => removeUser(userId));

            await Promise.all(requestPromises);
            redirectToUsersPage();
        } catch (e) {
            setIsSendingInfo(false);
            return setError(e.message);
        }
    }, [redirectToUsersPage, arrUsersIds]);

    const onSubmit = useCallback(async () => {
        if (!salePoint) {
            return setError('Выберите локацию или точку продажи');
        }

        setIsSendingInfo(true);

        try {
            await editLocationAndSalePointUsers({
                userIds: arrUsersIds,
                salePointId: salePoint.id,
            });
            redirectToUsersPage();
        } catch (e) {
            setIsSendingInfo(false);
            return setError(e.message);
        }
    }, [salePoint, arrUsersIds, redirectToUsersPage]);

    return (
        <>
            <Header />
            <div className={ styles.container }>
                <div className={ styles.content }>
                    <div className={ styles.header }>
                        <h4>{PAGE_TITLE}</h4>
                        <div className={ styles.pageTitle }>
                            {`${CHOSE_USERS_COUNT} ${arrUsersIds.length}`}
                        </div>
                    </div>
                    <div className={ styles.formContainer }>
                        <Form
                            { ...layout }
                            className={ styles.form }
                            requiredMark={ false }
                        >
                            <AutocompleteLocationAndSalePoint
                                layout={ layout }
                                locationDisabled={ isSendingInfo }
                                salePointDisabled={ isSendingInfo }
                                locationLabel={ LOCATION_FIELD.label }
                                salePointLabel={ SALE_POINT_FIELD.label }
                                onLocationChange={ onLocationChange }
                                onSalePointChange={ onSalePointChange }
                                salePointHasError={ !!error && !salePoint }
                                autoFocusLocation={ true }
                                locationId={ location?.id }
                            />
                            {!!error && (
                                <Form.Item { ...errorLayout }>
                                    <div className={ styles.formError }>
                                        { error }
                                    </div>
                                </Form.Item>
                            )}
                            <Form.Item
                                { ...buttonLayout }
                            >
                                <div className={ styles.buttonsContainer }>
                                    <UserFormButtonGroup
                                        type="edit"
                                        onCancel={ onCancel }
                                        onSubmit={ onSubmit }
                                        onDelete={ onDelete }
                                        disableAllButtons={ isSendingInfo }
                                    />
                                </div>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserMultiEdit;
