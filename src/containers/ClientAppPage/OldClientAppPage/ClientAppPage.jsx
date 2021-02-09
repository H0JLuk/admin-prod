import React, { Component, Fragment } from 'react';
import {
    addClientApp,
    copyClientApp,
    getClientAppList,
    updateClientApp,
} from '../../../api/services/clientAppService';
import { addSetting, getSettingsList, getStaticUrl, updateSettingsList } from '../../../api/services/settingsService';
import { goApp } from '../../../utils/appNavigation';
import styles from './ClientAppPage.module.css';
import CustomModal from '../../../components/CustomModal/CustomModal';
import ClientAppItem from '../../../components/ClientAppItem/ClientAppItem';
import { getErrorText } from '../../../constants/errors';
import ButtonLabels from '../../../components/Button/ButtonLables';
import cross from '../../../static/images/cross.svg';
import Form from '../../../components/Form/Form';
import { populateFormWithData } from '../../../components/Form/formHelper';
import { CLIENT_APP_ADD_FORM, CLIENT_APP_EDIT_FORM, CLIENT_APP_PROPERTIES_EDIT_FORM } from '../../../components/Form/forms';
import { withRouter } from 'react-router-dom';
import { getRole, saveAppCode } from '../../../api/services/sessionService';
import { ROUTE } from '../../../constants/route';
import { logout } from '../../../api/services/authService';
import Button from '../../../components/Button/Button';
import { Switch, Typography } from 'antd';
import { APP_MECHANICS, MECHANICS_CHECKBOXES, MECHANICS_ERROR } from '../../../constants/clientAppsConstants';

import { ReactComponent as LoadingSpinner } from '../../../static/images/loading-spinner.svg';

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
        id: null, name: null, displayName: null, code: null, existingCode: null, isDeleted: false,
        mechanics: MECHANICS_CHECKBOXES.reduce((result, { value }) => ({ ...result, [value]: false }), {}),
    },
    clientAppProperties: {
        clientAppId: null, installationUrl: null, yamToken: null, tokenLifetime: null,
        inactivityTime: null, promoShowTime: null, privacyPolicy: null,
        tmpBlockTime: null, maxPasswordAttempts: null, maxPresentsNumber: null,
    },
    staticUrl: getStaticUrl(), clientAppList: [], showDeleted: false, isOpen: false, formError: null,
    loading: false, mechanicsError: null,
};

const updateValueType = {
    edit: 'edit',
    create: 'create',
};

const LoadingStatus = ({ loading }) => (
    <p className={ styles.loadingLabel }>{ loading ? LOADING_LIST_LABEL : CLIENT_APPS_GET_ERROR }</p>
);

class ClientAppPage extends Component {
    state = { ...initialState }

    componentDidMount() {
        getClientAppList()
            .then(response => {
                const { clientApplicationDtoList } = response;
                this.setState({ clientAppList: clientApplicationDtoList });
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
    }

    handleEdit = (id, name, displayName, code, isDeleted) =>
        this.setState({ editingClientApp: { id, name, displayName, code, isDeleted } }, this.openModal);


    handleEditProperties = async (clientAppCode) =>{
        this.setState({ loading: true }, this.openModal);
        const { settingDtoList } = await getSettingsList(clientAppCode);
        const { value = '[]' } = settingDtoList.find(({ key }) => key === 'mechanics') || {};
        const settings = settingDtoList.length && settingDtoList.reduce((result, elem) => {
            return { ...result, [elem.key]: elem.value };
        }, {});

        const url = getStaticUrl();
        const installation_url = settings.installation_url && settings.installation_url.replace(url, '');
        const usage_url = settings.usage_url && settings.usage_url.replace(url, '');

        this.setState({
            clientAppProperties: { ...settings, installation_url, usage_url, clientAppCode },
            loading: false,
            editingClientApp: {
                ...this.state.editingClientApp,
                mechanics: {
                    PRESENTS: value.includes(APP_MECHANICS.PRESENTS.value),
                    ECOSYSTEM: value.includes(APP_MECHANICS.ECOSYSTEM.value),
                    PRESENTATION: value.includes(APP_MECHANICS.PRESENTATION.value),
                },
            },
        });
    }

    handleAdministrate = (code) => {
        const role = getRole();
        const { history } = this.props;
        saveAppCode(code);
        goApp(history, role, true);
    };

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        this.setState({
            editingClientApp: { ...this.state.editingClientApp, isDeleted: value }
        });
    }

    changeMechanicHandler = ({ target }) => {
        const { name, checked } = target;

        if ([APP_MECHANICS.PRESENTS.value, APP_MECHANICS.ECOSYSTEM.value].includes(name) && checked) {
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
    }

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
            <div className={ styles.modalForm }>
                <img src={ cross }
                     onClick={ this.closeModal }
                     className={ styles.crossSvg }
                     alt={ ButtonLabels.CLOSE }
                />
                <Form
                    data={ formData }
                    buttonText={ ButtonLabels.SAVE }
                    onSubmit={ onSubmit }
                    formClassName={ styles.clientAppForm }
                    fieldClassName={ styles.clientAppForm__field }
                    activeLabelClassName={ styles.clientAppForm__field__activeLabel }
                    buttonClassName={ styles.clientAppForm__button }
                    errorText={ getErrorText(formError) }
                    formError={ !!formError }
                    errorClassName={ styles.error }
                />
                { isDeletedCheckbox ?
                    <form className={ styles.clientAppForm }>
                        <label className={ styles.clientAppForm__field }>
                            { IS_DELETED }
                        </label>
                        <input
                            name="Deleted"
                            type="checkbox"
                            checked={ editingClientApp.isDeleted }
                            onChange={ this.handleInputChange }
                        />
                    </form> : null
                }
                { isMechanics &&
            (<div className={ styles.clientAppForm }>
                <h3 className={ styles.mechanics_title } >{ MECHANICS }</h3>
                { MECHANICS_CHECKBOXES.map(({ label, value: name }) => (
                    <div key={ name }>
                        <label className={ styles.clientAppForm__field }>{ label }</label>
                        <input
                            name={ name }
                            type="checkbox"
                            checked={ mechanics[name] }
                            onChange={ this.changeMechanicHandler }
                        />
                    </div>
                )) }
                {mechanicsError && <span className={ styles.error }>{ mechanicsError }</span>}
            </div>) }
            </div>
        );
    }

