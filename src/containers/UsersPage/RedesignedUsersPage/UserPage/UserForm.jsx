import React, { useMemo, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useParams, generatePath } from 'react-router-dom';
import cn from 'classnames';
import { Form, Input } from 'antd';
import { ROUTE_ADMIN, ROUTE_ADMIN_USERS } from '../../../../constants/route';
import { addUser, getUser, removeUser, resetUser, saveUser, unblockUser } from '../../../../api/services/adminService';
import Header from '../../../../components/Header/Redisegnedheader/Header';
import AutocompleteLocationAndSalePoint from '../../../../components/Form/AutocompleteLocationAndSalePoint/AutocompleteLocationAndSalePoint';
import UserBlockStatus from '../../../../components/UserBlockStatus/UserBlockStatus';
import UserSkeletonLoading from './UserSkeletonLoading/UserSkeletonLoading';
import Checkboxes from '../../../../components/Checkboxes/Checkboxes';
import UserFormButtonGroup from './UserFormButtonGroup/UserFormButtonGroup';
import { getStringOptionValue } from '../../../../utils/utils';
import { getClientAppList } from '../../../../api/services/clientAppService';
import { getUserAppsCheckboxes } from './UserFormHelper';

import styles from './UserForm.module.css';


const PAGE_TITLE = 'Пользователи';
const USER_AVAILABLE_APPS = 'Доступные приложения';
const NEW_USER_TITLE = 'Новый пользователь';

const FORM_NAME_NEW_USER = 'createNewUser';
const FORM_NAME_EDIT_USER = 'editUser';

const LOGIN_FIELD = {
    name: 'login',
    label: 'Логин пользователя',
    placeholder: 'Табельный номер',
    requiredMark: true,
};

const LOCATION_FIELD = {
    label: 'Выберите локацию',
};

const SALE_POINT_FIELD = {
    label: 'Выберите точку продажи',
    requiredMark: true,
};

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
};

const buttonLayout = {
    wrapperCol: { span: 24 }
};

const errorLayout = {
    wrapperCol: { offset: 9, span: 14 }
};

