import React, { Component, Fragment } from 'react';
import {
    addClientApp,
    copyClientApp,
    getClientAppList,
    updateClientApp,
    updateProperties
} from '../../api/services/clientAppService';
import { getStaticUrl } from '../../api/services/settingsService';
import { goApp } from '../../utils/appNavigation';
import styles from './ClientAppPage.module.css';
import CustomModal from '../../components/CustomModal/CustomModal';
import ClientAppItem from '../../components/ClientAppItem/ClientAppItem';
import { getErrorText } from '../../constants/errors';
import ButtonLabels from '../../components/Button/ButtonLables';
import cross from '../../static/images/cross.svg';
import Form from '../../components/Form/Form';
import { populateFormWithData } from '../../components/Form/formHelper';
import { CLIENT_APP_ADD_FORM, CLIENT_APP_EDIT_FORM, CLIENT_APP_PROPERTIES_EDIT_FORM } from '../../components/Form/forms';
import { withRouter } from 'react-router-dom';
import { getRole, saveAppCode } from '../../api/services/sessionService';
import { ROUTE } from '../../constants/route';
import { logout } from '../../api/services/authService';
import Button from '../../components/Button/Button';

const CLIENT_APP_LIST_TITLE = 'Клиенские приложения';
const LOADING_LIST_LABEL = 'Загрузка';
const CLIENT_APPS_GET_ERROR = 'Ошибка получения клиентских приложений!';
const ENTER_CLIENT_APP_CODE_REQUEST = 'Пожалуйста, введите код клиентского приложения';
const ENTER_CLIENT_APP_NAME_REQUEST = 'Пожалуйста, введите имя клиентского приложения';
const ADD_CLIENT_APP_TITLE = 'Добавить клиентское приложение';
const ADD_CLIENT_APP_ERROR = 'Не удалось добавить клиентское приложение';
const COPY_CLIENT_APP_ERROR = 'Не удалось скопировать клиентское приложение';
const IS_DELETED = 'Is Deleted:';

const initialState = {
    editingClientApp: {
        id: null, name: null, code: null, existingCode: null, isDeleted: false
    },
    clientAppProperties: {
        clientAppId: null, installationUrl: null, yamToken: null, tokenLifetime: null,
        inactivityTime: null, promoShowTime: null, privacyPolicy: null,
        tmpBlockTime: null, maxPasswordAttempts: null, maxPresentsNumber: null
    },
    staticUrl: getStaticUrl(), clientAppList: [], isOpen: false, formError: null
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

    handleEdit = (id, name, code, isDeleted) =>
        this.setState({ editingClientApp: { id, name, code, isDeleted } }, this.openModal);


    handleEditProperties = (properties, clientAppId) =>
        this.setState({ clientAppProperties: { ...properties, clientAppId } }, this.openModal);

    handleAdministrate = (code) => {
        const role = getRole();
        const { history } = this.props;
        saveAppCode(code);
        goApp(history, role);
    };

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        this.setState({
            editingClientApp: { ...this.state.editingClientApp, isDeleted: value }
        });
    }

    doLogout = () => {
        logout().then(() => {
            this.props.history.push(ROUTE.LOGIN);
        });
    };

    renderModalForm = () => {
        const { formError, editingClientApp, clientAppProperties } = this.state;
        let formData, onSubmit, isDeletedCheckbox;
        if (editingClientApp.id !== null) {
            isDeletedCheckbox = true;
            formData = populateFormWithData(CLIENT_APP_EDIT_FORM, {
                name: editingClientApp.name,
                code: editingClientApp.code,
            });
            onSubmit = this.addOrUpdate;
        } else if (clientAppProperties.clientAppId !== null) {
            isDeletedCheckbox = false;
            formData = populateFormWithData(CLIENT_APP_PROPERTIES_EDIT_FORM, { ...clientAppProperties });
            onSubmit = this.updateProperties;
        } else {
            isDeletedCheckbox = true;
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
            </div>
        );
    }

    reloadClientApps = (clientAppDto) => {
        const { clientAppList, editingClientApp: { id } } = this.state;
        const newClientAppList = clientAppList.slice();
        newClientAppList.forEach(app => {
            if (app.id === id) {
                app.name = clientAppDto.name;
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
        if (!data.code) {
            alert(ENTER_CLIENT_APP_CODE_REQUEST);
            return;
        }
        if (!data.name) {
            alert(ENTER_CLIENT_APP_NAME_REQUEST);
            return;
        }
        let clientAppDto;
        clientAppDto = {
            code: data.code,
            name: data.name,
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

    updateProperties = async (data) => {
        const { clientAppProperties: { clientAppId } } = this.state;
        const properties = { ...data };
        try {
            for (const propName in properties) {
                const property = properties[propName];
                if (property == null || property === '') {
                    delete properties[propName];
                }
            }
            const response = await updateProperties(clientAppId, properties);
            await this.reloadProperties(clientAppId, response);
        } catch (e) {
            console.error(e.message);
            alert(e.message);
        }
    };

    async reloadProperties(clientAppId, properties) {
        const { clientAppList } = this.state;
        await clientAppList.forEach(app => {
           if (app.id === clientAppId) {
               app.clientApplicationPropertiesDto = properties;
           }
        });
        this.setState({ clientAppList: clientAppList }, this.closeModal);
    }

    renderClientAppList = () => {
        const { clientAppList } = this.state;
        const isSuccess = Array.isArray(clientAppList);
        return (
            <Fragment>
                {
                    (isSuccess && clientAppList.length) ?
                        clientAppList.map((app, i) =>
                            <ClientAppItem
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
            {this.renderModalForm()}
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