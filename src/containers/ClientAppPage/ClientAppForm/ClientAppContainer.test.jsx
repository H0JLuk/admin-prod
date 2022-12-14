import React from 'react';
import { fireEvent, render, act } from '@testing-library/react';
import { shallow } from 'enzyme';
import { message } from 'antd';
import ClientAppContainer, { doPropertiesSettings } from './ClientAppContainer';
import { EDIT_MODE } from './ClientAppFormConstants';
import {
    businessRolesTestResponse,
    settingDtoListTestData,
    clientAppTestData,
    settingsMapTestData,
    testBusinessRole,
    consentsTestData,
} from '../../../../__tests__/constants';
import { getSettingsList, getSettingsByKeys } from '../../../api/services/settingsService';
import { getBusinessRoles, getBusinessRolesByClientApp } from '../../../api/services/businessRoleService';
import { getClientAppInfo } from '../../../api/services/clientAppService';
import { getAppCode } from '../../../api/services/sessionService';
import { sleep } from '../../../setupTests';
import { getConsentsList, getConsentById } from '../../../api/services/consentsService';
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
            <button data-testid="updateSettings-btn" onClick={ () => updateSettings({ ...propertiesSettings.current, test: 2 }) }>updateSettings</button>
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
    getSettingsByKeys: jest.fn(),
}));

jest.mock('../../../api/services/businessRoleService', () => ({
    getBusinessRoles: jest.fn(),
    getBusinessRolesByClientApp: jest.fn(),
}));

jest.mock('../../../api/services/clientAppService', () => ({
    getClientAppInfo: jest.fn(),
}));

jest.mock('../../../api/services/consentsService', () => ({
    getConsentsList: jest.fn(),
    getConsentById: jest.fn(),
}));

jest.mock('antd', () => ({
    ...jest.requireActual('antd'),
    message: {
        error: jest.fn(),
    },
}));


const doPropertiesSettingsTestData = {
    id: 6,
    code: 'greenday-presents',
    name: '?????????????? ???????????????????? ?? ??????????????????',
    displayName: '?????????????? ??????',

    businessRoleIds: [1],
    tmp_block_time: '1800',
    ym_token: '55864828',
    promo_show_time: '10',
    privacy_policy: '64',
    referralTokenLifetime: '1233',
};

const propertiesSettingsTestData = {
    name: '?????????????? ???????????????????? ?? ??????????????????',
    mechanics: [
        'BUNDLE',
    ],
    login_types: [
        'PASSWORD',
        'SBOL_PRO',
    ],
    max_presents_number: '3',
    max_password_attempts: '3',
    home_page_header: '???????? ??????????????????, ?????????? ?????????? ?????? ?????????????? ??????',
    inactivity_time: '152',
    token_lifetime: '18001223',
    notification_types: undefined,
    game_mechanics: undefined,
    tmp_block_time: '1800',
    id: 6,
    code: 'greenday-presents',
    displayName: '?????????????? ??????',
    privacy_policy: '64',
};

const defaultSettingsRes = {
    settingDtoList: [
        { key: 'token_lifetime', value: '1233', userRole: ROLES.REFERAL_LINK },
    ],
};


describe('<ClientAppContainer /> tests', () => {
    const props = {
        type: 'edit',
        matchPath: '/admin/client-apps',
    };

    beforeEach(() => {
        getAppCode.mockImplementation(() => CURRENT_APP_CODE_MOCK);
        getSettingsList.mockResolvedValue(settingDtoListTestData);
        getClientAppInfo.mockResolvedValue(clientAppTestData);
        getBusinessRoles.mockResolvedValue(businessRolesTestResponse);
        getBusinessRolesByClientApp.mockResolvedValue({ list: [testBusinessRole] });
        getConsentsList.mockResolvedValue(consentsTestData);
        getSettingsByKeys.mockResolvedValue(defaultSettingsRes);
        requestsWithMinWait.mockResolvedValue([
            settingDtoListTestData,
            clientAppTestData,
            defaultSettingsRes,
        ]);
    });

    it('should render component in general', async () => {
        await act(async () => {
            const PROPERTIES = EDIT_MODE.PROPERTIES;
            const { container } = render(<ClientAppContainer { ...props } />);
            await sleep();

            const title = container.firstChild.querySelector('.title');
            expect(title).toBeInTheDocument();
            expect(title.innerHTML).toBe(PROPERTIES);
        });
    });

    it('should match snapshot', () => {
        const wrapper = shallow(<ClientAppContainer { ...props } />);

        expect(wrapper.debug()).toMatchSnapshot();
    });

    it('should load spinner', async () => {
        const wrapper = shallow(<ClientAppContainer { ...props } />);
        expect(wrapper.find('Memo(Loading)')).toHaveLength(1);
    });

    it('should render ClientAppProperties', async () => {
        const { getByText, getByTestId, rerender } = render(
            <ClientAppContainer { ...props } />
        );
        await sleep();

        expect(getByText('ClientAppProperties')).toBeInTheDocument();

        const propertiesSettings = getByTestId('propertiesSettings');
        expect(JSON.parse(propertiesSettings.textContent)).toEqual({ current: doPropertiesSettingsTestData });

        fireEvent.click(getByTestId('updateSettings-btn'));
        rerender(<ClientAppContainer { ...props } />);

        expect({
            current: {
                ...doPropertiesSettingsTestData,
                test: 2,
            },
        }).toEqual(JSON.parse(propertiesSettings.textContent));
    });

    it('should return undefined if isEdit is false', async () => {
        const props = {
            type: 'new',
            matchPath: '/admin/client-apps',
        };

        act(() => {
            render(<ClientAppContainer { ...props } />);
        });
        await sleep();
        expect(getClientAppInfo).not.toBeCalled();
    });

    it('should redirect if (appCode && isEdit)', () => {
        getAppCode.mockImplementationOnce(() => undefined);
        render(<ClientAppContainer { ...props } />);

        expect(mockHistoryPush).toBeCalledWith(props.matchPath);
    });

    it('should run getSettingsList with currentAppCode', async () => {
        await act(async () => {
            render(<ClientAppContainer { ...props } />);
            await sleep();

            expect(getSettingsList).toBeCalledWith(CURRENT_APP_CODE_MOCK);
            expect(getClientAppInfo).toBeCalledWith(CURRENT_APP_CODE_MOCK);
        });
    });

    it('doPropertiesSettings right output', () => {
        const mockTestData = {
            ...propertiesSettingsTestData,
        };
        const doPropertiesSettingsOutput = doPropertiesSettings(settingsMapTestData, clientAppTestData);

        expect(mockTestData).toEqual(doPropertiesSettingsOutput);
    });

    it('should render message.error', async () => {
        await act(async () => {
            requestsWithMinWait.mockRejectedValue(new Error('error'));
            render(<ClientAppContainer { ...props } />);
            await sleep();

            expect(message.error).toBeCalled();
        });
    });

    it('doPropertiesSettings right ', async () => {
        await act(async () => {
            render(<ClientAppContainer { ...props } />);
            await sleep();
            expect(getConsentById).toHaveBeenCalledTimes(1);
        });
    });
});
