import React from 'react';
import { Form } from 'antd';
import { mount, shallow } from 'enzyme';
import { MemoryRouter } from 'react-router';
import {
    BACKEND_ERROR_ALREADY_EXIST_ENDING,
    FORM_MODES,
} from '../ClientAppFormConstants';
import { sleep } from '../../../../setupTests';
import { act } from 'react-dom/test-utils';
import ClientAppProperties from './ClientAppProperties';

import { businessRolesTestResponse, consentsTestData } from '../../../../../__tests__/constants';
import * as clientAppService from '../../../../api/services/clientAppService';
import * as settingsService from '../../../../api/services/settingsService';
import * as sessionService from '../../../../api/services/sessionService';
import * as clientAppPropertiesUtils from '../utils';

clientAppPropertiesUtils.showNotify = jest.fn();
clientAppService.addClientApp = jest.fn();
clientAppService.updateClientApp = jest.fn();
settingsService.addSettings = jest.fn();
clientAppService.updateBusinessRolesClientApp = jest.fn();


describe('<ClientAppProperties /> test', () => {
    const props = {
        type: FORM_MODES.EDIT,
        matchPath: 'matchPath',
        propertiesSettings: {
            current: {
                token_lifetime: '10',
                inactivity_time: '10',
                tmp_block_time: '10',
                max_password_attempts: '10',
                max_presents_number: '10',
                name: 'name',
                code: 'code',
                installation_url: '124',
                login_types: ['PASSWORD', 'SBER_REGISTRY'],
                mechanics: ['PRESENTS'],
                privacyPolicy: 'privacyPolicy',
                ym_token: '558648281231',
                usage_url: '124',
                displayName: 'displayName',
                businessRoleIds: [],
                isDeleted: false,
                consentId: 1,
            },
        },
        updateSettings: jest.fn(),
        businessRoles: {
            current: businessRolesTestResponse.list,
        },
        consents: {
            current: consentsTestData.list,
        },
    };

    it('should match snapshot ', () => {
        const ClientAppPropertiesComponent = shallow(<ClientAppProperties { ...props } />);

        expect(ClientAppPropertiesComponent.debug()).toMatchSnapshot();
    });

    it('should properly create clientApp', async () => {
        await act(async () => {
            const newProps = { ...props, type: FORM_MODES.NEW };
            const ClientAppPropertiesComponent = mount(
                <MemoryRouter>
                    <ClientAppProperties { ...newProps } />
                </MemoryRouter>
            );

            ClientAppPropertiesComponent.find(Form)
                .props()
                .form.setFieldsValue(props.propertiesSettings.current);
            ClientAppPropertiesComponent.find(Form)
                .props()
                .form.submit();
            await sleep();

            expect(clientAppService.addClientApp).toHaveBeenCalledTimes(1);
            expect(clientAppService.addClientApp).toHaveBeenCalledWith({
                code: props.propertiesSettings.current.code,
                displayName: props.propertiesSettings.current.displayName,
                isDeleted: props.propertiesSettings.current.isDeleted,
                name: props.propertiesSettings.current.name,
                businessRoleIds: props.propertiesSettings.current.businessRoleIds,
                consentId: props.propertiesSettings.current.consentId,
            });
        });
    });

    it('should properly edit clientApp', async () => {
        await act(async () => {
            const newProps = {
                ...props,
                type: FORM_MODES.EDIT,
                propertiesSettings: {
                    current: {
                        ...props.propertiesSettings.current,
                        privacyPolicy: undefined,
                    },
                },
            };
            const ClientAppPropertiesComponent = mount(
                <MemoryRouter>
                    <ClientAppProperties { ...newProps } />
                </MemoryRouter>
            );

            clientAppPropertiesUtils.createOrUpdateKey = jest.fn();
            sessionService.getAppCode = jest.fn(() => 'appCode');

            await sleep();
            ClientAppPropertiesComponent.find(Form)
                .props()
                .form.setFieldsValue({
                    privacyPolicy: 'test',
                    token_lifetime: '33',
                });
            ClientAppPropertiesComponent.find(Form)
                .props()
                .form.submit();
            await sleep();

            expect(sessionService.getAppCode).toBeCalledTimes(1);

            expect(props.updateSettings).toBeCalledTimes(1);
            expect(props.updateSettings.mock.calls[0][0]).toHaveProperty('code', newProps.propertiesSettings.current.code);
            expect(props.updateSettings.mock.calls[0][0]).toHaveProperty('displayName', newProps.propertiesSettings.current.displayName);
            expect(props.updateSettings.mock.calls[0][0]).toHaveProperty('token_lifetime', '33');

            expect(clientAppPropertiesUtils.createOrUpdateKey).toBeCalledTimes(1);
        });
    });

    it('should properly handle errors', async () => {
        const consoleErrSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        await act(async () => {
            const ClientAppPropertiesComponent = mount(
                <MemoryRouter>
                    <ClientAppProperties { ...props } />
                </MemoryRouter>
            );

            clientAppPropertiesUtils.createOrUpdateKey = jest.fn();
            clientAppPropertiesUtils.createOrUpdateKey.mockRejectedValue({
                message: BACKEND_ERROR_ALREADY_EXIST_ENDING,
            });

            await sleep();
            ClientAppPropertiesComponent.find(Form)
                .props()
                .form.setFieldsValue({
                    privacyPolicy: 'test',
                    token_lifetime: '33',
                });
            await ClientAppPropertiesComponent.find(Form)
                .props()
                .form.submit();
            await sleep();

            expect(clientAppPropertiesUtils.showNotify).toBeCalledTimes(1);
            expect(clientAppPropertiesUtils.showNotify).toBeCalledWith(
                <span>Клиентское приложение с кодом <b>code</b> уже существует</span>,
                true
            );
            expect(consoleErrSpy).toBeCalledTimes(1);
        });
    });
});
