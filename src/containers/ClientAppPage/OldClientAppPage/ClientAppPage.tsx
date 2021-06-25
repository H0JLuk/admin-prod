import React, { Component, Fragment } from 'react';
import { match, withRouter } from 'react-router-dom';
import {
    addClientApp,
    copyClientApp,
    getClientAppList,
    updateClientApp,
} from '@apiServices/clientAppService';
import { addSettings, getSettingsList, getStaticUrl } from '@apiServices/settingsService';
import { createOrUpdateKey, IChangedParam } from '../ClientAppForm/utils';
import { goApp } from '@utils/appNavigation';
import styles from './ClientAppPage.module.css';
import CustomModal from '@components/CustomModal/CustomModal';
import ClientAppItem from '@components/ClientAppItem/ClientAppItem';
import { Errors, getErrorText } from '@constants/errors';
import ButtonLabels from '@components/Button/ButtonLables';
import Form from '@components/Form';
import { populateFormWithData } from '@components/Form/formHelper';
import { CLIENT_APP_ADD_FORM, CLIENT_APP_EDIT_FORM, CLIENT_APP_PROPERTIES_EDIT_FORM } from '@components/Form/forms';
import { ROUTE } from '@constants/route';
import Button from '@components/Button/Button';
import { getRole, saveAppCode } from '@apiServices/sessionService';
import { logout } from '@apiServices/authService';
import cross from '@imgs/cross.svg';
import { Switch, Typography } from 'antd';
import { APP_MECHANIC, APP_MECHANIC_OPTIONS, MECHANICS_ERROR } from '@constants/clientAppsConstants';
import { SETTINGS_TYPES } from '../ClientAppForm/ClientAppFormConstants';
import { ClientAppDto, SaveClientApp } from '@types';
import { History, Location } from 'history';

import { ReactComponent as LoadingSpinner } from '@imgs/loading-spinner.svg';

const CLIENT_APP_LIST_TITLE = 'Клиентские приложения';
const LOADING_LIST_LABEL = 'Загрузка';
const CLIENT_APPS_GET_ERROR = 'Ошибка получения клиентских приложений!';
const ENTER_CLIENT_APP_CODE_REQUEST = 'Пожалуйста, введите код клиентского приложения';
const ENTER_CLIENT_APP_NAME_REQUEST = 'Пожалуйста, введите имя клиентского приложения';
const ENTER_CLIENT_APP_DISPLAY_NAME_REQUEST = 'Пожалуйста, введите отображаемое имя клиентского приложения';
const ADD_CLIENT_APP_TITLE = 'Добавить клиентское приложение';
const ADD_CLIENT_APP_ERROR = 'Не удалось добавить клиентское приложение';
const COPY_CLIENT_APP_ERROR = 'Не удалось скопировать клиентское приложение';
const IS_DELETED = 'Is Deleted:';
const MECHANICS = 'Механики';

const initialState = {
    editingClientApp: {
        id: null,
        name: null,
        displayName: null,
        code: null,
        existingCode: null,
        isDeleted: false,
        mechanics: APP_MECHANIC_OPTIONS.reduce((result, { value }) => ({ ...result, [value]: false }), {}),
    },
    clientAppProperties: {
        clientAppId: null,
        clientAppCode: null,
        installation_url: null,
        usage_url: null,
        yamToken: null,
        tokenLifetime: null,
        inactivityTime: null,
        promoShowTime: null,
        privacyPolicy: null,
        tmpBlockTime: null,
        maxPasswordAttempts: null,
        maxPresentsNumber: null,
    },
    staticUrl: getStaticUrl(),
    clientAppList: [],
    showDeleted: false,
    isOpen: false,
    formError: null,
    loading: false,
    mechanicsError: null,
};

enum MechanicsCheckboxes {
    PRESENTS = 'PRESENTS',
    ECOSYSTEM = 'ECOSYSTEM',
    PRESENTATION = 'PRESENTATION',
    BUNDLE = 'BUNDLE',
}

