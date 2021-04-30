import React from 'react';
import { fireEvent, render, act } from '@testing-library/react';
import { shallow } from 'enzyme';
import { message } from 'antd';
import ClientAppPageContainer from './ClientAppContainer';
import { EDIT_MODE } from './ClientAppFormConstants';
import {
    settingDtoListTestData,
    clientAppTestData,
    doPropertiesSettingsTestData,
    propertiesSettingsTestData,
    settingsMapTestData,
} from '../../../../__tests__/constants';
import { getSettingsList, getStaticUrl } from '../../../api/services/settingsService';
import { getClientAppInfo } from '../../../api/services/clientAppService';
import { getAppCode } from '../../../api/services/sessionService';
import { sleep } from '../../../setupTests';
import { doPropertiesSettings } from './ClientAppContainer';

const CURRENT_APP_CODE_MOCK = 'greenday-presents';
const SPINNER_TEXT_NODE = 'loading-spinner.svg';

jest.mock('../../../components/Header/Header', () => () => <div>Header</div>);
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

jest.mock('../../../api/services/settingsService', () => ({
    getSettingsList: jest.fn(),
    getStaticUrl: jest.fn(),
}));

jest.mock('../../../api/services/clientAppService', () => ({
    getClientAppInfo: jest.fn(),
}));

jest.mock('antd', () => ({
    ...jest.requireActual('antd'),
    message: {
        error: jest.fn(),
    }
}));

beforeEach(() => {
    getAppCode.mockImplementation(() => CURRENT_APP_CODE_MOCK);
    getSettingsList.mockResolvedValue(settingDtoListTestData);
    getClientAppInfo.mockResolvedValue(clientAppTestData);
    getStaticUrl.mockResolvedValue('http://distributor-fs:8081/distributor-fs/file?path=');
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
            await sleep(500);

            expect(getByText(PROPERTIES)).toBeInTheDocument();
        });
    });

    it('should match snapshot', () => {
        const wrapper = shallow(<ClientAppPageContainer { ...props } />);

        expect(wrapper.debug()).toMatchSnapshot();
    });

    it('should load spinner', async () => {
        await act(async () => {
            const { getByText } = render(<ClientAppPageContainer { ...props } />);

            expect(getByText(SPINNER_TEXT_NODE)).toBeInTheDocument();
        });
    });

    it('should render ClientAppProperties', async () => {
        const { getByText, getByTestId, rerender } = render(<ClientAppPageContainer { ...props } />);
        await sleep(500);

        expect(getByText('ClientAppProperties')).toBeInTheDocument();

        const propertiesSettings = getByTestId('propertiesSettings');
        expect(JSON.stringify({ 'current': doPropertiesSettingsTestData })).toEqual(propertiesSettings.textContent);

        fireEvent.click(getByTestId('updateSettings-btn'));
        rerender(<ClientAppPageContainer { ...props } />);
        expect('{"current":{"test":2}}').toBe(propertiesSettings.textContent);
    });

    it('should return undefined if isEdit is false', () => {
        const props = {
            type: 'new',
            matchPath: '/admin/client-apps',
        };

        render(<ClientAppPageContainer { ...props } />);
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
            ...propertiesSettingsTestData
        };
        delete mockTestData.doPropertiesSettingsTestData;
        const doPropertiesSettingsOutput = doPropertiesSettings(settingsMapTestData, clientAppTestData);

        expect(mockTestData).toEqual(doPropertiesSettingsOutput);
    });

    it('should render message.error', async () => {
        await act(async () => {
            getSettingsList.mockRejectedValueOnce(new Error('error'));
            render(<ClientAppPageContainer { ...props } />);
            await sleep();

            expect(message.error).toBeCalled();
        });
    });
});

