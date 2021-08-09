import React from 'react';
import { generatePath } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { confirmModal, errorModal } from '@utils/utils';
import { BUTTON_TEXT } from '@constants/common';
import {
    deleteDzo,
} from '@apiServices/dzoService';
import DzoInfo from './DzoInfo';
import { dzoListTestData } from '@testConstants';
import { customNotifications } from '@utils/notifications';

const mockHistoryPush = jest.fn();
const props = {
    matchPath: 'matchPath',
    location: {
        state: {
            dzoCodes: ['doc_old_4', 'delivery_club_old_3', 'sberbox'],
            dzoData: dzoListTestData[0],
        },
    },
    history: {
        push: mockHistoryPush,
    },
} as any;

jest.mock('@utils/utils', () => ({
    confirmModal: jest.fn(),
    successModal: jest.fn(),
    errorModal: jest.fn(),
}));

jest.mock('@utils/notifications', () => ({
    customNotifications: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

jest.mock('@apiServices/dzoService', () => ({
    deleteDzo: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    generatePath: jest.fn(),
}));

const dzoId = dzoListTestData[0].dzoId;
const mockLocationState = {
    dzoCodes: ['doc_old_4', 'delivery_club_old_3', 'sberbox'],
    dzoData: dzoListTestData[0],
};

describe('<DzoInfo /> test', () => {
    it('should match the snapshot', () => {
        const Component = render(<DzoInfo {...props} />);
        expect(Component.container).toMatchSnapshot();
    });

    it('should redirect without dzoData from location state', () => {
        render(
            <DzoInfo
                {...props}
                location={{ state: undefined }}
            />,
        );
        expect(mockHistoryPush).toBeCalledTimes(1);
        expect(mockHistoryPush).toBeCalledWith(props.matchPath);
    });

    it('should edit dzo', () => {
        (generatePath as jest.Mock).mockReturnValue(props.matchPath + '/test');
        render(<DzoInfo {...props} />);

        userEvent.click(screen.getByText(BUTTON_TEXT.EDIT));
        const { dzoData } = mockLocationState;
        expect(mockHistoryPush).toBeCalledWith(props.matchPath + '/test', { dzoData });
    });

    it('should delete dzo after submit modal window', async () => {
        (deleteDzo as jest.Mock).mockResolvedValue(null);
        render(<DzoInfo {...props} />);

        userEvent.click(screen.getByText(BUTTON_TEXT.DELETE));
        expect(confirmModal).toHaveBeenCalledTimes(1);
        await (confirmModal as jest.Mock).mock.calls[0][0].onOk();
        expect(deleteDzo).toBeCalledWith(dzoId);

        expect(customNotifications.success).toBeCalledTimes(1);
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
