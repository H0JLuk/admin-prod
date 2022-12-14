import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ClientAppDto, LocationDto, SalePointDto, SettingDto, UpdateUserRequest, UserInfo } from '@types';
import PropTypes from 'prop-types';
import { useHistory, useParams, generatePath } from 'react-router-dom';
import cn from 'classnames';
import { Form, Input, message, Row, Col, Select, Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

import {
    addUser,
    getPartnersList,
    getUser,
    removeUser,
    resetUser,
    editUser,
    unblockUser,
} from '@apiServices/usersService';
import Header from '@components/Header';
import AutocompleteLocationAndSalePoint from '@components/AutoComplete/AutocompleteLocationAndSalePoint';
import AutoCompleteComponent from '@components/AutoComplete';
import UserBlockStatus from '@components/UserBlockStatus';
import UserSkeletonLoading from './UserSkeletonLoading';
import ContentBlock from '@components/ContentBlock';
import Checkboxes from '@components/Checkboxes';
import UserFormButtonGroup from './UserFormButtonGroup';
import { confirmModal, getStringOptionValue } from '@utils/utils';
import {
    CommonPermissions,
    getCommonPermissionsByRole,
    getCurrUserInteractionsForOtherUser,
    InteractionsCurrUserToOtherUser,
} from '@constants/permissions';
import { getActiveClientApps } from '@apiServices/clientAppService';
import { getSalePointByText } from '@apiServices/salePointService';
import { getSettingsByKeys } from '@apiServices/settingsService';
import {
    errorEditPermissions,
    getLoginTypeByRole,
    getUserAppsCheckboxes,
    getUserAppsCheckboxesResult,
    MODE,
    ROLES_FOR_EXTERNAL_SALE_POINT,
    ROLES_FOR_PARTNER_CONNECT,
    ROLES_FOR_LOGIN_TYPE_CHANGE,
    showNotify,
    validateLogin,
    validatePartner,
    validateSalePoint,
} from './UserFormHelper';
import { USERS_PAGES } from '@constants/route';
import { LOGIN_TYPES_ENUM, LOGIN_TYPE, LoginTypes, LOGIN_TYPE_OPTIONS } from '@constants/loginTypes';
import { BUTTON_TEXT } from '@constants/common';
import ROLES, { ROLES_OPTIONS, ROLES_RU } from '@constants/roles';
import { BLOCKING_CONDITIONS } from '@constants/settings';

import styles from './UserForm.module.css';

export type UserFormProps = {
    type: 'edit' | 'info' | 'new' | string;
    matchPath: string;
};

const USER_AVAILABLE_APPS = '?????????????????? ????????????????????';
const NEW_USER_TITLE = '?????????? ????????????????????????';

const TEMP_PASSWORD_FIELD = '?????????????????? ????????????';

export const LOGIN_FIELD = {
    name: 'login',
    label: '?????????? ????????????????????????',
    placeholder: '?????????????????? ??????????',
};

export const LOGIN_TYPE_FIELD = {
    name: 'login_type',
    label: '???????????? ??????????????????????',
};

const LOCATION_FIELD = {
    label: '??????????????',
    labelEdit: '???????????????? ??????????????',
};

const SALE_POINT_FIELD = {
    label: '?????????? ??????????????',
    labelEdit: '???????????????? ?????????? ??????????????',
};

const UUID_FIELD = {
    name: 'uuid',
    label: 'UUID',
};

const GENERATE_UUID_FIELD = {
    name: 'generateUuid',
    label: '?????????????????????????? ?????????? UUID',
};

const ROLE_FIELD = {
    name: 'role',
    label: '????????',
};

const PARTNER_FIELD = {
    name: 'partner',
    label: '??????????????',
    placeholder: '?????????? ????????????????',
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

export const LOGIN_TYPE_SELECT_OPTIONS = LOGIN_TYPE_OPTIONS.filter(({ label }) => [
    LOGIN_TYPE.PASSWORD,
    LOGIN_TYPE.SBER_REGISTRY,
].includes(label));

const UserForm: React.FC<UserFormProps> = ({ type, matchPath }) => {
    const history = useHistory();
    const params = useParams<{userId: string;}>();
    const { userId } = params ;
    const notNewUser = ['edit', 'info'].includes(type);
    const isInfo = type === 'info';
    const isEdit = type === 'edit';

    const [loading, setLoading] = useState(true);
    const [isSendingInfo, setIsSendingInfo] = useState(false);

    const [userData, setUserData] = useState<UserInfo | null>(null);
    const [login, setLogin] = useState<string | null>(null);
    const [role, setRole] = useState(ROLES.USER);
    const [loginType, setLoginType] = useState<LoginTypes | null | undefined>(LOGIN_TYPES_ENUM.PASSWORD);
    const [uuid, setUuid] = useState<string | null>(null);
    const [generateUuid, setGenerateUuid] = useState(false);
    const isCorrectRoleForPartner = ROLES_FOR_PARTNER_CONNECT.includes(role);
    const isCorrectRoleForLoginType = ROLES_FOR_LOGIN_TYPE_CHANGE.includes(role);
    const isReferalRole = ROLES.REFERAL_LINK === role;
    const salePointShouldExternal = ROLES_FOR_EXTERNAL_SALE_POINT.includes(role);
    const [location, setLocation] = useState<LocationDto | null>(null);
    const [salePoint, setSalePoint] = useState<SalePointDto | null>(null);
    const partner = useRef<string | null>(null);

    const clientAppsRef = useRef<ClientAppDto[]>([]);
    const clientApps = clientAppsRef.current;
    const [checkBoxes, setCheckBoxes] = useState<getUserAppsCheckboxesResult>({});
    const [error, setError] = useState(DEFAULT_ERRORS);

    const commonPermissions = useRef({} as CommonPermissions);
    const { canSetUserRole, canSetUserPartner, canSetLoginType } = commonPermissions.current;
    const userInteractions = useRef({} as InteractionsCurrUserToOtherUser);
    const partnerFieldMethods = useRef<any>(null);
    const settingsListRef = useRef<SettingDto[]>([]);

    const redirectToUsersPage = useCallback(() => history.push(matchPath), [history, matchPath]);
    const canEditLoginType = !isInfo && canSetLoginType && isCorrectRoleForLoginType && !partner.current;

    const getUserData = async () => {
        try {
            let user;
            const clientAppList = await getActiveClientApps();
            const { settingDtoList } = await getSettingsByKeys('present_type');

            if (notNewUser) {
                user = await getUser(userId);
                const userSalePoint = await getSalePointByText(user.salePointName, user.salePointId, user.locationId);

                setLocation({ id: user.locationId, name: user.locationName } as LocationDto);
                setSalePoint(userSalePoint ?? null);
                setUserData(user);
                setRole(user.role);
                setUuid(user.uuid);
                setLoginType(user.loginType);
                partner.current = user.parentUserName;
                userInteractions.current = getCurrUserInteractionsForOtherUser(user.role); // TODO: ?????????????? ???????????????? ?????????????????? ?????????????? ?? ????????????????, ?????????? ???? ???????????????? ???????????? ?????? ?????????????? ???? ?????????????????? ???????? ????????????????

                if (!isInfo && !userInteractions.current.editUser) {
                    message.error(errorEditPermissions(user.personalNumber));
                    history.replace(generatePath(`${matchPath}${USERS_PAGES.USER_INFO}`, { userId }));
                    return;
                }
            }
            settingsListRef.current = settingDtoList;
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

    useEffect(() => {
        const checkboxDisabled = settingsListRef.current.reduce((acc, el) =>
            el.clientAppCode
            && typeof BLOCKING_CONDITIONS[el.key] === 'function'
            && BLOCKING_CONDITIONS[el.key](el.value)
            && role !== ROLES.USER
                ? { ...acc, [el.clientAppCode]: true }
                : acc, {});

        setCheckBoxes(getUserAppsCheckboxes(clientAppsRef.current, userData?.clientAppIds, checkboxDisabled));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [role]);

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
                const requestData: UpdateUserRequest = {
                    clientAppIds,
                    salePointId: salePoint?.id,
                    parent: partner.current,
                };
                isReferalRole && (requestData.generateUuid = generateUuid);

                if (notNewUser) {
                    await editUser((userData as UserInfo).id, {
                        ...requestData,
                        ...(loginType && loginType !== userData?.loginType && { loginType }),
                    });
                    showNotify({ login: userData?.personalNumber, mode: MODE.EDIT });
                } else {
                    const { userName, generatedPassword } = await addUser({
                        ...requestData,
                        role,
                        personalNumber: login as string,
                        loginType: loginType ?? undefined,
                    });
                    showNotify({
                        login: login || userName,
                        mode: MODE.CREATE,
                        pwd: generatedPassword,
                        role,
                    });
                }
            } catch (err: any) {
                setIsSendingInfo(false);
                if (err.message) {
                    return setError({ ...DEFAULT_ERRORS, backend: err.message });
                }
            }

            setIsSendingInfo(false);
            setError(DEFAULT_ERRORS);

            if (notNewUser && userData) {
                history.push(generatePath(`${matchPath}${USERS_PAGES.USER_INFO}`, { userId: userData.id }));
            } else {
                redirectToUsersPage();
            }
        // eslint-disable-next-line @typescript-eslint/no-shadow
        } catch ({ message, name }) {
            return setError({ ...DEFAULT_ERRORS, [name as string]: message });
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
        } catch (err: any) {
            if (err.message) {
                showNotify({ mode: MODE.ERROR, errorMessage: err.message });
                setError({ ...DEFAULT_ERRORS, backend: err.message });
            }
        }
        setIsSendingInfo(false);
    };

    const onEditUser = () => {
        setError(DEFAULT_ERRORS);
        history.push(generatePath(`${matchPath}${USERS_PAGES.EDIT_USER}`, { userId }));
    };

    const onCancel = async () => {
        if (notNewUser && userData) {
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
        } catch (err: any) {
            if (err.message) {
                showNotify({ mode: MODE.ERROR, errorMessage: err.message });
            }
            setIsSendingInfo(false);
        }
    };

    const onDeleteClick = () => {
        confirmModal({
            onOk: onDelete,
            title: <span>???? ??????????????, ?????? ???????????? ?????????????? ???????????????????????? ?? ?????????????????? ?????????????? <b>{userData?.personalNumber}</b>?</span>,
            okText: BUTTON_TEXT.DELETE,
            okButtonProps: { danger: true },
        });
    };

    const clearPartner = () => {
        partner.current = null;
        partnerFieldMethods.current.clearState();
        setError(prev => ({ ...prev, partner: '' }));
    };

    const onLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => setLogin(e.currentTarget.value.trim());

    const onGenerateUuidChange = (e: CheckboxChangeEvent) => setGenerateUuid(e.target.checked);

    const onChangeRole = (value: ROLES) => {
        if (canSetUserPartner && !ROLES_FOR_PARTNER_CONNECT.includes(value)) {
            clearPartner();
        }

        if (ROLES_FOR_EXTERNAL_SALE_POINT.includes(value)) {
            setLogin(null);
            setError({ ...error, login: '' });
        }

        const loginTypeByRole = getLoginTypeByRole(value);

        setLoginType(loginTypeByRole);
        setRole(value);
    };

    const onLoginTypeChange = (value: LoginTypes) => {
        setLoginType(value);
    };

    const onLocationChange = (selectedLocation: LocationDto | null) => {
        setLocation(selectedLocation);
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
        const partnerPersonalNumber = data?.personalNumber ?? null;

        if (partner.current !== partnerPersonalNumber) {
            partner.current = partnerPersonalNumber;
            setError(prev => ({
                ...prev,
                backend: '',
                partner: '',
            }));
        }
    };

    return (
        <>
            {header}
            <div className={styles.container}>
                <div className={styles.pageTitle}>
                    {notNewUser && userData ? `???????????????????????? ${userData.personalNumber}` : NEW_USER_TITLE}
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
                <ContentBlock maxWidth={1100}>
                    <Form>
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
                                            title={salePointShouldExternal ? '?????? ?????????????????? ???????? ?????????? ????????????????????' : ''}
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
                                    salePointLabelClassNames={!isInfo ? 'required' : ''}
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
                                {canEditLoginType ? (
                                    <Select
                                        className={styles.selectInput}
                                        options={LOGIN_TYPE_SELECT_OPTIONS}
                                        onChange={onLoginTypeChange}
                                        defaultValue={LOGIN_TYPES_ENUM[loginType as LoginTypes]}
                                    />
                                ) : (
                                    <div className={styles.noEditField}>
                                        {LOGIN_TYPE[loginType as LoginTypes]}
                                    </div>
                                )}
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
                                        clearValueOnBlur
                                        clearSelectedBySearch
                                        selectExactValueOnBlur
                                        keyForCompareSelect="personalNumber"
                                    />
                                ) : (
                                    <div className={styles.noEditField}>
                                        {userData?.parentUserName || <i>?????? ????????????????</i>}
                                    </div>
                                )}
                            </Col>
                            {isReferalRole && (
                                <>
                                    {notNewUser && (
                                        <Col span={8} className={styles.roleBlock}>
                                            <label>
                                                {UUID_FIELD.label}
                                            </label>
                                            <div className={styles.noEditField}>
                                                {uuid}
                                            </div>
                                        </Col>
                                    )}
                                    {isEdit && (
                                        <Col span={16} className={styles.uuidBlock}>
                                            <label htmlFor={GENERATE_UUID_FIELD.name}>
                                                {GENERATE_UUID_FIELD.label}
                                            </label>
                                            <Checkbox
                                                id={GENERATE_UUID_FIELD.name}
                                                value={generateUuid}
                                                onChange={onGenerateUuidChange}
                                            />
                                        </Col>
                                    )}
                                </>
                            )}
                        </Row>
                        {!!error.backend && <div className={styles.formError}>{error.backend}</div>}
                    </Form>
                </ContentBlock>
                <ContentBlock>
                    <h4 className={styles.title}>{USER_AVAILABLE_APPS}</h4>
                    <div className={styles.checkBoxesCol}>
                        <Checkboxes
                            checkboxesData={checkBoxes}
                            onChange={handleCheckBoxChange}
                            onChangeAll={handleChangeAllCheckbox}
                            disabledAll={isInfo || isSendingInfo}
                        />
                    </div>
                </ContentBlock>
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
