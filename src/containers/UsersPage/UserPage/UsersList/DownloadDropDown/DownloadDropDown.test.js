import React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import DownloadDropDown from './DownloadDropDown';


describe('<DownloadDropDown /> test', () => {

    const container = shallow(<DownloadDropDown />);

    it('should match the snapshot when dropdown is closed', () => {
        expect(container.html()).toMatchSnapshot();
    });

    it('should match the snapshot when dropdown is open', () => {
        container.find('Button').simulate('click');
        expect(container.html()).toMatchSnapshot();
    });

    it('dropdown menu should open and close (click outside component)', async () => {
        const wrapNode = document.createElement('div');
        document.body.appendChild(wrapNode);
        const map = {};
        document.addEventListener = jest.fn((event, cb) => {
            map[event] = cb;
        });
        const event = {
            target: wrapNode,
        };
        const container = mount(<DownloadDropDown />, { attachTo: wrapNode });

        container.find('Button').simulate('click');
        expect(container.find('.dropdownMenu').hasClass('open')).toBe(true);
        expect(document.addEventListener).toHaveBeenCalled();
        await act(async () => {
            map.click(event);
        });
        container.update();
        expect(container.find('.dropdownMenu').hasClass('open')).toBe(false);

    });

    it('dropdown menu should not close (click inside component)', async () => {
        const container = mount(<DownloadDropDown />);
        const wrapNode = container.getDOMNode();
        const map ={};
        document.addEventListener = jest.fn((event, cb) => {
            map[event] = cb;
        });
        const event = {
            target: wrapNode,
        };
        container.find('Button').simulate('click');
        expect(container.find('.dropdownMenu').hasClass('open')).toBe(true);
        await act(async () => {
            map.click(event);
        });
        container.update();
        expect(container.find('.dropdownMenu').hasClass('open')).toBe(true);

    });
});
