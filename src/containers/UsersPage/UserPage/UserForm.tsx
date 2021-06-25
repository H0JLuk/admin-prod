import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ClientAppDto, LocationDto, SalePointDto, UserInfo } from '@types';
import PropTypes from 'prop-types';
import { useHistory, useParams, generatePath } from 'react-router-dom';
import cn from 'classnames';
import { Form, Input, message, Row, Col, Select } from 'antd';

import {
    addUser,
    getPartnersList,
    getUser,
    removeUser,
    resetUser,
    saveUser,
    unblockUser,
} from '@apiServices/usersService';
import Header from '@components/Header';
import AutocompleteLocationAndSalePoint from '@components/Form/AutocompleteLocationAndSalePoint';
import AutoCompleteComponent from '@components/AutoComplete';
import UserBlockStatus from '@components/UserBlockStatus';
import UserSkeletonLoading from './UserSkeletonLoading';
import Checkboxes from '@components/Checkboxes';
import UserFormButtonGroup, { BUTTON } from './UserFormButtonGroup';
import { confirmModal, getStringOptionValue } from '@utils/utils';
import {
    CommonPermissions,
    getCommonPermissionsByRole,
    getCurrUserInteractionsForOtherUser,
    InteractionsCurrUserToOtherUser,
} from '@constants/permissions';
import { getActiveClientApps } from '@apiServices/clientAppService';
import { getSalePointByText } from '@apiServices/promoCampaignService';
import {
    errorEditPermissions,
    getLoginTypeByRole,
    getUserAppsCheckboxes,
    getUserAppsCheckboxesResult,
    MODE,
    ROLES_FOR_EXTERNAL_SALE_POINT,
    ROLES_FOR_PARTNER_CONNECT,
    showNotify,
    validateLogin,
    validatePartner,
    validateSalePoint,
} from './UserFormHelper';
import { USERS_PAGES } from '@constants/route';
import { LOGIN_TYPES_ENUM, LOGIN_TYPE, LoginTypes } from '@constants/loginTypes';
import ROLES, { ROLES_OPTIONS, ROLES_RU } from '@constants/roles';

import styles from './UserForm.module.css';


export type UserFormProps = {
    type: 'edit' | 'info' | 'new' | string;
    matchPath: string;
};

const USER_AVAILABLE_APPS = 'Доступные приложения';
const NEW_USER_TITLE = 'Новый пользователь';

const TEMP_PASSWORD_FIELD = 'Временный пароль';

export const LOGIN_FIELD = {
    name: 'login',
    label: 'Логин пользователя',
    placeholder: 'Табельный номер',
};

export const LOGIN_TYPE_FIELD = {
    name: 'login_type',
    label: 'Способ авторизации',
};

const LOCATION_FIELD = {
    label: 'Локация',
    labelEdit: 'Выберите локацию',
};

const SALE_POINT_FIELD = {
    label: 'Точка продажи',
    labelEdit: 'Выберите точку продажи',
};

const ROLE_FIELD = {
    name: 'role',
    label: 'Роль',
};

const PARTNER_FIELD = {
    name: 'partner',
    label: 'Партнёр',
    placeholder: 'Логин партнера',
};

const DEFAULT_ERRORS = {
    login: '',
    location: '',
    salePoint: '',
    backend: '',
    partner: '',
};

const USER_ROLES_OPTIONS = ROLES_OPTIONS.filter(({ value }) => [
    ROLES.USER,
    ROLES.PARTNER,
    ROLES.EXTERNAL_USER,
    ROLES.REFERAL_LINK,
].includes(value));


