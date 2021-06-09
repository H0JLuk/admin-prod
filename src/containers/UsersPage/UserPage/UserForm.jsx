import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useParams, generatePath } from 'react-router-dom';
import cn from 'classnames';
import { /* Col, */ Form, Input, /* Row, Select, */ Typography, message } from 'antd';
import { USERS_PAGES } from '../../../constants/route';
import { addUser, getUser, removeUser, resetUser, saveUser, unblockUser } from '../../../api/services/usersService';
import Header from '../../../components/Header/Header';
import AutocompleteLocationAndSalePoint from '../../../components/Form/AutocompleteLocationAndSalePoint/AutocompleteLocationAndSalePoint';
import UserBlockStatus from '../../../components/UserBlockStatus/UserBlockStatus';
import UserSkeletonLoading from './UserSkeletonLoading/UserSkeletonLoading';
import Checkboxes from '../../../components/Checkboxes/Checkboxes';
import UserFormButtonGroup from './UserFormButtonGroup/UserFormButtonGroup';
import { getActiveClientApps } from '../../../api/services/clientAppService';
import { getUserAppsCheckboxes } from './UserFormHelper';
// import { LOGIN_TYPE, LOGIN_TYPES_ENUM, LOGIN_TYPE_OPTIONS } from '../../../constants/loginTypes';
import { getCurrUserInteractionsForOtherUser } from '../../../constants/permissions';
import { getStringOptionValue } from '../../../utils/utils';
import { customNotifications } from '../../../utils/notifications';

import styles from './UserForm.module.css';

const { Paragraph } = Typography;

const USER_AVAILABLE_APPS = 'Доступные приложения';
const NEW_USER_TITLE = 'Новый пользователь';

const PASSWORD_FIELD = {
    label: 'Временный пароль',
    name: 'tempPassword',
};

export const LOGIN_FIELD = {
    name: 'login',
    label: 'Логин пользователя',
    placeholder: 'Табельный номер',
};

const LOCATION_FIELD = {
    label: 'Локация',
    labelEdit: 'Выберите локацию',
};

const SALE_POINT_FIELD = {
    label: 'Точка продажи',
    labelEdit: 'Выберите точку продажи',
};

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
};

const DEFAULT_ERRORS = { login: '', location: '', salePoint: '', backend: '' };

export const MODE = {
    CREATE: 'CREATE',
    EDIT: 'EDIT',
    RESTORED: 'RESTORED',
    DELETE: 'DELETE',
    ERROR: 'ERROR',
};

const USER_PASSWORD = 'Пароль пользователя';
const NEW_USER_PASSWORD = 'Новый пароль пользователя';
const COPY = 'Копировать';
const ON_COPY = 'Скопировано';

const patternLogin = /[^a-zа-яё0-9]+/i;

const userMessage = (login, pwd, mode, errorMessage) => {
    switch (mode) {
        case MODE.CREATE: {
            return {
                message: `Пользователь с табельным номером ${ login } успешно создан`,
                description: (
                    <Paragraph copyable={ { text: pwd, tooltips: [ COPY, ON_COPY ] } } className={ styles.copyable }>
                        { USER_PASSWORD }: { pwd }
                    </Paragraph>
                ),
            };
        }
        case MODE.EDIT: {
            return {
                message: 'Данные пользователя успешно обновлены',
                description: pwd ? (
                    <Paragraph copyable={ { text: pwd, tooltips: [ COPY, ON_COPY ] } } className={ styles.copyable }>
                        { USER_PASSWORD }: { pwd }
                    </Paragraph>
                ) : '',
            };
        }
        case MODE.RESTORED: {
            return {
                message: `Пароль пользователя с табельным номером ${ login } успешно сброшен`,
                description: (
                    <Paragraph copyable={ { text: pwd, tooltips: [ COPY, ON_COPY ] } } className={ styles.copyable } >
                        { NEW_USER_PASSWORD }: { pwd }
                    </Paragraph>
                ),
            };
        }
        case MODE.DELETE: {
            return {
                message: `Пользователь с табельным номером ${ login } успешно удален`,
                description: '',
            };
        }
        case MODE.ERROR: {
            return {
                message: errorMessage,
                description: '',
            };
        }
        default: {
            return {
                message: '',
                description: '',
            };
        }
    }
};