const UserForm = ({ type }) => {
    const history = useHistory();
    const params = useParams();
    const { userId } = params;
    const notNewUser = ['edit', 'info'].includes(type);
    const [loading, setLoading] = useState(true);
    const [isSendingInfo, setIsSendingInfo] = useState(false);
    const [userData, setUserData] = useState(null);
    const [clientApps, setClientApps] = useState([]);
    const [login, setLogin] = useState(null);
    const [location, setLocation] = useState(null);
    const [salePoint, setSalePoint] = useState(null);
    const [checkBoxes, setCheckBoxes] = useState({});
    const [error, setError] = useState({ login: '', location: '', salePoint: '', backend: '' });
    const userName = useMemo(() => notNewUser && userData ? `Пользователь ${userData.personalNumber}` : NEW_USER_TITLE , [notNewUser, userData]);
    const formName = useMemo(() => notNewUser ? FORM_NAME_EDIT_USER : FORM_NAME_NEW_USER, [notNewUser]);

    const redirectToUsersPage = useCallback(() => {
        history.push(ROUTE_ADMIN.REDESIGNED_USERS);
    }, [history]);

    useEffect(() => {
        if (notNewUser && (!userId || isNaN(Number(userId)))) {
            redirectToUsersPage();
            return;
        }

        (async () => {
            try {
                let user;
                const { clientApplicationDtoList: appList = [] } = await getClientAppList();

                if (notNewUser) {
                    user = await getUser(userId);
                    setLocation({ id: user.locationId, name: user.locationName });
                    setSalePoint({ id: user.salePointId, name: user.salePointName });
                    setUserData(user);
                }

                const filteredApps = appList.filter(({ isDeleted }) => !isDeleted);
                setClientApps(filteredApps);
                setCheckBoxes(getUserAppsCheckboxes(filteredApps, user?.clientAppIds));
                setLoading(false);
            } catch (e) {
                redirectToUsersPage();
                console.warn(e);
            }
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = useCallback(async () => {
        if (!login && !notNewUser) {
            return setError({
                login: 'Укажите логин пользователя',
                location: '',
                salePoint: '',
                backend: '',
            });
        }

        if (!salePoint?.id) {
            return setError({
                location: '',
                login: '',
                salePoint: 'Выберите локацию или точку продажи',
                backend: '',
            });
        }

        const clientAppIds = Object.values(checkBoxes).reduce((appIds, { id, checked }) => {
            return [...appIds, ...(checked ? [id] : [])];
        }, []);

        setIsSendingInfo(true);

        try {
            const requestData = { clientAppIds, salePointId: salePoint.id };

            if (notNewUser) {
                await saveUser(userData.id, requestData);
                const updatedUser = await getUser(userData.id);
                setUserData(updatedUser);
            } else {
                await addUser({ ...requestData, personalNumber: login });
            }
        } catch (e) {
            setIsSendingInfo(false);
            return setError({
                login: '',
                location: '',
                salePoint: '',
                backend: e.message,
            });
        }

        setIsSendingInfo(false);

        setError({ login: '', location: '', salePoint: '', backend: '', });

        if (notNewUser && userData) {
            history.push(generatePath(ROUTE_ADMIN_USERS.USER_INFO, { userId: userData.id }));
        } else {
            redirectToUsersPage();
        }
    }, [login, redirectToUsersPage, notNewUser, history, userData, salePoint, checkBoxes]);

    const handleCheckBoxChange = useCallback((checked, name) => {
        setCheckBoxes((state) => ({
            ...state,
            [name]: {
                ...state[name],
                checked,
            },
        }));
    }, []);

    const handleChangeAllCheckbox = useCallback((checked) => {
        setCheckBoxes(
            (state) => Object.keys(state).reduce((result, key) => ({
                ...result,
                [key]: {
                    ...state[key],
                    checked: state[key].disabled ? state[key].checked : checked,
                },
            }), {})
        );
    }, []);

    const onResetPassword = useCallback(async () => {
        setIsSendingInfo(true);

        try {
            if (userData.blocked) {
                await unblockUser(userData.personalNumber);
                setUserData({ ...userData, blocked: false });
            } else {
                await resetUser(userData.personalNumber);
            }
        } catch (err) {
            setError({
                login: '',
                location: '',
                salePoint: '',
                backend: err.message,
            });
        }

        setIsSendingInfo(false);
    }, [userData]);

    const onEditUser = useCallback(() => {
        setError({
            login: '',
            location: '',
            salePoint: '',
            backend: '',
        });
        history.push(generatePath(ROUTE_ADMIN_USERS.EDIT_USER, { userId }));
    }, [history, userId]);

    const onCancel = useCallback(async () => {
        if (notNewUser && userData) {
            setCheckBoxes(getUserAppsCheckboxes(clientApps, userData.clientAppIds));
            setLocation({ id: userData.locationId, name: userData.locationName });
            setSalePoint({ id: userData.salePointId, name: userData.salePointName });
            setError({ location: '', salePoint: '', login: '', backend: '' });
            history.push(generatePath(ROUTE_ADMIN_USERS.USER_INFO, { userId: userData.id }));
        } else {
            redirectToUsersPage();
        }
    }, [history, notNewUser, userData, redirectToUsersPage, clientApps]);

    const onDelete = useCallback(async () => {
        try {
            setIsSendingInfo(true);
            await removeUser(userData.id);
            redirectToUsersPage();
        } catch (err) {
            setIsSendingInfo(false);
            setError({
                login: '',
                location: '',
                salePoint: '',
                backend: err.message,
            });
        }
    }, [userData, redirectToUsersPage]);

    const onLoginChange = useCallback((e) => setLogin(e.currentTarget.value), []);

    const onLocationChange = useCallback((location) => {
        setLocation(location);
        setError((state) => ({
            ...state,
            location: '',
            backend: '',
        }));
    }, []);

    const onSalePointChange = useCallback((salePoint) => {
        setSalePoint(salePoint);
        setError((state) => ({
            ...state,
            salePoint: '',
            backend: '',
        }));
    }, []);

    const errorText = useMemo(() => Object.values(error).find(Boolean), [error]);

    return (
        <>
            <Header />
            {loading ? (
                <UserSkeletonLoading />
            ) : (
                <div className={ styles.container }>
                    <div className={ styles.pageWrapper }>
                        <div className={ styles.header }>
                            <h4>{PAGE_TITLE}</h4>
                            <div className={ styles.pageTitle }>
                                {userName}
                                {notNewUser && (
                                    <UserBlockStatus
                                        className={ styles.userStatus }
                                        blocked={ userData.blocked }
                                    />
                                )}
                            </div>
                        </div>
                        <div className={ styles.formContainer }>
                            <Form
                                { ...layout }
                                className={ styles.form }
                                name={ formName }
                                requiredMark={ false }
                            >
                                <Form.Item
                                    className={ styles.formLeft }
                                    labelAlign="left"
                                    label={ `${ LOGIN_FIELD.label }${ !notNewUser ? '*' : '' }` }
                                    name={ LOGIN_FIELD.name }
                                >
                                    {!notNewUser ? (
                                        <Input
                                            className={ cn({ [styles.hasError]: !!error.login }) }
                                            placeholder={ LOGIN_FIELD.placeholder }
                                            size="large"
                                            onChange={ onLoginChange }
                                            autoFocus
                                            maxLength={ 8 }
                                        />
                                    ) : (
                                        <div className={ styles.noEditField }>
                                            { userData.personalNumber }
                                        </div>
                                    )}
                                </Form.Item>
                                {type !== 'info' ? (
                                    <AutocompleteLocationAndSalePoint
                                        layout={ layout }
                                        locationLabel={ LOCATION_FIELD.label }
                                        salePointLabel={ `${SALE_POINT_FIELD.label}*` }
                                        onLocationChange={ onLocationChange }
                                        onSalePointChange={ onSalePointChange }
                                        locationHasError={ !!error.location }
                                        salePointHasError={ !!error.salePoint }
                                        locationDisabled={ isSendingInfo }
                                        salePointDisabled={ isSendingInfo }
                                        autoFocusLocation={ type === 'edit' }
                                        initialLocationValue={ getStringOptionValue(location || undefined) }
                                        initialSalePointValue={ salePoint?.name }
                                        locationId={ location?.id }
                                    />
                                ) : (
                                    <>
                                        <div className={ styles.labelRow }>
                                            <div className={ cn(styles.labelTitle, `ant-col-${layout.labelCol.span}`) }>
                                                { LOCATION_FIELD.label }
                                            </div>
                                            <div className={ cn(styles.noEditField, `ant-col-${layout.wrapperCol.span}`) }>
                                                { location.name }
                                            </div>
                                        </div>
                                        <div className={ styles.labelRow }>
                                            <div className={ cn(styles.labelTitle, `ant-col-${layout.labelCol.span}`) }>
                                                { SALE_POINT_FIELD.label }
                                            </div>
                                            <div className={ cn(styles.noEditField, `ant-col-${layout.wrapperCol.span}`) }>
                                                { salePoint.name }
                                            </div>
                                        </div>
                                    </>
                                )}
                                {!!errorText && (
                                    <Form.Item { ...errorLayout }>
                                        <div className={ styles.formError }>
                                            { errorText }
                                        </div>
                                    </Form.Item>
                                )}
                                <Form.Item { ...buttonLayout }>
                                    <div className={ cn(styles.buttonsContainer, { [styles.center]: type === 'new' }) }>
                                        <UserFormButtonGroup
                                            type={ type }
                                            onDelete={ onDelete }
                                            onCancel={ onCancel }
                                            onSubmit={ onSubmit }
                                            onResetPassword={ onResetPassword }
                                            onEditUser={ onEditUser }
                                            disableAllButtons={ isSendingInfo }
                                            userBlocked={ userData?.blocked }
                                        />
                                    </div>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                    <div className={ styles.rightCol }>
                        <h4>{ USER_AVAILABLE_APPS }</h4>
                        <Checkboxes
                            checkboxesData={ checkBoxes }
                            onChange={ handleCheckBoxChange }
                            onChangeAll={ handleChangeAllCheckbox }
                            disabledAll={ type === 'info' || isSendingInfo }
                        />
                    </div>
                </div>
            )}
        </>
    );
};

UserForm.propTypes = {
    type: PropTypes.oneOf(['new', 'edit', 'info']),
};

UserForm.defaultProps = {
    type: 'info',
};

export default UserForm;
