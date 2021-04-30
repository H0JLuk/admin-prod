import React from 'react';
import DropdownWithLogout from './DropdownWithLogout';
import { shallow } from 'enzyme';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { logout } from '../../api/services/authService';

const mockPush = jest.fn();
jest.mock('react-router-dom', () => ({
    useHistory: () => ({
        push: mockPush,
    }),
}));

jest.mock('../../api/services/authService', () => ({
    logout: jest.fn()
}));

describe('<DropdownWithLogout /> tests', () => {
    it('DropdownWithLogout snapshot', () => {
        const DropdownItem = shallow(<DropdownWithLogout />);
        expect(DropdownItem.html()).toMatchSnapshot();
    });

    it('should logout', async () => {
        render(<DropdownWithLogout />);
        fireEvent.click(
            screen.getByRole('img', {
                name: /user/i,
            })
        );

        await act(async () => {
            fireEvent.click(screen.getByText('Выйти'));
        });

        expect(logout).toBeCalled();
        expect(mockPush).toBeCalled();
    });

    it('should render exit button', () => {
        render(<DropdownWithLogout />);

        fireEvent.click(
            screen.getByRole('img', {
                name: /user/i,
            })
        );

        expect(screen.getByText('Выйти')).toBeInTheDocument();
    });
});
