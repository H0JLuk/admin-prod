import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Location } from 'history';
import { BundleDto, PromoCampaignDto } from '@types';
import BundleForm from './BundleForm';
import Header from '@components/Header';
import RelatedPromoCampaignsForm from './RelatedPromoCampaignsForm/';
import { getFilteredPromoCampaignList } from '@apiServices/promoCampaignService';
import { getCampaignGroupList } from '@apiServices/campaignGroupService';
import { BundleTypes, BUNDLE_LOCATION_KEY } from '../groupPageConstants';

export type GroupFormProps = RouteComponentProps<{ groupId: string; }> & {
    matchPath: string;
    mode: string;
};

export type BundleData = { [BUNDLE_LOCATION_KEY]: BundleDto; };

const groupFormFilterBy = {
    [BundleTypes.IDEA]: 'PRESENT',
    [BundleTypes.ASSOCIATION]: 'NORMAL',
};

const GroupForm: React.FC<GroupFormProps> = ({ matchPath, history, match, mode, location }) => {
    const groupType = new URLSearchParams(location.search).get('type')?.toUpperCase() as BundleTypes;
    const [promoCampaignList, setPromoCampaignList] = useState<PromoCampaignDto[]>([]);
    const [loading, setLoading] = useState(false);
    const { groupId } = match.params;
    const { state = {} } = location as Location<BundleData>;
    const bundleData = (state as BundleData)?.[BUNDLE_LOCATION_KEY];

    const routerProps = { history, matchPath };

    const redirectToBundleList = () => {
        history.push(matchPath);
    };

    const showLoading = () => {
        setLoading(true);
    };

    const hideLoading = () => {
        setLoading(false);
    };

    const loadCampaignGroupList = async () => {
        try {
            showLoading();
            const { groups } = await getCampaignGroupList();
            const [groupData] = groups.filter(({ id }) => id === Number(groupId));

            if (!groupData) {
                redirectToBundleList();
                return;
            }

            hideLoading();
            return groupData;
        } catch (e) {
            console.warn(e);

            hideLoading();
            throw Error(e);
        }
    };

    useEffect(() => {
        showLoading();
        (async () => {
            const { promoCampaignDtoList = [] } = await getFilteredPromoCampaignList({
                type: groupFormFilterBy[groupType],
            });
            setPromoCampaignList(promoCampaignDtoList);
        })();
        hideLoading();
    }, [groupType]);

    return (
        <div>
            <Header />
            <div>
                {groupType === BundleTypes.IDEA && (
                    <BundleForm
                        promoCampaignList={promoCampaignList}
                        loadCampaignGroupList={loadCampaignGroupList}
                        mode={mode}
                        bundleData={bundleData}
                        loading={loading}
                        showLoading={showLoading}
                        hideLoading={hideLoading}
                        redirectToBundleList={redirectToBundleList}
                        {...routerProps}
                    />
                )}
                {groupType === BundleTypes.ASSOCIATION && (
                    <RelatedPromoCampaignsForm
                        promoCampaignList={promoCampaignList}
                        loadCampaignGroupList={loadCampaignGroupList}
                        bundleData={bundleData}
                        loading={loading}
                        showLoading={showLoading}
                        hideLoading={hideLoading}
                        redirectToBundleList={redirectToBundleList}
                        mode={mode}
                        {...routerProps}
                    />
                )}
            </div>
        </div>
    );
};

export default GroupForm;
