import React from 'react';
import { generatePath } from 'react-router-dom';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import UserForm, { LOGIN_FIELD } from './UserForm';
import { getUserAppsCheckboxes } from './UserFormHelper';
import {
    getCurrUserInteractionsForOtherUser,
    getCommonPermissionsByRole,
} from '../../../constants/permissions';
import { getUser, unblockUser, resetUser, removeUser, saveUser, addUser } from '../../../api/services/usersService';
import { getActiveClientApps } from '../../../api/services/clientAppService';
import { sleep } from '../../../setupTests';
import { BUTTON, INFO_USER_BUTTONS } from './UserFormButtonGroup/UserFormButtonGroup';
import { customNotifications } from '../../../utils/notifications';
import { userTestData, clientAppListTestResponse, searchSalePointTestData } from '../../../../__tests__/constants';
import { getResultsByTextAndType, createSearchDataAndPassLocation } from '../../../components/Form/AutocompleteLocationAndSalePoint/AutocompleteHelper';
import { confirmModal } from '../../../utils/utils';
import { getSalePointByText } from '../../../api/services/promoCampaignService';

const mockSalePointSelect = {
    ...searchSalePointTestData[0],
    type: {
        ...searchSalePointTestData[0].type,
        kind: 'INTERNAL',
    },
};
jest.mock(
    '../../../components/Form/AutocompleteLocationAndSalePoint/AutocompleteLocationAndSalePoint',
    () => ({ onLocationChange, onSalePointChange, error, locationId }) => (
        <>
            { error.salePoint }
            <span data-testid="locationId">{ locationId }</span>
            <button data-testid="location" onClick={ () => onLocationChange({ id: 2, name: 'testName' }) }>location</button>
            <button data-testid="salePoint" onClick={ () => onSalePointChange(mockSalePointSelect) }>salePoint</button>
        </>
    )
);

jest.mock('../../../components/Checkboxes/Checkboxes', () => ({ checkboxesData, onChangeAll, onChange }) => (
    <div data-testid="checkboxes">
        <span data-testid="checkboxesData">{ JSON.stringify(checkboxesData) }</span>
        <button data-testid="changeAllCheckboxes" onClick={ (e) => onChangeAll(e.target.testValue) }>changeAllCheckboxes</button>
        <button data-testid="changeOneCheckbox" onClick={ (e) => onChange(e.target.testValue, 'digital-village') }>changeOneCheckbox</button>
    </div>
));

jest.mock('../../../api/services/promoCampaignService', () => ({
    getSalePointByText: jest.fn(),
}));

jest.mock('../../../components/Form/AutocompleteLocationAndSalePoint/AutocompleteHelper', () => ({
    getResultsByTextAndType: jest.fn(),
    createSearchDataAndPassLocation: jest.fn(),
}));

jest.mock('../../../api/services/clientAppService', () => ({
    getActiveClientApps: jest.fn(),
}));

jest.mock('../../../utils/utils', () => ({
    ...jest.requireActual('../../../utils/utils'),
    confirmModal: jest.fn(),
}));

jest.mock('../../../constants/permissions', () => {
    const originalModule = jest.requireActual('../../../constants/permissions');

    return {
        __esModule: true,
        ...originalModule,
        getCurrUserInteractionsForOtherUser: jest.fn(),
        getCommonPermissionsByRole: jest.fn(),
    };
});

jest.mock('../../../api/services/usersService', () => ({
    getUser: jest.fn(),
    unblockUser: jest.fn(),
    resetUser: jest.fn(),
    removeUser: jest.fn(),
    saveUser: jest.fn(),
    addUser: jest.fn(),
}));

jest.mock('./UserFormHelper', () => {
    const originalModule = jest.requireActual('./UserFormHelper');

    return {
        __esModule: true,
        ...originalModule,
        getUserAppsCheckboxes: jest.fn(),
    };
});

const mockHistoryPush = jest.fn();

let mockErrorParams = false;
jest.mock('react-router-dom', () => ({
    useParams: () => !mockErrorParams ? ({ userId: 1 }) : ({ userId: 'testId' }),
    useHistory: () => ({
        push: mockHistoryPush,
        replace: jest.fn(),
    }),
    generatePath: jest.fn(),
}));

const TEST_PASSWORD = 'TEST_PASSWORD_123';

