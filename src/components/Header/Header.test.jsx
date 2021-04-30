import React from 'react';
import { shallow } from 'enzyme';
import { LeftOutlined } from '@ant-design/icons';
import Header from './Header';

const TEST_PROPS = {
    menuMode: false,
    buttonBack: true,
    onClickFunc: jest.fn()
};

const mockHistoryGoBack = jest.fn();

jest.mock('react-router-dom', () => ({
    useHistory: () => ({
        goBack: mockHistoryGoBack
    }),
}));

describe('<Header /> test', () => {
    const Component = shallow(<Header { ...TEST_PROPS } />);

    it('should be mount snap', () => {
        expect(Component.html()).toMatchSnapshot();
    });

    it('should show LeftOutlined icon', () => {
        expect(Component.find(LeftOutlined)).toHaveLength(1);
    });

    it('should not render back button', () => {
        const Component = shallow(<Header { ...TEST_PROPS } buttonBack={ false } />);
        expect(Component.find('.backButton')).toHaveLength(0);
    });

    it('should not show MenuLinks component', () => {
        expect(Component.find('MenuLinks')).toHaveLength(0);
    });

    it('should show MenuLinks component', () => {
        const Component = shallow(<Header { ...TEST_PROPS } menuMode={ true } />);
        expect(Component.find('MenuLinks')).toHaveLength(1);
    });

    it('should call onClickFunc function', () => {
        const Component = shallow(<Header { ...TEST_PROPS } />);
        Component.find('.backButton').simulate('click');
        expect(TEST_PROPS.onClickFunc).toBeCalledTimes(1);
    });

    it('should call goBack function', () => {
        const Component = shallow(<Header { ...TEST_PROPS } onClickFunc={ null } />);
        Component.find('.backButton').simulate('click');
        expect(mockHistoryGoBack).toBeCalledTimes(1);
    });

});
