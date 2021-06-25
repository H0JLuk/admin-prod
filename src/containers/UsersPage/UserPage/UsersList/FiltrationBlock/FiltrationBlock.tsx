import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Select } from 'antd';

import AutoCompleteComponent, { AutoCompleteMethods } from '@components/AutoComplete';
import { getPartnersList } from '@apiServices/usersService';
import { getActiveClientApps } from '@apiServices/clientAppService';
import { LOGIN_TYPE_OPTIONS } from '@constants/loginTypes';
import { SearchParams } from '@components/HeaderWithActions/types';
import { ClientAppDto, UserInfo } from '@types';

import styles from './FiltrationBlock.module.css';
import { ReactComponent as Cross } from '@imgs/cross.svg';

type FiltrationBlockProps = {
    params: SearchParams;
    onChangeFilter(params: SearchParams): void;
    disabledAllFields?: boolean;
};

const TITLE = 'Фильтры';
const CLEAR_FILTERS = 'Очистить';

const FILTER_TYPES = {
    BY_PARTNER: 'Логин партнёра',
    BY_APP: 'Приложение',
    BY_LOGIN_TYPE: 'Способ авторизации',
};

const LOGIN_TYPE_OPTIONS_WITH_RESET = [...LOGIN_TYPE_OPTIONS, { label: 'По умолчанию', value: '' }];

const FiltrationBlock: React.FC<FiltrationBlockProps> = ({
    params,
    onChangeFilter,
    disabledAllFields,
}) => {
    const [clientApps, setClientApps] = useState<ClientAppDto[]>([]);
    const partnerMethods = useRef({} as AutoCompleteMethods<UserInfo>);
    const isExistFilters = params.clientAppCode || params.loginType || params.parentUserName;

    useEffect(() => {
        (async () => {
            const clientAppList = await getActiveClientApps();
            setClientApps(clientAppList);
        })();
    }, []);

    const onParentUserSelect = (data: UserInfo | null) => {
        const parentUserName = data?.personalNumber || '';

        if (!parentUserName && !params.parentUserName) {
            return;
        }

        onChangeFilter({
            ...params,
            parentUserName,
            parentId: data?.id ?? '',
        });
    };

    const onAppSelect = (clientAppCode: string | number) => {
        onChangeFilter({ ...params, clientAppCode });
    };

    const onLoginTypeSelect = (loginType: string | number) => {
        onChangeFilter({
            ...params,
            loginType,
            clientAppCode: !loginType ? '' : params.clientAppCode,
        });
    };

    const clearFilters = () => {
        partnerMethods.current.clearState();
        onChangeFilter({
            ...params,
            loginType: '',
            clientAppCode: '',
            parentUserName: '',
        });
    };

    const filteredClientApps = useMemo(() => clientApps
        .filter(({ loginTypes }) => !params.loginType || loginTypes.includes(params.loginType as string))
        .map(({ code, displayName }) => ({ label: displayName, value: code })),
    [clientApps, params.loginType]);

    return (
        <div className={styles.container}>
            <div className={styles.title}>
                {TITLE}
            </div>
            <div className={styles.filterBlock}>
                <div className={styles.autoComplete}>
                    <AutoCompleteComponent
                        value={params.parentUserName as string}
                        placeholder={FILTER_TYPES.BY_PARTNER}
                        onSelect={onParentUserSelect}
                        requestFunction={getPartnersList}
                        renderOptionItemLabel={(option) => option.personalNumber}
                        renderOptionStringValue={(option) => option.personalNumber}
                        componentMethods={partnerMethods}
                        disabled={disabledAllFields}
                    />
                </div>
                <Select<string | number>
                    dropdownMatchSelectWidth={false}
                    className={styles.filterItem}
                    options={!params.loginType ? LOGIN_TYPE_OPTIONS : LOGIN_TYPE_OPTIONS_WITH_RESET}
                    onSelect={onLoginTypeSelect}
                    placeholder={FILTER_TYPES.BY_LOGIN_TYPE}
                    value={params.loginType || undefined}
                    disabled={disabledAllFields}
                />
                {!!params.loginType && (
                    <Select<string | number>
                        dropdownMatchSelectWidth={false}
                        className={styles.filterItem}
                        options={filteredClientApps}
                        onSelect={onAppSelect}
                        placeholder={FILTER_TYPES.BY_APP}
                        value={params.clientAppCode || undefined}
                        disabled={disabledAllFields}
                    />
                )}
                {isExistFilters && (
                    <div
                        className={styles.clearButton}
                        onClick={!disabledAllFields ? clearFilters : undefined}
                        data-disabled={disabledAllFields}
                    >
                        {CLEAR_FILTERS}
                        <Cross />
                    </div>
                )}
            </div>
        </div>
    );
};

export default FiltrationBlock;
