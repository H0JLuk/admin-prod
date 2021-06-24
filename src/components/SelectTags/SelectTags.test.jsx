import React from 'react';
import SelectTags from './SelectTags';
import { mount, shallow } from 'enzyme';
import { act, fireEvent, render } from '@testing-library/react';
import { sleep } from '../../setupTests';

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useLayoutEffect: jest.requireActual('react').useEffect,
}));

describe('<SelectTags /> tests', () => {
    const props = {
        onChange: jest.fn(),
        data: [
            {
                active: true,
                categoryDescription: '-50%',
                categoryId: 8,
                categoryName: 'Организуем приём у лучших врачей онлайн 24/7',
                categoryUrl: 'http://distributor-fs:8081/distributor-fs/file?path=category/6.png',
                highlights: [],
            },
        ],
        value: ['11', '8'],
        nameKey: 'categoryName',
        idKey: 'categoryId',
        placeholder: 'Выберите категорию',
    };

    it('SelectTags snapshot', () => {
        const SelectTagsItem = shallow(<SelectTags { ...props } />);
        expect(SelectTagsItem.html()).toMatchSnapshot();
    });

    it('should clear select and call onChange func', () => {
        const { container } = render(<SelectTags { ...props } />);
        fireEvent.click(container.getElementsByClassName('anticon-close')[0]);
        expect(props.onChange).toBeCalled();
    });

    it('should open dropdown and call onChange func', async () => {
        const newProps = { ...props, value: [] };
        const wrapper = render(<SelectTags { ...newProps } />);

        await act(async() => {
            fireEvent.mouseDown(wrapper.getByText(props.placeholder));
            await sleep();
            expect(document.querySelector('.ant-select-dropdown')).toBeInTheDocument();
        });

        await act(async() => {
            fireEvent.click(wrapper.getByText(props.data[0].categoryName));
            await sleep();
            expect(props.onChange).toBeCalled();
        });
    });

    it('should call tagRender func and return tagSelect element', async() => {
        jest.useFakeTimers();
        const onClose = jest.fn();
        const wrapper = mount(<SelectTags { ...props } />);

        wrapper.find('.ant-select-selector').simulate('mousedown');
        jest.runAllTimers();
        wrapper.update();

        await act(async() => {
            const {
                props: { className },
            } = wrapper.find('Select').prop('tagRender')({ value: props.value[1], onClose });
            expect(className).toEqual('tagSelect');
        });
    });

    it('should have str[] in select value prop', () => {
        const newProps = { ...props, value: [11, 8] };
        const SelectTagsItem = shallow(<SelectTags { ...newProps } />);
        expect(SelectTagsItem.prop('value')[0]).toEqual(newProps.value[0].toString());
        expect(SelectTagsItem.prop('value')[1]).toEqual(newProps.value[1].toString());
    });
});
