import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header/Header';
import BundleForm from './BundleForm/BundleForm';
import RelatedPromoCampaignsForm from './RelatedPromoCampaignsForm/RelatedPromoCampaignsForm';
import { getFilteredPromoCampaignList } from '../../../api/services/promoCampaignService';
import { getCampaignGroupList } from '../../../api/services/campaignGroupService';
import { BUNDLE_LOCATION_KEY, BUNDLE_TYPE } from '../groupPageConstants';
import { groupFormFilterBy } from './groupForm.constants';

const GroupForm = ({ matchPath, history, match, mode, location }) => {
    const groupType = new URLSearchParams(location.search).get('type');
    const [promoCampaignList, setPromoCampaignList] = useState([]);
    const [loading, setLoading] = useState(false);
    const { groupId } = match.params;
    const { state = {} } = location;
    const bundleData = state[BUNDLE_LOCATION_KEY];

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
                type: groupFormFilterBy[groupType]
            });
            setPromoCampaignList(promoCampaignDtoList);
        })();
        hideLoading();
    }, [groupType]);

    return (
        <div>
            <Header />
            <div>
                { groupType === BUNDLE_TYPE.IDEA && (
                    <BundleForm
                        promoCampaignList={ promoCampaignList }
                        loadCampaignGroupList={ loadCampaignGroupList }
                        mode={ mode }
                        bundleData={ bundleData }
                        loading={ loading }
                        showLoading={ showLoading }
                        hideLoading={ hideLoading }
                        redirectToBundleList={ redirectToBundleList }
                        { ...routerProps }
                    />
                ) }
                { groupType === BUNDLE_TYPE.ASSOCIATION && (
                    <RelatedPromoCampaignsForm
                        promoCampaignList={ promoCampaignList }
                        loadCampaignGroupList={ loadCampaignGroupList }
                        bundleData={ bundleData }
                        loading={ loading }
                        showLoading={ showLoading }
                        hideLoading={ hideLoading }
                        redirectToBundleList={ redirectToBundleList }
                        mode={ mode }
                        { ...routerProps }
                    />
                ) }
            </div>
        </div>
    );
};

export default GroupForm;