const SearchData = {
    results: [
        {
            id: 886,
            name: '055_8626_1232',
            description: 'Доп.офис №8626/1232',
            startDate: '2020-01-11',
            endDate: null,
            deleted: false,
            type: {
                id: 3,
                name: 'ВСП',
                description: 'Внутреннее структурное подразделение',
                startDate: '2020-01-01',
                endDate: null,
                priority: 8,
                deleted: false,
            },
            parentName: '8626',
        },
    ],
    value: 'Московская область, Москва',
};

const LocationData = searchSalePointTestData[0].location;

const TEST_PASSWORDS = {
    newPassword: TEST_PASSWORD,
    generatedPassword: TEST_PASSWORD,
};

const TEST_USER_DATA = {
    FALSE_LOGIN: '-=-',
    LOGIN: '123456',
    SALE_POINT: '1232',
};

const CASE_TYPES = {
    NEW: 'new',
    EDIT: 'edit',
    INFO: 'info',
    NONE: '',
};

const TEST_PROPS = {
    matchPath: '/TEST_PATH',
};

const TEST_INTERACTIONS = {
    canSelectUserInTable: true,
    deleteUser: true,
    editUser: true,
    resetUserPassword: true,
    unlockUser: true,
};

const TEST_COMMON_PERMISSIONS = {
    canSetUserRole: true,
    canSetUserPartner: true,
};

const TEST_INTERACTIONS_FALSE = {
    canSelectUserInTable: false,
    deleteUser: false,
    editUser: false,
    resetUserPassword: false,
    unlockUser: false,
};


const TEST_CHECKBOX = {
    'digital-village': {
        checked: false,
        disabled: false,
        id: 9,
        label: 'Партнеры',
    },
};

