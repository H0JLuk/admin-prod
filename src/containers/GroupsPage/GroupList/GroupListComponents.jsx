import React from 'react';
import { Button, Empty } from 'antd';
import GroupPromoCampaignListItem from './GroupPromoCampaigns/GroupPromoCampaignListItem';
import GroupBundlesListItem from './GroupBundles/GroupBundlesListItem';
import { BUTTON, EMPTY_TABLE, TYPES } from './groupListConstants';

import styles from './GroupList.module.css';

export const EmptyGroup = ({ title, preTitle, onCreateClick }) => (
    <div className={ styles.empty }>
        <div className={ styles.headerTitle_empty }>
            { title }
        </div>
        <div className={ styles.headerPreTitle }>
            { preTitle }
        </div>
        <Button
            type="primary"
            onClick={ onCreateClick }
        >
            { BUTTON.CREATE }
        </Button>
    </div>
);

export const GroupListByType = ({
    type,
    dataList,
    checkedItems,
    ...restProps
}) => {
    const Component = type === TYPES.IDEA ? GroupBundlesListItem : GroupPromoCampaignListItem;

    if (!dataList.length) {
        return (
            <Empty description={ null } className={ styles.emptyMessage }>
                <div>{ EMPTY_TABLE.firstMessagePart }</div>
                <div>{ EMPTY_TABLE.secondMessagePart }</div>
            </Empty>
        );
    }

    return dataList.map(item => (
        <Component
            key={ item.id }
            item={ item }
            checked={ checkedItems[item.id] }
            { ...restProps }
        />
    ));
};
