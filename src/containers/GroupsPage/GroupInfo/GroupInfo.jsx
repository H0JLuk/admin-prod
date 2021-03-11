import React from 'react';
import BundleFormInfo from './BundleFormInfo/BundleFormInfo';
import RelatedFormInfo from './RelatedFormInfo/RelatedFormInfo';
import Header from '../../../components/Header/Header';
import { BUNDLE_LOCATION_KEY, BUNDLE_TYPE } from '../groupPageConstants';

const GroupInfo = ({ matchPath, history, location, match }) => {

    const groupType = new URLSearchParams(location.search).get('type');
    const { groupId } = match.params;
    const { state = {} } = location;

    const routerProps = { matchPath, history };

    if (!state || !state?.[BUNDLE_LOCATION_KEY]) {
        history.push(matchPath);
        return null;
    }

    const bundleData = state[BUNDLE_LOCATION_KEY];

    return (
        <div>
            <Header />
            <div>
                { groupType === BUNDLE_TYPE.IDEA && (
                    <BundleFormInfo { ...routerProps } bundleData={ bundleData } groupId={ groupId } />
                ) }
                { groupType === BUNDLE_TYPE.ASSOCIATION && (
                    <RelatedFormInfo { ...routerProps } bundleData={ bundleData } groupId={ groupId } />
                ) }
            </div>
        </div>
    );
};

export default GroupInfo;