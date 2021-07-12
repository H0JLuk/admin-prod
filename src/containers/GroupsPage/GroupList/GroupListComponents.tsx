import React from 'react';
import { Button } from 'antd';
import GroupPromoCampaignListItem from './GroupPromoCampaigns/GroupPromoCampaignListItem';
import GroupBundlesListItem from './GroupBundles/GroupBundlesListItem';
import EmptyMessage from '@components/EmptyMessage';
import { BUTTON } from './groupListConstants';
import { BundleTypes } from '../groupPageConstants';
import { GroupListByTypeProps } from './types';

import styles from './GroupList.module.css';

type EmptyGroupProps = {
    title: string;
    preTitle: string;
    onCreateClick: () => void;
};

export const EmptyGroup: React.FC<EmptyGroupProps> = ({ title, preTitle, onCreateClick }) => (
    <div className={styles.empty}>
        <div className={styles.headerTitle_empty}>
            {title}
        </div>
        <div className={styles.headerPreTitle}>
            {preTitle}
        </div>
        <Button
            type="primary"
            onClick={onCreateClick}
        >
            {BUTTON.CREATE}
        </Button>
    </div>
);

export const GroupListByType: React.FC<GroupListByTypeProps> = ({
    type,
    dataList,
    checkedItems,
    ...restProps
}) => {
    const Component = type === BundleTypes.IDEA ? GroupBundlesListItem : GroupPromoCampaignListItem;

    if (!dataList.length) {
        return <EmptyMessage />;
    }

    return dataList.map(item => (
        <Component
            key={item.id}
            item={item}
            checked={checkedItems[item.id]}
            {...restProps}
        />
    )) as Exclude<React.ReactNode, undefined | null | React.ReactFragment>;
};