const showNotify = ({ login, pwd, mode, errorMessage }) => {
    const notifyConfig = userMessage(login, pwd, mode, errorMessage);

    if (mode === MODE.ERROR) {
        return customNotifications.error(notifyConfig);
    }
    customNotifications.success(notifyConfig);
};

const errorEditPermissions = (personalNumber) => (
    <span>
        У вас недостаточно полномочий чтобы редактировать пользователя с табельным номером
        <b> { personalNumber }</b>
    </span>
);

const UserForm = ({ type, matchPath }) => {
    const history = useHistory();
    const params = useParams();
    const { userId } = params;
    const notNewUser = ['edit', 'info'].includes(type);
    const isInfo = type === 'info';
    const [loading, setLoading] = useState(true);
    const [isSendingInfo, setIsSendingInfo] = useState(false);
    const [userData, setUserData] = useState(null);
    const clientAppsRef = useRef([]);
    const clientApps = clientAppsRef.current;
    const [login, setLogin] = useState(null);
    const [location, setLocation] = useState(null);
    const [salePoint, setSalePoint] = useState(null);
    const [checkBoxes, setCheckBoxes] = useState({});
    const [error, setError] = useState(DEFAULT_ERRORS);
    const userInteractions = useRef({});

    const redirectToUsersPage = useCallback(() => history.push(matchPath), [history, matchPath]);

    const getUserData = async () => {
        try {
            let user;
            const clientAppList = await getActiveClientApps();

            if (notNewUser) {
                user = await getUser(userId);
                setLocation({ id: user.locationId, name: user.locationName });
                setSalePoint({ id: user.salePointId, name: user.salePointName });
                setUserData(user);
                userInteractions.current = getCurrUserInteractionsForOtherUser(user.role); // TODO: вынести подобные настройки доступа в контекст, чтобы не вызывать каждый раз функции на получения этих настроек

                if (!isInfo && !userInteractions.current.editUser) {
                    message.error(errorEditPermissions(user.personalNumber));
                    history.replace(generatePath(`${matchPath}${USERS_PAGES.USER_INFO}`, { userId }));
                    return;
                }
            }

            clientAppsRef.current = clientAppList;
            setCheckBoxes(getUserAppsCheckboxes(clientAppList, user?.clientAppIds));
            setLoading(false);
        } catch (e) {
            redirectToUsersPage();
            console.warn(e);
        }
    };

    useEffect(() => {
        if (notNewUser && (!userId || isNaN(Number(userId)))) {
            redirectToUsersPage();
            return;
        }
        if (!isInfo) {
            getUserData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isInfo) {
            setLoading(true);
            getUserData();
            setError(DEFAULT_ERRORS);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInfo]);

    const onSubmit = async () => {
        if (!notNewUser) {
            if (!login) {
                return setError({ ...DEFAULT_ERRORS, login: 'Укажите логин пользователя' });
            }

            if (patternLogin.test(login)) {
                return setError({ ...DEFAULT_ERRORS, login: 'Логин пользователя должен содержать только латинские буквы либо цифры' });
            }
        }

        if ((!userData || userData.role === 'User') && typeof salePoint?.id !== 'number') {
            return setError({ ...DEFAULT_ERRORS, salePoint: 'Выберите точку продажи' });
        }

        const clientAppIds = Object.values(checkBoxes).reduce((appIds, { id, checked }) => {
            return [...appIds, ...(checked ? [id] : [])];
        }, []);

        setIsSendingInfo(true);

        try {
            const requestData = { clientAppIds, salePointId: salePoint?.id };

            if (notNewUser) {
                const { newPassword } = await saveUser(userData.id, requestData);
                showNotify({ mode: MODE.EDIT, pwd: newPassword });
            } else {
                const { generatedPassword } = await addUser({ ...requestData, personalNumber: login });
                showNotify({ login, pwd: generatedPassword, mode: MODE.CREATE });
            }
        } catch (e) {
            setIsSendingInfo(false);
            return setError({ ...DEFAULT_ERRORS, backend: e.message });
        }

        setIsSendingInfo(false);

        setError(DEFAULT_ERRORS);

        if (notNewUser && userData) {
            history.push(generatePath(`${matchPath}${USERS_PAGES.USER_INFO}`, { userId: userData.id }));
        } else {
            redirectToUsersPage();
        }
    };

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
        setCheckBoxes((state) =>
            Object.keys(state).reduce(
                (result, key) => ({
                    ...result,
                    [key]: {
                        ...state[key],
                        checked: state[key].disabled ? state[key].checked : checked,
                    },
                }),
                {}
            )
        );
    }, []);

    const onResetPassword = useCallback(async () => {
        setIsSendingInfo(true);

        try {
            if (userData.tmpBlocked) {
                await unblockUser(userData.personalNumber);
                setUserData({ ...userData, tmpBlocked: false });
            } else {
                const { generatedPassword } = await resetUser(userData.personalNumber);
                setUserData({ ...userData, tempPassword: true });
                showNotify({ login: userData.personalNumber, pwd: generatedPassword, mode: MODE.RESTORED });
            }
        } catch (err) {
            showNotify({ mode: MODE.ERROR, errorMessage: err.message });
            setError({ ...DEFAULT_ERRORS, backend: err.message });
        }

        setIsSendingInfo(false);
    }, [userData]);

    const onEditUser = useCallback(() => {
        setError(DEFAULT_ERRORS);
        history.push(generatePath(`${matchPath}${USERS_PAGES.EDIT_USER}`, { userId }));
    }, [history, userId, matchPath]);

    const onCancel = useCallback(async () => {
        if (notNewUser && userData) {
            setCheckBoxes(getUserAppsCheckboxes(clientApps, userData.clientAppIds));
            setLocation({ id: userData.locationId, name: userData.locationName });
            setSalePoint({ id: userData.salePointId, name: userData.salePointName });
            setError(DEFAULT_ERRORS);
            history.push(generatePath(`${matchPath}${USERS_PAGES.USER_INFO}`, { userId: userData.id }));
        } else {
            redirectToUsersPage();
        }
    }, [history, notNewUser, userData, redirectToUsersPage, clientApps, matchPath]);

    const onDelete = useCallback(async () => {
        try {
            setIsSendingInfo(true);
            await removeUser(userData.id);
            showNotify({ login: userData.personalNumber, mode: MODE.DELETE });
            redirectToUsersPage();
        } catch (err) {
            showNotify({ mode: MODE.ERROR, errorMessage: err.message });
            setIsSendingInfo(false);
            setError({ ...DEFAULT_ERRORS, backend: err.message });
        }
    }, [userData, redirectToUsersPage]);

    const onLoginChange = (e) => setLogin(e.currentTarget.value.trim());

    const onLocationChange = (location) => {
        setLocation(location);
        setError((state) => ({
            ...state,
            location: '',
            backend: '',
        }));
    };

    const onSalePointChange = (salePoint) => {
        setSalePoint(salePoint);
        setError((state) => ({
            ...state,
            salePoint: '',
            backend: '',
        }));
    };

    return (
        <>
            <Header onClickFunc={ isInfo ? redirectToUsersPage : undefined } />
            { loading ? (
                <UserSkeletonLoading />
            ) : (
                <div className={ styles.container }>
                    <div className={ styles.pageWrapper }>
                        <div className={ styles.pageTitle }>
                            { notNewUser && userData ? `Пользователь ${userData.personalNumber}` : NEW_USER_TITLE }
                            { notNewUser && (
                                <>
                                    <UserBlockStatus className={ styles.userStatus } blocked={ userData.tmpBlocked } />
                                    { userData.tempPassword && isInfo && (
                                        <div className={ styles.status }>
                                            { PASSWORD_FIELD.label }
                                        </div>
                                    ) }
                                </>
                            ) }
                        </div>
                        <Form className={ styles.formStyle }>
                            <div className={ styles.formWrapper }>
                                <div className={ styles.loginContainer }>
                                    <label className={ cn({ required: !notNewUser }) } htmlFor={ LOGIN_FIELD.name }>
                                        { LOGIN_FIELD.label }
                                    </label>
                                    { !notNewUser ? (
                                        <>
                                            <Input
                                                className={ cn({ [styles.hasError]: !!error.login }, styles.loginInput) }
                                                placeholder={ LOGIN_FIELD.placeholder }
                                                onChange={ onLoginChange }
                                                autoFocus
                                                maxLength={ 13 }
                                                id={ LOGIN_FIELD.name }
                                                value={ login }
                                                allowClear
                                            />
                                            { !!error.login && <div className={ styles.error }>{ error.login }</div> }
                                        </>
                                    ) : (
                                        <div id="idInput" className={ styles.noEditField }>
                                            { userData.personalNumber }
                                        </div>
                                    ) }
                                </div>
                                { !isInfo ? (
                                    <AutocompleteLocationAndSalePoint
                                        locationLabel={ LOCATION_FIELD.labelEdit }
                                        salePointLabel={ SALE_POINT_FIELD.labelEdit }
                                        salePointLabelClassNames={ userData?.role === 'User' || !userData ? 'required' : '' }
                                        onLocationChange={ onLocationChange }
                                        onSalePointChange={ onSalePointChange }
                                        locationDisabled={ isSendingInfo }
                                        salePointDisabled={ isSendingInfo }
                                        autoFocusLocation={ type === 'edit' }
                                        initialLocationValue={ getStringOptionValue(location || undefined) }
                                        initialSalePointValue={ salePoint?.name ?? '' }
                                        locationId={ location?.id }
                                        error={ error }
                                    />
                                ) : (
                                    <>
                                        <div className={ styles.labelCol }>
                                            <div className={ cn(styles.labelTitle, `ant-col-${layout.labelCol.span}`) }>
                                                { LOCATION_FIELD.label }
                                            </div>
                                            <div className={ cn(styles.noEditField, `ant-col-${layout.wrapperCol.span}`) }>
                                                { location?.name }
                                            </div>
                                        </div>
                                        <div className={ styles.labelCol }>
                                            <div className={ cn(styles.labelTitle, `ant-col-${layout.labelCol.span}`) }>
                                                { SALE_POINT_FIELD.label }
                                            </div>
                                            <div className={ cn(styles.noEditField, `ant-col-${layout.wrapperCol.span}`) }>
                                                { salePoint?.name }
                                            </div>
                                        </div>
                                    </>
                                ) }
                            </div>
                            { !!error.backend && <div className={ styles.formError }>{ error.backend }</div> }
                        </Form>
                    </div>
                    <div className={ styles.checkboxesWrapper }>
                        <h4 className={ styles.title }>{ USER_AVAILABLE_APPS }</h4>
                        <div className={ styles.checkBoxesCol }>
                            <Checkboxes
                                checkboxesData={ checkBoxes }
                                onChange={ handleCheckBoxChange }
                                onChangeAll={ handleChangeAllCheckbox }
                                disabledAll={ isInfo || isSendingInfo }
                            />
                        </div>
                    </div>
                    <div className={ styles.buttonsContainer }>
                        <UserFormButtonGroup
                            type={ type }
                            onDelete={ onDelete }
                            onCancel={ onCancel }
                            onSubmit={ onSubmit }
                            onResetPassword={ onResetPassword }
                            onEditUser={ onEditUser }
                            disableAllButtons={ isSendingInfo }
                            userBlocked={ userData?.tmpBlocked }
                            userLoginType={ userData?.loginType }
                            actionPermissions={ userInteractions.current }
                        />
                    </div>
                </div>
            ) }
        </>
    );
};

UserForm.propTypes = {
    type: PropTypes.oneOf(['new', 'edit', 'info']),
    matchPath: PropTypes.string,
};

UserForm.defaultProps = {
    type: 'info',
};

export default UserForm;
