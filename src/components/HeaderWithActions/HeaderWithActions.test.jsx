import React from 'react';
import { mount, shallow } from 'enzyme';
import HeaderWithActions from './HeaderWithActions';
import { sleep } from '../../setupTests';
import { defaultSearchParams } from '../../utils/helper';

const TEST_BUTTONS_PROPS = [
    {
        label: 'TEST_TEXT_ONE',
        type: 'TEST_PRIMARY_TYPE',
        onClick: jest.fn(),
        disabled: false,
    },
    {
        label: 'TEST_TEXT_TWO',
        type: 'TEST_DANGER_TYPE',
        onClick: jest.fn(),
        disabled: true,
    },
];

const TEST_MENU_ITEMS = [
    {
        name: 'TEST_NAME_ONE',
        label: 'TEST_LABEL_ONE',
        active: false
    },
    {
        name: 'TEST_NAME_TWO',
        label: 'TEST_LABEL_TWO',
        active: false
    }
];

const TEST_SYNC_PROPS = {
    title: 'TEST_TITLE_PROP',
    buttons: TEST_BUTTONS_PROPS,
    showSearchInput: true,
    showSorting: true,
    triggerResetParams: false,
    setDataList: jest.fn(),
    copyDataList: [],
    matchPath: 'TEST_PATH',
    sortByFieldKey: 'TEST_KEY',
    menuItems: TEST_MENU_ITEMS,
    inputPlaceholder: 'TEST_PLACEHOLDER',
    resetLabel: 'TEST_LABEL',
    params: defaultSearchParams,
    setParams: jest.fn(),
    onChangeInput: jest.fn(),
    onChangeSort: jest.fn(),
    loading: false,
    loadData: jest.fn(),
    enableAsyncSort: false,
    enableHistoryReplace: true,
};

const TEST_ASYNC_PROPS = { ...TEST_SYNC_PROPS, enableAsyncSort: true };

const TEST_VALUE = 'TEST_VALUE';

const TEST_SORT_BY = {
    STRING: 'TEST',
    NUMBER: 123,
};

const mock = jest.fn();

jest.mock('react-router-dom', () => ({
    useParams: () => ({ userId: 1 }),
    useHistory: () => ({
        replace: mock,
        location: {
            search: 'pageNo=1&pageSize=20&sortBy=&direction=ASC&filterText=',
        },
    }),
    generatePath: jest.fn()
}));

describe('<HeaderWithActions /> tests.', () => {
    const Header = mount(
        <HeaderWithActions { ...TEST_SYNC_PROPS } />
    );

    it('should be mount', () => {
        expect(Header.html()).toMatchSnapshot();
    });

    it('should render title from props', () => {
        expect(Header.find('div.headerTitle').text()).toBe(TEST_SYNC_PROPS.title);
    });

    it('should call change input function', () => {
        Header.find('input').simulate('change', { target: { value: TEST_VALUE } });
        expect(TEST_SYNC_PROPS.onChangeInput).toHaveBeenCalledTimes(1);
    });

    it('should call change input function with async params', async () => {
        const HeaderAsync = mount(
            <HeaderWithActions { ...TEST_ASYNC_PROPS } />
        );
        HeaderAsync.find('input').simulate('change', { target: { value: TEST_VALUE } });
        // sleep need because loadData function is debounced
        await sleep(501);
        expect(TEST_SYNC_PROPS.loadData).toHaveBeenCalledTimes(1);
    });

    it('should call `changeSort` function', () => {
        const Header = shallow(
            <HeaderWithActions { ...TEST_SYNC_PROPS } />
        );
        const DropDown = Header.findWhere(n => n.name() === 'Memo(DropdownWithAction)');
        DropDown.props().onMenuItemClick(TEST_SORT_BY.STRING);
        expect(TEST_SYNC_PROPS.onChangeSort).toBeCalledTimes(1);
        expect(mock).toBeCalledTimes(1);
    });

    it('should call `changeSort` function and clear sortBy if sortBy !== string', () => {
        const Header = shallow(
            <HeaderWithActions { ...TEST_SYNC_PROPS } />
        );
        const DropDown = Header.find('Memo(DropdownWithAction)');
        DropDown.props().onMenuItemClick(TEST_SORT_BY.NUMBER);
        expect(TEST_SYNC_PROPS.onChangeSort).toBeCalledTimes(1);
        expect(mock).not.toBeCalledTimes(1);
    });

    it('should call debounce with async props', async () => {
        const Header = shallow(
            <HeaderWithActions { ...TEST_ASYNC_PROPS } />
        );
        const SearchInput = Header.find('Memo(SearchInputWithAction)');
        SearchInput.props().onChangeValue();
        await sleep(501);
        expect(TEST_SYNC_PROPS.loadData).toHaveBeenCalledTimes(1);
    });

    it('should not call debounce with async props', async () => {
        const Header = shallow(
            <HeaderWithActions { ...TEST_ASYNC_PROPS } loading={ true } />
        );
        const SearchInput = Header.find('Memo(SearchInputWithAction)');
        SearchInput.props().onChangeValue();
        expect(TEST_SYNC_PROPS.loadData).toHaveBeenCalledTimes(0);
    });

    it('should rerender if change triggerParams', () => {
        const SearchInput = Header.find('Memo(SearchInputWithAction)');
        expect(SearchInput.prop('params')).toEqual({ 'direction': 'ASC', 'filterText': 'TEST_VALUE', 'sortBy': '' });
        Header.setProps({ triggerResetParams: true });
        Header.update();
        expect(Header.find('Memo(SearchInputWithAction)').prop('params')).toEqual(defaultSearchParams);
    });

});