describe('<UserForm /> test', () => {
    const Component = (type = CASE_TYPES.INFO) => render(
        <UserForm { ...TEST_PROPS } type={ type } />
    );

    beforeEach(() => {
        getActiveClientApps.mockResolvedValue(clientAppListTestResponse.list);
        getUser.mockResolvedValue(userTestData);
        getCurrUserInteractionsForOtherUser.mockReturnValue(TEST_INTERACTIONS);
        getCommonPermissionsByRole.mockReturnValue(TEST_COMMON_PERMISSIONS);
        getUserAppsCheckboxes.mockReturnValue(TEST_CHECKBOX);
        getSalePointByText.mockReturnValue({ ...searchSalePointTestData[0], id: userTestData.salePointId });
        cleanup();
        document.body.innerHTML = '';
    });

    it('should be mount snap with useEffect', async () => {
        const ComponentInfo = Component();
        await sleep();
        expect(getActiveClientApps).toBeCalledTimes(1);
        expect(getUser).toBeCalledTimes(1);
        expect(getCurrUserInteractionsForOtherUser).toBeCalledTimes(1);
        expect(getUserAppsCheckboxes).toBeCalledTimes(1);
        await sleep();
        expect(ComponentInfo).toMatchSnapshot();
    });

    it('should find buttons and call reset password function', async () => {
        resetUser.mockResolvedValue(TEST_PASSWORDS);
        await act(async () => {
            Component();
        });

        expect(screen.getByText(INFO_USER_BUTTONS.RESET_PASSWORD)).toBeTruthy();
        expect(screen.getByText(INFO_USER_BUTTONS.EDIT)).toBeTruthy();
        expect(screen.getByText(BUTTON.DELETE_TEXT)).toBeTruthy();

        await act(async () => {
            fireEvent.click(screen.getByText(/Сбросить/i));
        });

        expect(resetUser).toBeCalledTimes(1);
        expect(screen.getByText(/TEST_PASSWORD_123/i)).toBeTruthy();
    });

    it('should find buttons and call reset password function with catch', async () => {
        resetUser.mockRejectedValue(new Error('Error'));
        customNotifications.error = jest.fn();

        await act(async () => {
            Component();
        });

        expect(screen.getByText(INFO_USER_BUTTONS.RESET_PASSWORD)).toBeTruthy();
        expect(screen.getByText(INFO_USER_BUTTONS.EDIT)).toBeTruthy();
        expect(screen.getByText(BUTTON.DELETE_TEXT)).toBeTruthy();

        await act(async () => {
            fireEvent.click(screen.getByText(/Сбросить/i));
        });

        expect(resetUser).toBeCalledTimes(1);
        expect(customNotifications.error).toBeCalledTimes(1);
    });

    it('should call `generatePath` function', async () => {
        Component();
        await sleep();
        expect(screen.getByText(INFO_USER_BUTTONS.EDIT)).toBeTruthy();
        fireEvent.click(screen.getByText(INFO_USER_BUTTONS.EDIT));
        expect(generatePath).toBeCalledTimes(1);
    });

    it('should call confirmModal and delete function', async () => {
        Component();
        await sleep();
        expect(screen.getByText(BUTTON.DELETE_TEXT)).toBeTruthy();
        fireEvent.click(screen.getByText(BUTTON.DELETE_TEXT));
        await sleep();
        expect(confirmModal).toBeCalledTimes(1);

        await act(async () => {
            await confirmModal.mock.calls[0][0].onOk();
        });
        expect(removeUser).toBeCalledTimes(1);
    });

    it('should call delete function with catch', async () => {
        removeUser.mockRejectedValue(new Error('Error'));
        customNotifications.error = jest.fn();
        Component();
        await sleep();
        expect(screen.getByText(BUTTON.DELETE_TEXT)).toBeTruthy();
        fireEvent.click(screen.getByText(BUTTON.DELETE_TEXT));
        expect(confirmModal).toBeCalledTimes(1);

        await act(async () => {
            await confirmModal.mock.calls[0][0].onOk();
        });
        await sleep();
        expect(removeUser).toBeCalledTimes(1);
        expect(customNotifications.error).toBeCalledTimes(1);
    });

    it('should call catch in onDelete function', async () => {
        getUser.mockResolvedValue({ ...userTestData, id: null });
        Component();
        await sleep();
        expect(screen.getByText(BUTTON.DELETE_TEXT)).toBeTruthy();
        fireEvent.click(screen.getByText(BUTTON.DELETE_TEXT));
        expect(confirmModal).toBeCalledTimes(1);

        await act(async () => {
            await confirmModal.mock.calls[0][0].onOk();
        });
        expect(removeUser).toBeCalledTimes(1);
    });

    it('should call submit function', async () => {
        getSalePointByText.mockReturnValue({
            ...searchSalePointTestData[0],
            id: userTestData.salePointId,
            type: {
                ...searchSalePointTestData[0].type,
                kind: 'INTERNAL',
            },
        });
        saveUser.mockResolvedValue(TEST_PASSWORDS);
        Component(CASE_TYPES.EDIT);
        await sleep();

        expect(screen.getByText(BUTTON.SAVE_EDIT_USER_TEXT)).toBeTruthy();
        fireEvent.click(screen.getByText(BUTTON.SAVE_EDIT_USER_TEXT));
        await sleep();

        expect(saveUser).toBeCalledTimes(1);
        expect(generatePath).toBeCalledTimes(1);
    });

    it('should call submit function with catch', async () => {
        getSalePointByText.mockReturnValue({
            ...searchSalePointTestData[0],
            id: userTestData.salePointId,
            type: {
                ...searchSalePointTestData[0].type,
                kind: 'INTERNAL',
            },
        });
        saveUser.mockRejectedValue(new Error('Error'));
        Component(CASE_TYPES.EDIT);
        await sleep();

        expect(screen.getByText(BUTTON.SAVE_EDIT_USER_TEXT)).toBeTruthy();
        fireEvent.click(screen.getByText(BUTTON.SAVE_EDIT_USER_TEXT));
        await sleep();
        expect(saveUser).toBeCalledTimes(1);
        expect(generatePath).toBeCalledTimes(0);
    });

    it('should call check validate if data submit', async () => {
        await act(async () => {
            Component(CASE_TYPES.NEW);
        });

        await act(async () => {
            fireEvent.click(screen.getByText(BUTTON.ADD_USER_TEXT));
        });
        expect(screen.getByText(/Укажите/i)).toBeTruthy();

        await act(async () => {
            fireEvent.change(screen.getByPlaceholderText(LOGIN_FIELD.placeholder), { target: { value: TEST_USER_DATA.FALSE_LOGIN } });
        });
        await act(async () => {
            fireEvent.click(screen.getByText(BUTTON.ADD_USER_TEXT));
        });
        expect(screen.getByText(/латинские/i)).toBeTruthy();

        await act(async () => {
            fireEvent.change(screen.getByPlaceholderText(LOGIN_FIELD.placeholder), { target: { value: TEST_USER_DATA.LOGIN } });
        });
        await act(async () => {
            fireEvent.click(screen.getByText(BUTTON.ADD_USER_TEXT));
        });
        expect(screen.getByText(/продажи/i)).toBeTruthy();
    });

    it('should call submit function with new User', async () => {
        getResultsByTextAndType.mockResolvedValue(searchSalePointTestData);
        addUser.mockResolvedValue({ generatedPassword: TEST_PASSWORD });
        createSearchDataAndPassLocation.mockReturnValue({ location: LocationData, searchLocation: SearchData });
        customNotifications.success = jest.fn();

        await act(async () => {
            Component(CASE_TYPES.NEW);
        });

        expect(screen.getByTestId('locationId').innerHTML).toBe('');

        await act(async () => {
            fireEvent.change(screen.getByPlaceholderText(LOGIN_FIELD.placeholder), { target: { value: TEST_USER_DATA.LOGIN } });
        });
        await act(async () => {
            fireEvent.click(screen.getByTestId('salePoint'));
        });
        await act(async () => {
            fireEvent.click(screen.getByTestId('location'));
        });

        expect(screen.getByTestId('locationId').innerHTML).toBe('2');

        fireEvent.click(screen.getByText(BUTTON.ADD_USER_TEXT));
        expect(addUser).toBeCalledTimes(1);
        await sleep();
        expect(customNotifications.success).toBeCalledTimes(1);
        expect(mockHistoryPush).toBeCalledTimes(1);
    });

    it('should call checkboxes handlers', async () => {
        Component(CASE_TYPES.EDIT);
        await sleep();
        const checkboxesData = JSON.parse(screen.getByTestId('checkboxesData').innerHTML);
        expect(checkboxesData['digital-village'].checked).toBe(false);

        fireEvent.click(
            screen.getByTestId('changeAllCheckboxes'),
            { target: { testValue: true } }
        );
        await sleep();
        expect(
            JSON.parse(
                screen.getByTestId('checkboxesData').innerHTML
            )['digital-village'].checked
        ).toBe(true);

        fireEvent.click(
            screen.getByTestId('changeOneCheckbox'),
            { target: { testValue: false } }
        );
        await sleep();
        expect(
            JSON.parse(
                screen.getByTestId('checkboxesData').innerHTML
            )['digital-village'].checked
        ).toBe(false);
    });

    it('should call cancel function', async () => {
        Component(CASE_TYPES.EDIT);
        await sleep();
        expect(screen.getByText(BUTTON.CANCEL_TEXT)).toBeTruthy();
        fireEvent.click(screen.getByText(BUTTON.CANCEL_TEXT));
        expect(generatePath).toBeCalledTimes(1);
    });

    it('should call cancel function with redirect', async () => {
        Component(CASE_TYPES.NEW);
        await sleep();
        expect(screen.getByText(BUTTON.CANCEL_TEXT)).toBeTruthy();
        fireEvent.click(screen.getByText(BUTTON.CANCEL_TEXT));
        expect(mockHistoryPush).toBeCalledTimes(1);
    });

    it('should call history replace in get user data', async () => {
        getCurrUserInteractionsForOtherUser.mockReturnValue(TEST_INTERACTIONS_FALSE);
        Component(CASE_TYPES.EDIT);
        await sleep();
        expect(generatePath).toBeCalledTimes(1);
    });

    it('should call reset function with blocked user', async () => {
        getUser.mockResolvedValue({ ...userTestData, tmpBlocked: true });
        await act(async () => {
            Component();
        });

        await act(async () => {
            fireEvent.click(screen.getByText(INFO_USER_BUTTONS.UNBLOCK));
        });

        expect(unblockUser).toBeCalledTimes(1);
    });

    it('should call catch in get user data', async () => {
        jest.spyOn(console, 'warn').mockImplementation(() => '');
        getUser.mockRejectedValue(new Error('Error'));
        Component();
        await sleep();
        expect(mockHistoryPush).toBeCalledTimes(1);
        expect(mockHistoryPush).toBeCalledWith(TEST_PROPS.matchPath);
        expect(console.warn).toBeCalled();
    });

    it('should redirect on first useEffect if userId is wrong', async () => {
        mockErrorParams = true;
        Component();
        await sleep();

        expect(mockHistoryPush).toBeCalledTimes(1);
        expect(mockHistoryPush).toBeCalledWith(TEST_PROPS.matchPath);
        mockErrorParams = false;
    });
});
