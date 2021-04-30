import React from 'react';
import { shallow } from 'enzyme';

import PromoCampaignVisibilitySettingTable from './PromoCampaignVisibilitySettingTable';

import { visibilitySettingsTestArray } from '../../../../../../__tests__/constants';


const promoCampaignVisibilitySettingTablePropsTestData = {
    loading: false,
    dataSource: visibilitySettingsTestArray,
    pagination: {
        current: 1,
        total: 2,
        pageSize: '10',
        locale: {
            items_per_page: '',
            prev_page: 'Назад',
            next_page: 'Вперед',
            jump_to: 'Перейти',
            prev_5: 'Предыдущие 5',
            next_5: 'Следующие 5',
            prev_3: 'Предыдущие 3',
            next_3: 'Следующие 3'
        },
        showSizeChanger: true,
        showQuickJumper: true
    },
    rowSelection: undefined,
    selectedRow: '1',
    onChange() {
        return;
    },
    onChangeVisible() {
        return;
    }
};


describe('<PromoCampaignVisibilitySettingTable /> tests', () => {
    const props = {
        ...promoCampaignVisibilitySettingTablePropsTestData,
    };

    it('PromoCampaignVisibilitySettingTable snapshot', () => {
        const wrapper = shallow(<PromoCampaignVisibilitySettingTable { ...props } />);
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
