import React from 'react';
import { generatePath, useLocation } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { confirmModal, errorModal, successModal } from '@utils/utils';
import { BUTTON_TEXT } from '@constants/common';
import {
    deleteDzo,
} from '../../../api/services/dzoService';
import DzoInfo from './DzoInfo';
import { dzoListTestData } from '../../../../__tests__/constants';

const props = {
    matchPath: 'matchPath',
};
const mockHistoryPush = jest.fn();

jest.mock('@utils/utils', () => ({
    confirmModal: jest.fn(),
    successModal: jest.fn(),
    errorModal: jest.fn(),
}));

jest.mock('../../../api/services/dzoService', () => ({
    deleteDzo: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    useLocation: jest.fn(),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
    generatePath: jest.fn(),
}));

const dzoId = dzoListTestData[0].dzoId;
const mockLocationState = {
    dzoCodes: ['doc_old_4', 'delivery_club_old_3', 'sberbox'],
    dzoData: dzoListTestData[0],
};

describe('<DzoInfo /> test', () => {
    beforeEach(() => {
        (useLocation as jest.Mock).mockImplementation(() => ({
            state: mockLocationState,
        }));
    });

    it('should match the snapshot', () => {
        const Component = render(<DzoInfo {...props} />);
        expect(Component.container).toMatchSnapshot();
    });

    it('should redirect without dzoData from location state', () => {
        (useLocation as jest.Mock).mockImplementation(() => ({ state: {} }));
        render(<DzoInfo {...props} />);
        expect(mockHistoryPush).toBeCalledTimes(1);
        expect(mockHistoryPush).toBeCalledWith(props.matchPath);
    });

    it('should edit dzo', () => {
        (generatePath as jest.Mock).mockReturnValue(props.matchPath);
        render(<DzoInfo {...props} />);

        userEvent.click(screen.getByText(BUTTON_TEXT.EDIT));
        const { dzoData } = mockLocationState;
        expect(mockHistoryPush).toBeCalledWith(props.matchPath, { dzoData });
    });

    it('should delete dzo after submit modal window', async () => {
        (deleteDzo as jest.Mock).mockResolvedValue(null);
        render(<DzoInfo {...props} />);

        userEvent.click(screen.getByText(BUTTON_TEXT.DELETE));
        expect(confirmModal).toHaveBeenCalledTimes(1);
        await (confirmModal as jest.Mock).mock.calls[0][0].onOk();
        expect(deleteDzo).toBeCalledWith(dzoId);

        await (successModal as jest.Mock).mock.calls[0][0].onOk();
        expect(mockHistoryPush).toBeCalledWith(props.matchPath);
    });

    it('should handle error at deleting dzo after submit modal window', async () => {
        const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => '');
        (deleteDzo as jest.Mock).mockRejectedValue(new Error('mock error message'));
        render(<DzoInfo {...props} />);

        userEvent.click(screen.getByText(BUTTON_TEXT.DELETE));
        expect(confirmModal).toHaveBeenCalledTimes(1);
        await (confirmModal as jest.Mock).mock.calls[0][0].onOk();

        expect(deleteDzo).toBeCalledWith(dzoId);
        expect(consoleWarn).toBeCalledWith(new Error('mock error message'));
        expect(errorModal).toBeCalledTimes(1);
    });
});
