import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Form } from 'antd';

import { editLocationAndSalePointUsers, removeUser } from '@apiServices/usersService';
import { LocationDto, SalePointDto, UserInfo } from '@types';
import AutocompleteLocationAndSalePoint from '@components/AutoComplete/AutocompleteLocationAndSalePoint';
import Header from '@components/Header';
import UserFormButtonGroup from '../UserFormButtonGroup';
import { ROLES_FOR_EXTERNAL_SALE_POINT, validateSalePoint } from '../UserFormHelper';

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

type UserMultiEditProps = {
    matchPath: string;
};

type LocationState = {
    users: UserInfo[];
};

const UserMultiEdit: React.FC<UserMultiEditProps> = ({ matchPath }) => {
    const [location, setLocation] = useState<LocationDto | null>(null);
    const [salePoint, setSalePoint] = useState<SalePointDto | null>(null);
    const [error, setError] = useState({ location: '', salePoint: '', backend: '' });
    const [isSendingInfo, setIsSendingInfo] = useState(false);
    const [arrUsersIds, setArrUsersIds] = useState<number[]>([]);
    const history = useHistory();
    const { state: { users = [] } = {} } = useLocation<LocationState>();

    const redirectToUsersPage = () => history.push(matchPath);

    useEffect(() => {
        if (!users?.length) {
            redirectToUsersPage();
        }
        setArrUsersIds(users.map(({ id }) => id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onLocationChange = (selectedLocation: LocationDto | null) => {
        setLocation(selectedLocation);
        setError({ location: '', salePoint: '', backend: '' });
    };

    const onSalePointChange = (selectedSalePoint: SalePointDto | null) => {
        setSalePoint(selectedSalePoint);
        setError({ location: '', salePoint: '', backend: '' });
    };

    const onDelete = async () => {
        setIsSendingInfo(true);

        try {
            const requestPromises = arrUsersIds.map(removeUser);

            await Promise.all(requestPromises);
            redirectToUsersPage();
        } catch (e) {
            setIsSendingInfo(false);
            setError({ location: '', salePoint: '', backend: e.message });
        }
    };

    const onSubmit = async () => {
        try {
            const salePointShouldExternal = users.every(({ role }) => ROLES_FOR_EXTERNAL_SALE_POINT.includes(role));
            validateSalePoint(salePoint, salePointShouldExternal);

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
        } catch ({ message, name }) {
            return setError({
                location: '',
                salePoint: '',
                backend: '',
                [name]: message,
            });
        }
    };

    return (
        <>
            <Header />
            <div className={styles.container}>
                <div className={styles.header}>
                    <h4>{PAGE_TITLE}</h4>
                    <div className={styles.pageTitle}>
                        {`${CHOSE_USERS_COUNT} ${arrUsersIds.length}`}
                    </div>
                </div>
                <div className={styles.formContainer}>
                    <Form {...layout} className={styles.form} requiredMark={false}>
                        <AutocompleteLocationAndSalePoint
                            locationDisabled={isSendingInfo}
                            salePointDisabled={isSendingInfo}
                            locationLabel={LOCATION_FIELD.label}
                            salePointLabel={SALE_POINT_FIELD.label}
                            salePointLabelClassNames="required"
                            onLocationChange={onLocationChange}
                            onSalePointChange={onSalePointChange}
                            autoFocusLocation={true}
                            locationId={location?.id}
                            error={error}
                        />
                    </Form>
                    {!!error.backend && <div className={styles.formError}>{error.backend}</div>}
                </div>
                <div className={styles.buttonsContainer}>
                    <UserFormButtonGroup
                        type="edit"
                        onCancel={redirectToUsersPage}
                        onSubmit={onSubmit}
                        onDelete={onDelete}
                        disableAllButtons={isSendingInfo}
                        actionPermissions={ACTION_PERMISSIONS}
                    />
                </div>
            </div>
        </>
    );
};

export default UserMultiEdit;
