import React from 'react';
import { shallow } from 'enzyme';
import UserBlockStatus from './UserBlockStatus';

const STATUS_BLOCKED = 'Заблокирован';
const STATUS_ACTIVE = 'Активен';

const TEST_CLASS = 'TEST_CLASS';

const TEST_PROPS_FALSE = {
    blocked: false,
    withText: false,
    className: TEST_CLASS,
};

const TEST_PROPS_TRUE = {
    blocked: true,
    withText: true,
    className: TEST_CLASS,
};

describe('<UserBlockStatus /> test', () => {
    const Component = shallow(<UserBlockStatus { ...TEST_PROPS_FALSE } />);

    it('should be mount', () => {
        expect(Component.html()).toMatchSnapshot();
    });

    it('should be class name status on', () => {
        const statusBlock = Component.find('.statusOn');
        expect(statusBlock.debug()).not.toBe('');
    });

    it('should be class name status off and title status blocked', () => {
        const Component = shallow(<UserBlockStatus { ...TEST_PROPS_TRUE } />);
        const statusBlock = Component.find('.statusOff');
        const statusTitle = Component.find(`.${TEST_CLASS}`);
        expect(statusBlock.debug()).not.toBe('');
        expect(statusTitle.text()).toBe(STATUS_BLOCKED);
    });

    it('should be class name status on and title status active', () => {
        const Component = shallow(<UserBlockStatus { ...TEST_PROPS_TRUE } blocked={ false } />);
        const statusBlock = Component.find('.statusOn');
        const statusTitle = Component.find(`.${TEST_CLASS}`);
        expect(statusBlock.debug()).not.toBe('');
        expect(statusTitle.text()).toBe(STATUS_ACTIVE);
    });

});
