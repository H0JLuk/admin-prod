import React from 'react';
import { fireEvent, render, act } from '@testing-library/react';
import { shallow } from 'enzyme';
import { message } from 'antd';
import ClientAppPageContainer from './ClientAppContainer';
import { EDIT_MODE } from './ClientAppFormConstants';
import {
    businessRolesTestResponse,
    settingDtoListTestData,
    clientAppTestData,
    doPropertiesSettingsTestData,
    propertiesSettingsTestData,
    settingsMapTestData,
    testBusinessRole,
} from '../../../../__tests__/constants';
import {
    getSettingsList,
    getBusinessRolesByClientApp,
    getBusinessRoles,
    getAllSettings,
} from '../../../api/services/settingsService';
import { getClientAppInfo } from '../../../api/services/clientAppService';
import { getAppCode } from '../../../api/services/sessionService';
import { sleep } from '../../../setupTests';
import { doPropertiesSettings } from './ClientAppContainer';
import * as consentsService from '../../../api/services/consentsService';
import { requestsWithMinWait } from '../../../utils/utils';
import ROLES from '@constants/roles';

const CURRENT_APP_CODE_MOCK = 'greenday-presents';

jest.mock('../../../components/Header', () => () => <div>Header</div>);
jest.mock(
    './ClientAppProperties/ClientAppProperties',
    () => ({ updateSettings, propertiesSettings }) => (
        <>
            <div id="ClientAppProperties">ClientAppProperties</div>
            <span data-testid="propertiesSettings">{ JSON.stringify(propertiesSettings) }</span>
            <button data-testid="updateSettings-btn" onClick={ () => updateSettings({ test: 2 }) }>updateSettings</button>
        </>
    )
);

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

jest.mock('../../../api/services/sessionService', () => ({
    getAppCode: jest.fn(),
}));

jest.mock('../../../utils/utils', () => ({
    ...jest.requireActual('../../../utils/utils'),
    requestsWithMinWait: jest.fn(),
}));

jest.mock('../../../api/services/settingsService', () => ({
    getSettingsList: jest.fn(),
    getBusinessRoles: jest.fn(),
    getBusinessRolesByClientApp: jest.fn(),
    getAllSettings: jest.fn(),
}));

jest.mock('../../../api/services/clientAppService', () => ({
    getClientAppInfo: jest.fn(),
}));

jest.mock('antd', () => ({
    ...jest.requireActual('antd'),
    message: {
        error: jest.fn(),
    },
}));

const defaultSettingsRes = {
    settingDtoList: [
        { key: 'token_lifetime', value: '1233', userRole: ROLES.REFERAL_LINK },
    ],
};

beforeEach(() => {
    getAppCode.mockImplementation(() => CURRENT_APP_CODE_MOCK);
    getSettingsList.mockResolvedValue(settingDtoListTestData);
    getClientAppInfo.mockResolvedValue(clientAppTestData);
    getBusinessRoles.mockResolvedValue(businessRolesTestResponse);
    getBusinessRolesByClientApp.mockResolvedValue({ list: [testBusinessRole] });
    consentsService.getConsentById = jest.fn();
    getAllSettings.mockResolvedValue(defaultSettingsRes);
    requestsWithMinWait.mockResolvedValue([
        settingDtoListTestData,
        clientAppTestData,
        defaultSettingsRes,
    ]);
});

describe('<ClientAppContainer /> tests', () => {
    const props = {
        type: 'edit',
        matchPath: '/admin/client-apps',
    };

    it('should render component in general', async () => {
        await act(async () => {
            const PROPERTIES = EDIT_MODE.PROPERTIES;
            const { getByText } = render(<ClientAppPageContainer { ...props } />);
            await sleep();

            expect(getByText(PROPERTIES)).toBeInTheDocument();
        });
    });

    it('should match snapshot', () => {
        const wrapper = shallow(<ClientAppPageContainer { ...props } />);

        expect(wrapper.debug()).toMatchSnapshot();
    });

    it('should load spinner', async () => {
        const wrapper = shallow(<ClientAppPageContainer { ...props } />);
        expect(wrapper.find('Memo(Loading)')).toHaveLength(1);
    });

    it('should render ClientAppProperties', async () => {
        const { getByText, getByTestId, rerender } = render(
            <ClientAppPageContainer { ...props } />
        );
        await sleep();

        expect(getByText('ClientAppProperties')).toBeInTheDocument();

        const propertiesSettings = getByTestId('propertiesSettings');
        expect(JSON.stringify({ current: doPropertiesSettingsTestData })).toEqual(propertiesSettings.textContent);

        fireEvent.click(getByTestId('updateSettings-btn'));
        rerender(<ClientAppPageContainer { ...props } />);
        expect('{"current":{"test":2}}').toBe(propertiesSettings.textContent);
    });

    it('should return undefined if isEdit is false', async () => {
        const props = {
            type: 'new',
            matchPath: '/admin/client-apps',
        };

        act(() => {
            render(<ClientAppPageContainer { ...props } />);
        });
        await sleep();
        expect(getClientAppInfo).not.toBeCalled();
    });

    it('should redirect if (appCode && isEdit)', () => {
        getAppCode.mockImplementationOnce(() => undefined);
        render(<ClientAppPageContainer { ...props } />);

        expect(mockHistoryPush).toBeCalledWith(props.matchPath);
    });

    it('should run getSettingsList with currentAppCode', async () => {
        await act(async () => {
            render(<ClientAppPageContainer { ...props } />);
            await sleep();

            expect(getSettingsList).toBeCalledWith(CURRENT_APP_CODE_MOCK);
            expect(getClientAppInfo).toBeCalledWith(CURRENT_APP_CODE_MOCK);
        });
    });

    it('doPropertiesSettings right output', () => {
        const mockTestData = {
            ...propertiesSettingsTestData,
        };
        delete mockTestData.doPropertiesSettingsTestData;
        const doPropertiesSettingsOutput = doPropertiesSettings(settingsMapTestData, clientAppTestData);

        expect(mockTestData).toEqual(doPropertiesSettingsOutput);
    });

    it('should render message.error', async () => {
        await act(async () => {
            requestsWithMinWait.mockRejectedValue(new Error('error'));
            render(<ClientAppPageContainer { ...props } />);
            await sleep();

            expect(message.error).toBeCalled();
        });
    });

    it('doPropertiesSettings right ', async () => {
        await act(async () => {
            render(<ClientAppPageContainer { ...props } />);
            await sleep();
            expect(consentsService.getConsentById).toHaveBeenCalledTimes(1);
        });
    });
});