type InitialState = {
    editingClientApp: {
        id: number | null;
        name: string | null;
        displayName: string | null;
        code: string | null;
        existingCode: string | null;
        isDeleted: boolean;
        mechanics: Record<MechanicsCheckboxes, boolean> | Record<string, boolean>;
    };
    clientAppProperties: {
        clientAppId: string | null;
        clientAppCode: string | null;
        installation_url: string | null;
        usage_url: string | null;
        yamToken: string | null;
        tokenLifetime: string | null;
        inactivityTime: string | null;
        promoShowTime: string | null;
        privacyPolicy: string | null;
        tmpBlockTime: string | null;
        maxPasswordAttempts: string | null;
        maxPresentsNumber: string | null;
    } & Record<string, string | null>;
    staticUrl: string | null;
    clientAppList: ClientAppDto[];
    showDeleted: boolean;
    isOpen: boolean;
    formError: Errors | null;
    loading: boolean;
    mechanicsError: string | null;
};

const LoadingStatus = ({ loading }: { loading: boolean; }) => (
    <p className={styles.loadingLabel}>{loading ? LOADING_LIST_LABEL : CLIENT_APPS_GET_ERROR}</p>
);

type ClientAppPageProps = {
    history: History;
    location: Location;
    match: match<any>;
};

class ClientAppPage extends Component<ClientAppPageProps, InitialState> {
    state: InitialState = { ...initialState };

    componentDidMount() {
        getClientAppList()
            .then(response => {
                const { list } = response;
                this.setState({ clientAppList: list });
            })
            .catch(() => this.setState({ clientAppList: [] }));
    }

    clearState = () => {
        const { editingClientApp, clientAppProperties } = initialState;
        this.setState({ editingClientApp, clientAppProperties });
    };

    openModal = () => {
        this.setState({ isOpen: true });
    };

    closeModal = () => {
        this.setState({ isOpen: false }, this.clearState);
    };

    onShowDeleted = () => {
        const { showDeleted } = this.state;
        this.setState({ showDeleted: !showDeleted });
    };

    handleEditProperties = async (clientAppCode: string) => {
        this.setState({ loading: true }, this.openModal);
        const { settingDtoList } = await getSettingsList(clientAppCode);
        const { value = '[]' } = settingDtoList.find(({ key }) => key === 'mechanics') || {};
        const settings = settingDtoList.reduce((result, elem) => ({ ...result, [elem.key]: elem.value }), {} as InitialState['clientAppProperties']);

        const url = getStaticUrl() || '';
        const installation_url = settings.installation_url && settings.installation_url.replace(url, '');
        const usage_url = settings.usage_url && settings.usage_url.replace(url, '');

        this.setState({
            clientAppProperties: { ...settings, installation_url, usage_url, clientAppCode },
            loading: false,
            editingClientApp: {
                ...this.state.editingClientApp,
                mechanics: {
                    PRESENTS: value.includes(APP_MECHANIC.PRESENTS),
                    ECOSYSTEM: value.includes(APP_MECHANIC.ECOSYSTEM),
                    PRESENTATION: value.includes(APP_MECHANIC.PRESENTATION),
                    BUNDLE: value.includes(APP_MECHANIC.BUNDLE),
                },
            },
        });
    };

    handleAdministrate = (code: string) => {
        const role = getRole();
        const { history } = this.props;
        saveAppCode(code);
        goApp(history, role, true);
    };

    handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        this.setState({
            editingClientApp: { ...this.state.editingClientApp, isDeleted: value as boolean }
        });
    };

    changeMechanicHandler = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = target;

        if ([APP_MECHANIC.PRESENTS, APP_MECHANIC.ECOSYSTEM].includes(name as APP_MECHANIC) && checked) {
            this.setState({ mechanicsError: null });
        }

        this.setState({
            editingClientApp: {
                ...this.state.editingClientApp,
                mechanics: {
                    ...this.state.editingClientApp.mechanics,
                    [name]: checked,
                },
            }
        });
    };

    doLogout = () => {
        logout().then(() => {
            this.props.history.push(ROUTE.LOGIN);
        });
    };

    renderModalForm = () => {
        const { formError, editingClientApp, clientAppProperties, mechanicsError } = this.state;
        const { mechanics } = editingClientApp;
        let formData, onSubmit, isDeletedCheckbox, isMechanics;
        if (editingClientApp.id !== null) {
            isDeletedCheckbox = true;
            formData = populateFormWithData(CLIENT_APP_EDIT_FORM, {
                name: editingClientApp.name,
                displayName: editingClientApp.displayName,
                code: editingClientApp.code,
            });
            onSubmit = this.addOrUpdate;
        } else if (clientAppProperties.clientAppId !== null) {
            isDeletedCheckbox = false;
            isMechanics = true;
            formData = populateFormWithData(CLIENT_APP_PROPERTIES_EDIT_FORM, { ...clientAppProperties });
            onSubmit = this.updateProperties;
        } else {
            isDeletedCheckbox = true;
            isMechanics = true;
            formData = CLIENT_APP_ADD_FORM;
            onSubmit = this.addOrUpdate;
        }
        return (
            <div className={styles.modalForm}>
                <img src={cross}
                    onClick={this.closeModal}
                    className={styles.crossSvg}
                    alt={ButtonLabels.CLOSE}
                />
                <Form
                    data={formData}
                    buttonText={ButtonLabels.SAVE}
                    onSubmit={onSubmit}
                    formClassName={styles.clientAppForm}
                    fieldClassName={styles.clientAppForm__field}
                    activeLabelClassName={styles.clientAppForm__field__activeLabel}
                    buttonClassName={styles.clientAppForm__button}
                    errorText={getErrorText(formError)}
                    formError={!!formError}
                    errorClassName={styles.error}
                />
                {isDeletedCheckbox ?
                    <form className={styles.clientAppForm}>
                        <label className={styles.clientAppForm__field}>
                            {IS_DELETED}
                        </label>
                        <input
                            name="Deleted"
                            type="checkbox"
                            checked={editingClientApp.isDeleted}
                            onChange={this.handleInputChange}
                        />
                    </form> : null
                }
                {isMechanics &&
            (<div className={styles.clientAppForm}>
                <h3 className={styles.mechanics_title} >{MECHANICS}</h3>
                {APP_MECHANIC_OPTIONS.map(({ label, value: name }) => (
                    <div key={name}>
                        <label className={styles.clientAppForm__field}>{label}</label>
                        <input
                            name={name}
                            type="checkbox"
                            checked={mechanics[name as MechanicsCheckboxes]}
                            onChange={this.changeMechanicHandler}
                        />
                    </div>
                ))}
                {mechanicsError && <span className={styles.error}>{mechanicsError}</span>}
            </div>)}
            </div>
        );
    };

    reloadClientApps = (clientAppDto: SaveClientApp) => {
        const { clientAppList, editingClientApp: { id } } = this.state;
        const newClientAppList = clientAppList.slice();
        newClientAppList.forEach(app => {
            if (app.id === id) {
                app.name = clientAppDto.name;
                app.displayName = clientAppDto.displayName;
                app.code = clientAppDto.code;
                app.isDeleted = clientAppDto.isDeleted;
            }
        });
        this.setState({ clientAppList: newClientAppList }, this.closeModal);
    };

    async pushToClientAppList(id: number, clientAppDto: SaveClientApp) {
        const newClientApp = {
            ...clientAppDto,
            id: id
        };
        const clientAppList = [...this.state.clientAppList, newClientApp as ClientAppDto];
        this.setState({ clientAppList }, this.closeModal);
    }

    addOrUpdate = async (data: SaveClientApp | Record<string, string>) => {
        const { PRESENTS, ECOSYSTEM, BUNDLE } = this.state.editingClientApp.mechanics;
        if (!data.code) {
            alert(ENTER_CLIENT_APP_CODE_REQUEST);
            return;
        }
        if (!data.name) {
            alert(ENTER_CLIENT_APP_NAME_REQUEST);
            return;
        }
        if (!data.displayName) {
            alert(ENTER_CLIENT_APP_DISPLAY_NAME_REQUEST);
            return;
        }
        if (!(PRESENTS || ECOSYSTEM || BUNDLE) && !data.existingCode) {
            this.setState({ mechanicsError: MECHANICS_ERROR });
            return;
        }
        const clientAppDto: SaveClientApp = {
            code: data.code,
            name: data.name,
            displayName: data.displayName,
            existingCode: data.existingCode,
            isDeleted: this.state.editingClientApp.isDeleted,
            businessRoleIds: [],
        };
        if (this.state.editingClientApp.id !== null) {
            try {
                await updateClientApp(this.state.editingClientApp.id, clientAppDto);
                await this.reloadClientApps(clientAppDto);
            } catch (e) {
                console.error(e.message);
            }
        } else if (!clientAppDto.existingCode) {
            try {
                const response = await addClientApp(clientAppDto);
                const mechanics = {
                    clientAppCode: clientAppDto.code,
                    value: this.getMechanicString(),
                    key: 'mechanics',
                };
                JSON.parse(mechanics.value).length && await addSettings([mechanics]);
                await this.pushToClientAppList(response.id, clientAppDto);
            } catch (e) {
                console.error(e.message);
                alert(ADD_CLIENT_APP_ERROR);
            }
        } else {
            try {
                const response = await copyClientApp(clientAppDto);
                await this.pushToClientAppList(response.id, clientAppDto);
            } catch (e) {
                console.error(e.message);
                alert(COPY_CLIENT_APP_ERROR);
            }
        }
    };

    getMechanicString = () => {
        const stateMechanics = this.state.editingClientApp.mechanics || {};
        const mechanics = Object.keys(stateMechanics).filter(key => stateMechanics[key as MechanicsCheckboxes]);
        return JSON.stringify(mechanics);
    };

    updateProperties = async (dataFromForm: Record<string, string>) => {
        const { PRESENTS, ECOSYSTEM, BUNDLE } = this.state.editingClientApp.mechanics;

        if (!(PRESENTS || ECOSYSTEM || BUNDLE)) {
            this.setState({ mechanicsError: MECHANICS_ERROR });
            return;
        }
        this.setState({ loading: true });
        const {
            clientAppProperties,
            clientAppProperties: { clientAppCode },
        } = this.state;

        dataFromForm.mechanics = this.getMechanicString();

        const changedParams = Object.keys(dataFromForm).reduce<IChangedParam[]>((result, key) => {
            const valueFromServer = clientAppProperties[key];
            const valueInForm = dataFromForm[key];

            if (valueFromServer === undefined && valueInForm) {
                return [...result, { clientAppCode: clientAppCode!, key, value: valueInForm, type: SETTINGS_TYPES.CREATE }];
            }

            if ((!valueFromServer && valueInForm) || (valueFromServer && valueInForm !== valueFromServer)) {
                return [...result, { clientAppCode: clientAppCode!, key, value: valueInForm, type: SETTINGS_TYPES.EDIT }];
            }
            return result;
        }, []);

        try {
            await createOrUpdateKey(changedParams);
        } catch (e) {
            console.error(e.message);
            alert(e.message);
        } finally {
            this.setState({ loading: false }, this.closeModal);
        }
    };

    renderClientAppList = () => {
        const { clientAppList, showDeleted } = this.state;
        const isSuccess = Array.isArray(clientAppList);
        return (
            <Fragment>
                <div>
                    <Typography.Text>Показать удаленные </Typography.Text>
                    <Switch checked={showDeleted} onChange={this.onShowDeleted} />
                </div>
                {
                    (isSuccess && clientAppList.length) ?
                        clientAppList.map((app, i) =>
                            showDeleted ? <ClientAppItem
                                key={`clientAppItem-${i}`}
                                handleEditProperties={this.handleEditProperties}
                                handleAdministrate={this.handleAdministrate}
                                {...app}
                            /> : !app.isDeleted && <ClientAppItem
                                key={`clientAppItem-${i}`}
                                handleEditProperties={this.handleEditProperties}
                                handleAdministrate={this.handleAdministrate}
                                {...app}
                            />) : <LoadingStatus loading />
                }
            </Fragment>
        );
    };

    renderModifyModal = () => (
        <CustomModal
            isOpen={this.state.isOpen}
            onRequestClose={this.closeModal}>
            {this.state.loading ? <LoadingSpinner /> : this.renderModalForm()}
        </CustomModal>
    );

    render() {
        return (
            <div className={styles.wrapper}>
                <div className={styles.clientAppPageWrapper}>
                    {this.renderModifyModal()}
                    <div className={styles.headerSection}>
                        <h3>{CLIENT_APP_LIST_TITLE}</h3>
                        <div>
                            <Button
                                label={ADD_CLIENT_APP_TITLE}
                                onClick={this.openModal}
                                font="roboto"
                                type="green"
                            />
                        </div>
                        <div className={styles.logout} onClick={this.doLogout}>{ButtonLabels.LOGOUT}</div>
                    </div>
                    <div className={styles.clientAppList}>
                        {this.renderClientAppList()}
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(ClientAppPage);
