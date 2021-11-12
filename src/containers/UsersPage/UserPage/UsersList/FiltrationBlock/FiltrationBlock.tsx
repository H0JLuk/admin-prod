import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Select } from 'antd';

import AutoCompleteComponent, { AutoCompleteMethods } from '@components/AutoComplete';
import { getPartnersList } from '@apiServices/usersService';
import { OptionData } from 'rc-select/lib/interface';
import { getFilteredPromoCampaignList } from '@apiServices/promoCampaignService';
import { getCampaignGroupList } from '@apiServices/campaignGroupService';
import { getActiveClientApps } from '@apiServices/clientAppService';
import { LOGIN_TYPE_OPTIONS } from '@constants/loginTypes';
import { SearchParams } from '@components/HeaderWithActions/types';
import EmptyMessage from '@components/EmptyMessage';
import { ClientAppDto, UserInfo } from '@types';

import styles from './FiltrationBlock.module.css';
import { ReactComponent as Cross } from '@imgs/cross.svg';

type FiltrationBlockProps = {
    params: SearchParams;
    initialParentUserData?: UserInfo;
    onChangeParent(parentUserData: UserInfo | null): void;
    onChangeFilter(params: SearchParams): void;
    disabledAllFields?: boolean;
};

const TITLE = 'Фильтры';
const CLEAR_FILTERS = 'Очистить';

const FILTER_TYPES = {
    BY_PARTNER: 'Логин партнёра',
    BY_APP: 'Приложение',
    BY_LOGIN_TYPE: 'Способ авторизации',
    BY_PROMOCAMPAIGN: 'Промокампания',
    BY_BUNDLE: 'Бандл',
    BY_TYPE: 'Тип',
};

const TYPE_FIELD_OPTIONS = [
    { value: 'promoCampaign', label: 'Промокампания' },
    { value: 'campaignGroup', label: 'Бандл' },
];

const LOGIN_TYPE_OPTIONS_WITH_RESET = [...LOGIN_TYPE_OPTIONS, { label: 'По умолчанию', value: '' }];

const FiltrationBlock: React.FC<FiltrationBlockProps> = ({
    params,
    onChangeFilter,
    disabledAllFields,
    onChangeParent,
    initialParentUserData,
}) => {
    const [clientApps, setClientApps] = useState<ClientAppDto[]>([]);
    const [promoCampaignList, setPromoCampaignList] = useState<OptionData[]>([]);
    const [groupCampaignList, setGroupCampaignList] = useState<OptionData[]>([]);
    const partnerMethods = useRef({} as AutoCompleteMethods<UserInfo>);
    const isExistFilters = params.clientAppCode || params.loginType || params.parentId;

    useEffect(() => {
        (async () => {
            const clientAppList = await getActiveClientApps();
            setClientApps(clientAppList);
        })();
    }, []);

    useEffect(() => {
        (async() => {
            if (params.appType === 'promoCampaign' && !promoCampaignList.length) {
                try {
                    const { promoCampaignDtoList } = await getFilteredPromoCampaignList(
                        { type: 'NORMAL' },
                        params.clientAppCode as string,
                    ) ?? {};
                    const list = promoCampaignDtoList.map((elem) => ({ value: elem.id, label: elem.name }));
                    setPromoCampaignList(list);
                } catch (e: any) {
                    if (e.message) {
                        console.error(e.message);
                    }
                }
            } else if (params.appType === 'campaignGroup' && !groupCampaignList.length) {
                try {
                    const { groups } = await getCampaignGroupList(params.clientAppCode as string) ?? {};
                    const groupList = groups.map((elem) => ({ value: elem.id, label: elem.name }));
                    setGroupCampaignList(groupList);
                } catch (e: any) {
                    if (e.message) {
                        console.error(e.message);
                    }
                }
            }
        })();
    }, [params.appType, groupCampaignList.length, promoCampaignList.length, params.clientAppCode]);

    const onParentUserSelect = (user: UserInfo | null) => {
        onChangeParent(user);
        if (!user && !params.parentId) {
            return;
        }

        onChangeFilter({
            ...params,
            parentId: user?.id ?? '',
        });
    };

    const onAppSelect = (clientAppCode: string | number) => {
        setPromoCampaignList([]);
        setGroupCampaignList([]);
        onChangeFilter({ ...params, clientAppCode });
    };

    const onAppTypeSelect = async(appType: string | number) => {
        onChangeFilter({ ...params, appType });
    };

    const onPromoCampaignSelect = async(campaignId: string | number) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { groupId, ...rest } = params;
        onChangeFilter({ ...rest, campaignId });
    };

    const onCampaignGroupSelect = async(groupId: string | number) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { campaignId, ...rest } = params;
        onChangeFilter({ ...rest, groupId });
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
        onChangeParent(null);
        onChangeFilter({
            ...params,
            loginType: '',
            clientAppCode: '',
            parentId: '',
            appType: '',
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
                <AutoCompleteComponent
                    className={styles.filterItem}
                    value={initialParentUserData}
                    placeholder={FILTER_TYPES.BY_PARTNER}
                    inputMaxLength={15}
                    onSelect={onParentUserSelect}
                    requestFunction={getPartnersList}
                    renderOptionItemLabel={(option) => option.personalNumber}
                    renderOptionStringValue={(option) => option.personalNumber}
                    componentMethods={partnerMethods}
                    disabled={disabledAllFields}
                />
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
                {!!params.clientAppCode && (
                    <Select
                        dropdownMatchSelectWidth={false}
                        className={styles.filterItem}
                        placeholder={FILTER_TYPES.BY_TYPE}
                        options={TYPE_FIELD_OPTIONS}
                        onSelect={onAppTypeSelect}
                        value={params.appType || undefined}
                        disabled={disabledAllFields}
                    />
                )}
                {params.appType === 'promoCampaign' && (
                    <Select<string | number>
                        dropdownMatchSelectWidth={false}
                        className={styles.filterItem}
                        placeholder={FILTER_TYPES.BY_PROMOCAMPAIGN}
                        options={promoCampaignList}
                        onSelect={onPromoCampaignSelect}
                        value={params.promoCampaign || undefined}
                        disabled={disabledAllFields}
                    />
                )}
                {params.appType === 'campaignGroup' && (
                    <Select<string | number>
                        dropdownMatchSelectWidth={false}
                        className={styles.filterItem}
                        placeholder={FILTER_TYPES.BY_BUNDLE}
                        options={groupCampaignList}
                        onSelect={onCampaignGroupSelect}
                        value={params.campaignGroup || undefined}
                        disabled={disabledAllFields}
                        notFoundContent={<EmptyMessage />}
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
