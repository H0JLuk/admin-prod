import { shallow } from 'enzyme';
import React from 'react';
import * as utils from '../../../../../utils/helper';
import RestoredTableUser from './RestoredTableUser';


describe('<RestoredTableUser /> tests', () => {
    const props = {
        users: [
            {
                generatedPassword: '1111111111',
                personalNumber: '333333333333',
            },
            {
                generatedPassword: '555555555555',
                personalNumber: '4444444444444',
            },
            {
                generatedPassword: '9999999999999',
                personalNumber: '2000000000000',
            },
        ],
    };

    it('RestoredTableUser shapshot', () => {
        const RestoredTableUserItem = shallow(<RestoredTableUser { ...props } />);
        expect(RestoredTableUserItem.html()).toMatchSnapshot();
    });

    it('should click export button', () => {
        utils.generateCsvFile = jest.fn();
        const RestoredTableUserItem = shallow(<RestoredTableUser { ...props } />);
        RestoredTableUserItem.find('Button').simulate('click');
        expect(utils.generateCsvFile).toBeCalled();
    });

    it('should render title', () => {
        const RestoredTableUserItem = shallow(<RestoredTableUser { ...props } />);
        expect(RestoredTableUserItem.find('.titleRestored').text()).toEqual('Пароль успешно сброшен для:');
    });

    it('should render usersList', () => {
        const RestoredTableUserItem = shallow(<RestoredTableUser { ...props } />);
        expect(RestoredTableUserItem.find('.usersList')).toHaveLength(1);
    });

});