    reloadClientApps = (clientAppDto) => {
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

    async pushToClientAppList(id, clientAppDto) {
        const newClientApp = {
            ...clientAppDto,
            id: id
        };
        const clientAppList = [...this.state.clientAppList, newClientApp];
        this.setState({ clientAppList }, this.closeModal);
    }

    addOrUpdate = async (data) => {
        const { PRESENTS, ECOSYSTEM } = this.state.editingClientApp.mechanics;
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
        if (!(PRESENTS || ECOSYSTEM) && !data.existingCode) {
            this.setState({ mechanicsError: MECHANICS_ERROR });
            return;
        }
        let clientAppDto;
        clientAppDto = {
            code: data.code,
            name: data.name,
            displayName: data.displayName,
            existingCode: data.existingCode,
            isDeleted: this.state.editingClientApp.isDeleted
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
                JSON.parse(mechanics.value).length && await addSetting(mechanics);
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

    createOrUpdateKey = async (changedParams) => {
        const updateSettings = [];
        const addSettings = [];

        changedParams.forEach((changedValueObject) => {
            const { type, ...params } = changedValueObject;
            type === updateValueType.edit ? updateSettings.push(params) : addSettings.push(params);
        });

        updateSettings.length && (await updateSettingsList(updateSettings));

        const addKeysPromises = addSettings.map(addSetting);
        addKeysPromises.length && (await Promise.all(addKeysPromises));
    }

    getMechanicString = () => {
        const stateMechanics = this.state.editingClientApp.mechanics || {};
        const mechanics = Object.keys(stateMechanics).filter(key => stateMechanics[key]);
        return JSON.stringify(mechanics);
    }

    updateProperties = async (dataFromForm) => {
        const { PRESENTS, ECOSYSTEM } = this.state.editingClientApp.mechanics;

        if (!(PRESENTS || ECOSYSTEM)) {
            this.setState({ mechanicsError: MECHANICS_ERROR });
            return;
        }
        this.setState({ loading: true });
        const {
            clientAppProperties,
            clientAppProperties: { clientAppCode },
        } = this.state;

        dataFromForm.mechanics = this.getMechanicString();

        const changedParams = Object.keys(dataFromForm).reduce((result, key) => {
            const valueFromServer = clientAppProperties[key];
            const valueInForm = dataFromForm[key];

            if (valueFromServer === undefined && valueInForm) {
                return [...result, { clientAppCode, key, value: valueInForm, type: updateValueType.create }];
            }

            if ((!valueFromServer && valueInForm) || (valueFromServer && valueInForm !== valueFromServer)) {
                return [...result, { clientAppCode, key, value: valueInForm, type: updateValueType.edit }];
            }
            return result;
        }, []);

        try {
            await this.createOrUpdateKey(changedParams);
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
                    <Switch checked={ showDeleted } onChange={ this.onShowDeleted } />
                </div>
                {
                    (isSuccess && clientAppList.length) ?
                        clientAppList.map((app, i) =>
                            showDeleted ? <ClientAppItem
                                key={ `clientAppItem-${i}` }
                                handleEdit={ this.handleEdit }
                                handleEditProperties={ this.handleEditProperties }
                                handleAdministrate={ this.handleAdministrate }
                                properties={ app.clientApplicationPropertiesDto }
                                { ...app }
                            /> : !app.isDeleted && <ClientAppItem
                                key={ `clientAppItem-${i}` }
                                handleEdit={ this.handleEdit }
                                handleEditProperties={ this.handleEditProperties }
                                handleAdministrate={ this.handleAdministrate }
                                properties={ app.clientApplicationPropertiesDto }
                                { ...app }
                            />) : <LoadingStatus loading />
                }
            </Fragment>
        );
    };

    renderModifyModal = () => (
        <CustomModal
            isOpen={ this.state.isOpen }
            onRequestClose={ this.closeModal }>
            { this.state.loading ? <LoadingSpinner /> : this.renderModalForm() }
        </CustomModal>
    );

    render() {
        return (
            <div className={ styles.wrapper }>
                <div className={ styles.clientAppPageWrapper }>
                    {this.renderModifyModal()}
                    <div className={ styles.headerSection }>
                        <h3>{CLIENT_APP_LIST_TITLE}</h3>
                        <div>
                            <Button
                                label={ ADD_CLIENT_APP_TITLE }
                                onClick={ this.openModal }
                                font="roboto"
                                type="green"
                            />
                        </div>
                        <div className={ styles.logout } onClick={ this.doLogout }>{ ButtonLabels.LOGOUT }</div>
                    </div>
                    <div className={ styles.clientAppList }>
                        {this.renderClientAppList()}
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(ClientAppPage);