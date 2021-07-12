import React from 'react';
import { shallow } from 'enzyme';
import BusinessRolesTable from './BusinessRolesTable';

const TEST_ROLES_LIST = [
    {
        id: 1,
        name: 'TEST',
        description: 'TEST_DESCRIPTION',
        deleted: false,
        startDate: '2019-12-01',
        endDate: '2021-09-11',
    },
];

const BusinessRolesTableTestProps = {
    businessRolesList: TEST_ROLES_LIST,
    rowSelection: {},
    onRow: () => ({}),
    loading: false,
};

describe('BusinessRoleTable test', () => {
    it('should match snapshot', () => {
        const wrapper = shallow(<BusinessRolesTable {...BusinessRolesTableTestProps} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
