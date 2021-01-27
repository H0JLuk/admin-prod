import React, { useMemo, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useParams, generatePath } from 'react-router-dom';
import cn from 'classnames';
import { Form, Input, notification ,Typography } from 'antd';
import { USERS_PAGES } from '../../../constants/route';
import { addUser, getUser, removeUser, resetUser, saveUser, unblockUser } from '../../../api/services/adminService';
import Header from '../../../components/Header/Header';
import AutocompleteLocationAndSalePoint from '../../../components/Form/AutocompleteLocationAndSalePoint/AutocompleteLocationAndSalePoint';
import UserBlockStatus from '../../../components/UserBlockStatus/UserBlockStatus';
import UserSkeletonLoading from './UserSkeletonLoading/UserSkeletonLoading';
import Checkboxes from '../../../components/Checkboxes/Checkboxes';
import UserFormButtonGroup from './UserFormButtonGroup/UserFormButtonGroup';
import { getStringOptionValue } from '../../../utils/utils';
import { getClientAppList } from '../../../api/services/clientAppService';
import { getUserAppsCheckboxes } from './UserFormHelper';

import { ReactComponent as Cross } from '../../../static/images/cross.svg';

import styles from './UserForm.module.css';

const { Paragraph } = Typography;

const USER_AVAILABLE_APPS = 'Доступные приложения';
const NEW_USER_TITLE = 'Новый пользователь';

const FORM_NAME_NEW_USER = 'createNewUser';
const FORM_NAME_EDIT_USER = 'editUser';

