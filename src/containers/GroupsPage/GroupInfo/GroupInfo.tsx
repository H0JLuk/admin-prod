import React from 'react';
import { Location } from 'history';
import BundleFormInfo from './BundleFormInfo';
import RelatedFormInfo from './RelatedFormInfo';
import Header from '@components/Header';
import { BundleTypes, BUNDLE_LOCATION_KEY } from '../groupPageConstants';
import { RouteComponentProps } from 'react-router-dom';
import { BundleData } from '../GroupForms';

export type GroupInfoProps = RouteComponentProps<{[x: string]: string | undefined;}> & {
    matchPath: string;
};

const GroupInfo: React.FC<GroupInfoProps> = ({ matchPath, history, location, match }) => {

    const groupType = new URLSearchParams(location.search).get('type')?.toUpperCase();
    const { groupId } = match.params;
    const { state = {} } = location as Location<BundleData>;

    const routerProps = { matchPath, history };

    if (!state || !(state as BundleData)?.[BUNDLE_LOCATION_KEY]) {
        history.push(matchPath);
        return null;
    }

    const bundleData = (state as BundleData)[BUNDLE_LOCATION_KEY];

    return (
        <div>
            <Header />
            <div>
                {groupType === BundleTypes.IDEA && (
                    <BundleFormInfo {...routerProps} bundleData={bundleData} groupId={Number(groupId)} />
                )}
                {groupType === BundleTypes.ASSOCIATION && (
                    <RelatedFormInfo {...routerProps} bundleData={bundleData} groupId={Number(groupId)} />
                )}
            </div>
        </div>
    );
};

export default GroupInfo;