const UserForm: React.FC<UserFormProps> = ({ type, matchPath }) => {
    const history = useHistory();
    const params = useParams<{userId: string;}>();
    const { userId } = params ;
    const notNewUser = ['edit', 'info'].includes(type);
    const isInfo = type === 'info';

    const [loading, setLoading] = useState(true);
    const [isSendingInfo, setIsSendingInfo] = useState(false);

    const [userData, setUserData] = useState<UserInfo | null>(null);
    const [login, setLogin] = useState<string | null>(null);
    const loginType = useRef<LoginTypes | null | undefined>(LOGIN_TYPES_ENUM.PASSWORD);
    const [role, setRole] = useState(ROLES.USER);
    const isCorrectRoleForPartner = ROLES_FOR_PARTNER_CONNECT.includes(role);
    const salePointShouldExternal = ROLES_FOR_EXTERNAL_SALE_POINT.includes(role);
    const [location, setLocation] = useState<LocationDto | null>(null);
    const [salePoint, setSalePoint] = useState<SalePointDto | null>(null);
    const partner = useRef<string | null>(null);

    const clientAppsRef = useRef<ClientAppDto[]>([]);
    const clientApps = clientAppsRef.current;
    const [checkBoxes, setCheckBoxes] = useState<getUserAppsCheckboxesResult>({});
    const [error, setError] = useState(DEFAULT_ERRORS);

    const commonPermissions = useRef({} as CommonPermissions);
    const { canSetUserRole, canSetUserPartner } = commonPermissions.current;
    const userInteractions = useRef({} as InteractionsCurrUserToOtherUser);
    const partnerFieldMethods = useRef<any>(null);

    const redirectToUsersPage = useCallback(() => history.push(matchPath), [history, matchPath]);

    const getUserData = async () => {
        try {
            let user;
            const clientAppList = await getActiveClientApps();

            if (notNewUser) {
                user = await getUser(userId);
                const salePoint = await getSalePointByText(user.salePointName, user.salePointId, user.locationId);

                setLocation({ id: user.locationId, name: user.locationName } as LocationDto);
                setSalePoint(salePoint ?? null);
                setUserData(user);
                setRole(user.role);
                loginType.current = user.loginType;
                partner.current = user.parentUserName;
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
        commonPermissions.current = getCommonPermissionsByRole();
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
        try {
            if (!notNewUser && !salePointShouldExternal) {
                validateLogin(login);
            }

            validateSalePoint(salePoint, salePointShouldExternal);
            validatePartner(partner.current, isCorrectRoleForPartner);

            const clientAppIds = Object.values(checkBoxes).reduce((appIds: number[], { id, checked }) => [...appIds, ...(checked ? [id] : [])], []);
            setIsSendingInfo(true);

            try {
                const requestData = {
                    clientAppIds,
                    salePointId: salePoint?.id,
                    parent: partner.current,
                };

                if (notNewUser) {
                    await saveUser(userData!.id, requestData);
                    showNotify({ login: userData?.personalNumber, mode: MODE.EDIT });
                } else {
                    const { userName, generatedPassword } = await addUser({
                        ...requestData,
                        role,
                        personalNumber: login as string,
                        loginType: loginType.current ?? undefined,
                    });
                    showNotify({
                        login: login || userName,
                        mode: MODE.CREATE,
                        pwd: generatedPassword,
                        role,
                    });
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
        } catch ({ message, name }) {
            return setError({ ...DEFAULT_ERRORS, [name]: message });
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
                {},
            ),
        );
    }, []);

    const header = (
        <Header onClickFunc={isInfo ? redirectToUsersPage : undefined} />
    );

    if (loading) {
        return (
            <>
                {header}
                <UserSkeletonLoading />
            </>
        );
    }

    const onResetPassword = async () => {
        setIsSendingInfo(true);

        try {
            if (userData) {
                if (userData.tmpBlocked) {
                    await unblockUser(userData.personalNumber);
                    setUserData({ ...userData, tmpBlocked: false });
                } else {
                    const { generatedPassword } = await resetUser(userData.personalNumber);
                    setUserData({ ...userData, tempPassword: true });
                    showNotify({
                        login: userData.personalNumber,
                        pwd: generatedPassword,
                        mode: MODE.RESTORED,
                        role: userData.role,
                    });
                }
            }
        } catch (err) {
            showNotify({ mode: MODE.ERROR, errorMessage: err.message });
            setError({ ...DEFAULT_ERRORS, backend: err.message });
        }

        setIsSendingInfo(false);
    };

    const onEditUser = () => {
        setError(DEFAULT_ERRORS);
        history.push(generatePath(`${matchPath}${USERS_PAGES.EDIT_USER}`, { userId }));
    };

    const onCancel = async () => {
        if (notNewUser && userData) {
            setCheckBoxes(getUserAppsCheckboxes(clientApps, userData.clientAppIds));
            setLocation({ id: userData.locationId, name: userData.locationName } as LocationDto);
            // setSalePoint({ id: userData.salePointId, name: userData.salePointName } as SalePointDto);
            setError(DEFAULT_ERRORS);
            history.push(generatePath(`${matchPath}${USERS_PAGES.USER_INFO}`, { userId: userData.id }));
        } else {
            redirectToUsersPage();
        }
    };

    const onDelete = async () => {
        try {
            if (userData) {
                setIsSendingInfo(true);
                await removeUser(userData.id);
                showNotify({ login: userData.personalNumber, mode: MODE.DELETE });
                redirectToUsersPage();
            }
        } catch (err) {
            showNotify({ mode: MODE.ERROR, errorMessage: err.message });
            setIsSendingInfo(false);
        }
    };

    const onDeleteClick = () => {
        confirmModal({
            onOk: onDelete,
            title: <span>Вы уверены, что хотите удалить пользователя с табельным номером <b>{userData?.personalNumber}</b>?</span>,
            okText: BUTTON.DELETE_TEXT,
            okButtonProps: { danger: true },
        });
    };

    const clearPartner = () => {
        partner.current = null;
        partnerFieldMethods.current.clearState();
        setError(prev => ({ ...prev, partner: '' }));
    };

    const onLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => setLogin(e.currentTarget.value.trim());

    const onChangeRole = (value: ROLES) => {
        if (canSetUserPartner && !ROLES_FOR_PARTNER_CONNECT.includes(value)) {
            clearPartner();
        }

        if (ROLES_FOR_EXTERNAL_SALE_POINT.includes(value)) {
            setLogin(null);
            setError({ ...error, login: '' });
        }

        loginType.current = getLoginTypeByRole(value);
        setRole(value);
    };

    const onLocationChange = (location: LocationDto | null) => {
        setLocation(location);
        setError((state) => ({
            ...state,
            location: '',
            backend: '',
        }));
    };

    const onSalePointChange = (newSalePoint: SalePointDto | null) => {
        setSalePoint(newSalePoint);
        setError((state) => ({
            ...state,
            salePoint: '',
            backend: '',
        }));
    };

    const onChangePartner = (data: UserInfo | null) => {
        partner.current = data?.personalNumber ?? null;
        setError(prev => ({
            ...prev,
            backend: '',
            partner: '',
        }));
    };

    return (
        <>
            {header}
            <div className={styles.container}>
                <div className={styles.pageWrapper}>
                    <div className={styles.pageTitle}>
                        {notNewUser && userData ? `Пользователь ${userData.personalNumber}` : NEW_USER_TITLE}
                        {notNewUser && (
                            <>
                                <UserBlockStatus className={styles.userStatus} blocked={userData?.tmpBlocked} />
                                {userData?.tempPassword && isInfo && (
                                    <div className={styles.status}>
                                        {TEMP_PASSWORD_FIELD}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <Form className={styles.formStyle}>
                        <Row
                            className={styles.formWrapper}
                            gutter={[0, 15]}
                            justify="space-between"
                        >
                            <div className={styles.loginContainer}>
                                <label
                                    className={cn({
                                        required: !notNewUser && !salePointShouldExternal,
                                    })}
                                    htmlFor={LOGIN_FIELD.name}
                                >
                                    {LOGIN_FIELD.label}
                                </label>
                                {!notNewUser ? (
                                    <>
                                        <Input
                                            id={LOGIN_FIELD.name}
                                            className={cn({ [styles.hasError]: !!error.login }, styles.loginInput)}
                                            placeholder={LOGIN_FIELD.placeholder}
                                            onChange={onLoginChange}
                                            maxLength={13}
                                            value={login ?? ''}
                                            disabled={salePointShouldExternal}
                                            title={salePointShouldExternal ? 'Для выбранной роли логин недоступен' : ''}
                                            allowClear
                                            autoFocus
                                        />
                                        {!!error.login && <div className={styles.error}>{error.login}</div>}
                                    </>
                                ) : (
                                    <div id="idInput" className={styles.noEditField}>
                                        {userData?.personalNumber}
                                    </div>
                                )}
                            </div>
                            {!isInfo ? (
                                <AutocompleteLocationAndSalePoint
                                    locationLabel={LOCATION_FIELD.labelEdit}
                                    salePointLabel={SALE_POINT_FIELD.labelEdit}
                                    salePointLabelClassNames={userData?.role === 'User' || !userData ? 'required' : ''}
                                    onLocationChange={onLocationChange}
                                    onSalePointChange={onSalePointChange}
                                    locationDisabled={isSendingInfo}
                                    salePointDisabled={isSendingInfo}
                                    autoFocusLocation={type === 'edit'}
                                    initialLocationValue={getStringOptionValue(location || undefined)}
                                    initialSalePointValue={salePoint?.name ?? ''}
                                    locationId={location?.id}
                                    error={error}
                                />
                            ) : (
                                <>
                                    <div className={styles.labelCol}>
                                        <label>
                                            {LOCATION_FIELD.label}
                                        </label>
                                        <div className={styles.noEditField}>
                                            {location?.name}
                                        </div>
                                    </div>
                                    <div className={styles.labelCol}>
                                        <label>
                                            {SALE_POINT_FIELD.label}
                                        </label>
                                        <div className={styles.noEditField}>
                                            {salePoint?.name}
                                        </div>
                                    </div>
                                </>
                            )}
                            <Col span={8} className={styles.roleBlock}>
                                <label>
                                    {LOGIN_TYPE_FIELD.label}
                                </label>
                                <div className={styles.noEditField}>
                                    {LOGIN_TYPE[loginType.current as LoginTypes] || LOGIN_TYPE.PASSWORD}
                                </div>
                            </Col>
                            <Col span={8} className={styles.labelCol}>
                                <label htmlFor={ROLE_FIELD.name}>
                                    {ROLE_FIELD.label}
                                </label>
                                {!notNewUser && canSetUserRole ? (
                                    <Select
                                        className={styles.selectInput}
                                        options={USER_ROLES_OPTIONS}
                                        onChange={onChangeRole}
                                        defaultValue={role}
                                    />
                                ) : (
                                    <div className={styles.noEditField}>
                                        {ROLES_RU[userData?.role || role]}
                                    </div>
                                )}
                            </Col>
                            <Col span={8} className={styles.labelCol}>
                                <label className={cn({
                                    required: !isInfo && canSetUserPartner && isCorrectRoleForPartner,
                                })}>
                                    {PARTNER_FIELD.label}
                                </label>
                                {!isInfo && canSetUserPartner ? (
                                    <AutoCompleteComponent<UserInfo>
                                        className={styles.selectInput}
                                        value={partner.current}
                                        error={error.partner}
                                        placeholder={PARTNER_FIELD.placeholder}
                                        onSelect={onChangePartner}
                                        requestFunction={getPartnersList}
                                        componentMethods={partnerFieldMethods}
                                        renderOptionItemLabel={(option) => option.personalNumber}
                                        renderOptionStringValue={(option) => option.personalNumber}
                                        disabled={!isCorrectRoleForPartner}
                                    />
                                ) : (
                                    <div className={styles.noEditField}>
                                        {userData?.parentUserName || <i>Нет партнёра</i>}
                                    </div>
                                )}
                            </Col>
                        </Row>
                        {!!error.backend && <div className={styles.formError}>{error.backend}</div>}
                    </Form>
                </div>
                <div className={styles.checkboxesWrapper}>
                    <h4 className={styles.title}>{USER_AVAILABLE_APPS}</h4>
                    <div className={styles.checkBoxesCol}>
                        <Checkboxes
                            checkboxesData={checkBoxes}
                            onChange={handleCheckBoxChange}
                            onChangeAll={handleChangeAllCheckbox}
                            disabledAll={isInfo || isSendingInfo}
                        />
                    </div>
                </div>
                <div className={styles.buttonsContainer}>
                    <UserFormButtonGroup
                        type={type}
                        clientApps={clientApps}
                        onDelete={onDeleteClick}
                        onCancel={onCancel}
                        onSubmit={onSubmit}
                        onResetPassword={onResetPassword}
                        onEditUser={onEditUser}
                        disableAllButtons={isSendingInfo}
                        userData={userData}
                        actionPermissions={userInteractions.current}
                    />
                </div>
            </div>
        </>
    );
};

UserForm.propTypes = {
    type: PropTypes.oneOf(['new', 'edit', 'info']).isRequired,
    matchPath: PropTypes.string.isRequired,
};

UserForm.defaultProps = {
    type: 'info',
};

export default UserForm;