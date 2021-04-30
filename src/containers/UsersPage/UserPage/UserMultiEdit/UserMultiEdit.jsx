import React, { useState, useCallback, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Form } from 'antd';
import { editLocationAndSalePointUsers, removeUser } from '../../../../api/services/usersService';
import Header from '../../../../components/Header/Header';
import AutocompleteLocationAndSalePoint from '../../../../components/Form/AutocompleteLocationAndSalePoint/AutocompleteLocationAndSalePoint';
import UserFormButtonGroup from '../UserFormButtonGroup/UserFormButtonGroup';

import styles from './UserMultiEdit.module.css';

const PAGE_TITLE = 'Пользователи';
export const CHOSE_USERS_COUNT = 'Выбрано пользователей';

const LOCATION_FIELD = {
    label: 'Выберите локацию',
};
const SALE_POINT_FIELD = {
    label: 'Выберите точку продажи',
};
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
};

const ACTION_PERMISSIONS = {
    deleteUser: true,
};

const UserMultiEdit = ({ matchPath }) => {
    const [location, setLocation] = useState(null);
    const [salePoint, setSalePoint] = useState(null);
    const [error, setError] = useState({ location: '', salePoint: '', backend: '' });
    const [isSendingInfo, setIsSendingInfo] = useState(false);
    const [arrUsersIds, setArrUsersIds] = useState([]);
    const [userRoleExist, setUserRoleExist] = useState(false);
    const history = useHistory();
    const { state: { users = [] } = {} } = useLocation();

    const redirectToUsersPage = useCallback(() => history.push(matchPath), [history, matchPath]);

    useEffect(() => {
        if (!users?.length) {
            redirectToUsersPage();
        }

        setUserRoleExist(users.some(({ role }) => role === 'User'));
        setArrUsersIds(users.map(({ id }) => id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onLocationChange = useCallback((location) => {
        setLocation(location);
        setError({ location: '', salePoint: '', backend: '' });
    }, []);

    const onSalePointChange = useCallback((salePoint) => {
        setSalePoint(salePoint);
        setError({ location: '', salePoint: '', backend: '' });
    }, []);

    const onCancel = useCallback(() => redirectToUsersPage(), [redirectToUsersPage]);

    const onDelete = useCallback(async () => {
        setIsSendingInfo(true);

        // TODO: изменить этот кусок кода, когда на бэке добавят API для удаления нескольких пользователей
        try {
            const requestPromises = arrUsersIds.map(removeUser);

            await Promise.all(requestPromises);
            redirectToUsersPage();
        } catch (e) {
            setIsSendingInfo(false);
            setError({ location: '', salePoint: '', backend: e.message });
        }
    }, [redirectToUsersPage, arrUsersIds]);

    const onSubmit = useCallback(async () => {
        if (userRoleExist && !salePoint) {
            return setError({ location: '', salePoint: 'Выберите действительную точку продажи', backend: '' });
        }

        setIsSendingInfo(true);

        try {
            await editLocationAndSalePointUsers({
                userIds: arrUsersIds,
                salePointId: salePoint?.id,
            });
            redirectToUsersPage();
        } catch (e) {
            setIsSendingInfo(false);
            setError({ location: '', salePoint: '', backend: e.message });
        }
    }, [salePoint, arrUsersIds, redirectToUsersPage, userRoleExist]);

    return (
        <>
            <Header />
            <div className={ styles.container }>
                <div className={ styles.header }>
                    <h4>{ PAGE_TITLE }</h4>
                    <div className={ styles.pageTitle }>
                        { `${CHOSE_USERS_COUNT} ${arrUsersIds.length}` }
                    </div>
                </div>
                <div className={ styles.formContainer }>
                    <Form { ...layout } className={ styles.form } requiredMark={ false }>
                        <AutocompleteLocationAndSalePoint
                            layout={ layout }
                            locationDisabled={ isSendingInfo }
                            salePointDisabled={ isSendingInfo }
                            locationLabel={ LOCATION_FIELD.label }
                            salePointLabel={ SALE_POINT_FIELD.label }
                            salePointLabelClassNames={ userRoleExist ? 'required': '' }
                            onLocationChange={ onLocationChange }
                            onSalePointChange={ onSalePointChange }
                            autoFocusLocation={ true }
                            locationId={ location?.id }
                            error={ error }
                        />
                    </Form>
                    { !!error.backend && <div className={ styles.formError }>{ error.backend }</div> }
                </div>
                <div className={ styles.buttonsContainer }>
                    <UserFormButtonGroup
                        type="edit"
                        onCancel={ onCancel }
                        onSubmit={ onSubmit }
                        onDelete={ onDelete }
                        disableAllButtons={ isSendingInfo }
                        actionPermissions={ ACTION_PERMISSIONS }
                    />
                </div>
            </div>
        </>
    );
};

export default UserMultiEdit;
