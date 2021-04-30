import React from 'react';
import { mount } from 'enzyme';
import SearchInputWithAction from './SearchInputWithAction';

const TEST_PARAMS = {
    pageNo: 0,
    pageSize: 10,
    sortBy: '',
    direction: 'ASC',
    filterText: '',
    totalElements: 0,
};

const TEST_PROPS = {
    placeholder: 'TEST_PLACEHOLDER',
    onChangeValue: jest.fn(),
    params: TEST_PARAMS,
    onChangeInput: jest.fn(),
    resetPage: false,
};

const TEST_VALUE = 'TEST_VALUE';

describe('<SearchInputWithAction /> test', () => {
    const SearchInput = mount(<SearchInputWithAction { ...TEST_PROPS } />);
    const input = SearchInput.find('input');

    it('should mount', () => {
        expect(SearchInput.html()).toMatchSnapshot();
    });

    it('should input to SearchInput and check called times', () => {
        input.simulate('change', { target: { value: TEST_VALUE } });
        expect(TEST_PROPS.onChangeValue).toBeCalledTimes(1);
        expect(TEST_PROPS.onChangeValue).toBeCalledWith({ ...TEST_PARAMS, filterText: TEST_VALUE });
        expect(TEST_PROPS.onChangeInput).toBeCalledTimes(1);
    });

    it('should input to SearchInput and change pageNo to 0', () => {
        const SearchInput = mount(<SearchInputWithAction { ...TEST_PROPS } resetPage={ true } />);

        SearchInput.find('input').simulate('change', { target: { value: TEST_VALUE } });
        expect(TEST_PROPS.onChangeValue).toBeCalledWith({ ...TEST_PARAMS, pageNo: 0, filterText: TEST_VALUE });
    });

});