const LOGIN_FIELD = {
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


const CREATE = 'CREATE';
const RESTORED = 'RESTORED';
const DELETE = 'DELETE';
const ERROR = 'ERROR';
const USER_PASSWORD = 'Пароль пользователя';
const NEW_USER_PASSWORD = 'Новый пароль пользователя';
const COPY = 'Копировать';
const ON_COPY = 'Скопировано';

const userMessage = (login, pwd, mode, errorMessage) => {
    switch (mode) {
        case CREATE: {
            return {
                message: `Пользователь с табельным номером ${ login } успешно создан`,
                description: (
                    <Paragraph copyable={ { text: pwd, tooltips: [ COPY, ON_COPY ] } } className={ styles.copyable }>
                        { USER_PASSWORD }: { pwd }
                    </Paragraph>
                ),
            };
        }
        case RESTORED: {
            return {
                message: `Пароль пользователя с табельным номером ${ login } успешно сброшен`,
                description: (
                    <Paragraph copyable={ { text: pwd, tooltips: [ COPY, ON_COPY ] } } className={ styles.copyable } >
                        { NEW_USER_PASSWORD }: { pwd }
                    </Paragraph>
                ),
            };
        }
        case DELETE: {
            return {
                message: `Пользователь с табельным номером ${ login } успешно удален`,
                description: '',
            };
        }
        case ERROR: {
            return {
                message: errorMessage,
                description:'',
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
    const config = {
        duration:0,
        placement:'bottomRight'
    };
    const { message, description } = userMessage(login, pwd, mode, errorMessage);
    if (mode === ERROR){
        return notification.error({
            message,
            description,
            ...config,
        });
    }
        notification.success({
            message,
            description,
            style:{ minWidth:'400px' },
            ...config
        });
};

const UserForm = ({ type, matchUrl }) => {
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
    const [error, setError] = useState(DEFAULT_ERRORS);
    const userName = useMemo(
        () => (notNewUser && userData ? `Пользователь ${userData.personalNumber}` : NEW_USER_TITLE),
        [notNewUser, userData]
    );
    const formName = useMemo(() => (notNewUser ? FORM_NAME_EDIT_USER : FORM_NAME_NEW_USER), [notNewUser]);
    const redirectToUsersPage = useCallback(() => history.push(matchUrl), [history, matchUrl]);

    const getUserData = useCallback(async () => {
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
    }, [notNewUser, redirectToUsersPage, userId]);

    useEffect(() => {
        if (notNewUser && (!userId || isNaN(Number(userId)))) {
            redirectToUsersPage();
            return;
        }
        if (type !== 'info') {
            getUserData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        (async () => {
            if (type === 'info') {
                setLoading(true);
                getUserData();
                setError(DEFAULT_ERRORS);
            }
        })();
    }, [type, getUserData]);

    const onSubmit = useCallback(async () => {
        if (!login && !notNewUser) {
            return setError({ ...DEFAULT_ERRORS, login: 'Укажите логин пользователя' });
        }

        if ((!userData || userData.role === 'User') && !salePoint?.id) {
            return setError({ ...DEFAULT_ERRORS, salePoint: 'Выберите точку продажи' });
        }

        const clientAppIds = Object.values(checkBoxes).reduce((appIds, { id, checked }) => {
            return [...appIds, ...(checked ? [id] : [])];
        }, []);

        setIsSendingInfo(true);

        try {
            const requestData = { clientAppIds, salePointId: salePoint?.id };

            if (notNewUser) {
                    await saveUser(userData.id, requestData);
            } else {
                const { generatedPassword } =  await addUser({ ...requestData, personalNumber: login });
                showNotify({ login, pwd: generatedPassword, mode: CREATE });
            }
        } catch (e) {
            setIsSendingInfo(false);
            return setError({ ...DEFAULT_ERRORS, backend: e.message });
        }

        setIsSendingInfo(false);

        setError(DEFAULT_ERRORS);

        if (notNewUser && userData) {
            history.push(generatePath(`${matchUrl}${USERS_PAGES.USER_INFO}`, { userId: userData.id }));
        } else {
            redirectToUsersPage();
        }
    }, [login, redirectToUsersPage, notNewUser, history, userData, salePoint, checkBoxes, matchUrl]);

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
                const { generatedPassword } =  await resetUser(userData.personalNumber);
                showNotify({ login: userData.personalNumber , pwd: generatedPassword, mode: RESTORED });
            }
        } catch (err) {
            showNotify({ mode: ERROR, errorMessage: err.message });
            setError({ ...DEFAULT_ERRORS, backend: err.message });
        }

        setIsSendingInfo(false);
    }, [userData]);

    const onEditUser = useCallback(() => {
        setError(DEFAULT_ERRORS);
        history.push(generatePath(`${matchUrl}${USERS_PAGES.EDIT_USER}`, { userId }));
    }, [history, userId, matchUrl]);

    const onCancel = useCallback(async () => {
        if (notNewUser && userData) {
            setCheckBoxes(getUserAppsCheckboxes(clientApps, userData.clientAppIds));
            setLocation({ id: userData.locationId, name: userData.locationName });
            setSalePoint({ id: userData.salePointId, name: userData.salePointName });
            setError(DEFAULT_ERRORS);
            history.push(generatePath(`${matchUrl}${USERS_PAGES.USER_INFO}`, { userId: userData.id }));
        } else {
            redirectToUsersPage();
        }
    }, [history, notNewUser, userData, redirectToUsersPage, clientApps, matchUrl]);

    const onDelete = useCallback(async () => {
        try {
            setIsSendingInfo(true);
            await removeUser(userData.id);
            showNotify({ login: userData.personalNumber, mode: DELETE });
            redirectToUsersPage();
        } catch (err) {
            showNotify({ mode: ERROR, errorMessage: err.message });
            setIsSendingInfo(false);
            setError({ ...DEFAULT_ERRORS, backend: err.message });
        }
    }, [userData, redirectToUsersPage]);

    const onLoginChange = useCallback((e) => setLogin(e.currentTarget.value), []);
    const clearLogin = useCallback(() => setLogin(null), []);

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

    return (
        <>
            <Header />
            {loading ? (
                <UserSkeletonLoading />
            ) : (
                <div className={ styles.container }>
                    <div className={ styles.pageWrapper }>
                        <div className={ styles.pageTitle }>
                            {userName}
                            {notNewUser && (
                                <UserBlockStatus className={ styles.userStatus } blocked={ userData.tmpBlocked } />
                            )}
                        </div>
                        <Form
                            { ...layout }
                            className={ styles.formStyle }
                            name={ formName }
                        >
                            <div className={ styles.formWrapper }>
                                <div className={ styles.loginContainer }>
                                    <label className={ cn({ required: !notNewUser }) } htmlFor={ LOGIN_FIELD.name }>
                                        { LOGIN_FIELD.label }
                                    </label>
                                    {!notNewUser ? (
                                        <>
                                            <Input
                                                className={ cn({ [styles.hasError]: !!error.login }, styles.loginInput) }
                                                placeholder={ LOGIN_FIELD.placeholder }
                                                onChange={ onLoginChange }
                                                autoFocus
                                                maxLength={ 8 }
                                                id={ LOGIN_FIELD.name }
                                                value={ login }
                                                suffix={
                                                    login ? (
                                                        <Cross
                                                            className={ styles.suffixStyle }
                                                            onClick={ clearLogin }
                                                        />
                                                    ) : (
                                                        <span />
                                                    )
                                                }
                                            />
                                            { !!error.login && <div className={ styles.error }>{ error.login }</div> }
                                        </>
                                    ) : (
                                        <div id="idInput" className={ styles.noEditField }>
                                            { userData.personalNumber }
                                        </div>
                                    )}
                                </div>
                                {type !== 'info' ? (
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
                                )}
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
                                disabledAll={ type === 'info' || isSendingInfo }
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
                        />
                    </div>
                </div>
            )}
        </>
    );
};

UserForm.propTypes = {
    type: PropTypes.oneOf(['new', 'edit', 'info']),
    matchUrl: PropTypes.string,
};

UserForm.defaultProps = {
    type: 'info',
};

export default UserForm;
