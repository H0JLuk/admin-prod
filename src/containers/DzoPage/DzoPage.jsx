import React, { Component, Fragment } from 'react';
import {
    addDzo,
    deleteDzo,
    getDzoList,
    getAllDzoList,
    updateDzo,
} from '../../api/services/dzoService';
import { DZO_EDIT_FROM, DZO_ADD_FROM } from '../../components/Form/forms';
import { getErrorText } from '../../constants/errors';
import CustomModal from '../../components/CustomModal/CustomModal';
import DzoItem from '../../components/DzoItem/DzoItem';
import Form from '../../components/Form/Form';
import Button from '../../components/Button/Button';
import cross from '../../static/images/cross.svg';
import styles from './DzoPage.module.css';
import { populateFormWithData } from '../../components/Form/formHelper';
import ButtonLabels from '../../components/Button/ButtonLables';

const DZO_LIST_GET_ERROR = 'Ошибка получения ДЗО!';
const DZO_DELETE_ERROR = 'Ошибка удаления ДЗО!';
const ADD_DZO_TITLE = 'Добавить ДЗО';
const REMOVE_QUESTION = 'Удалить категорию?';
const DZO_LIST_TITLE = 'Список ДЗО';
const LOADING_LIST_LABEL = 'Загрузка';
const DZO_CODE_NOT_UNIQUE = 'ДЗО с таким кодом уже есть!';

const LoadingStatus = ({ loading }) => (
    <p className={ styles.loadingLabel }>{ loading ? LOADING_LIST_LABEL : DZO_LIST_GET_ERROR }</p>
);

const initialEditingDzo = {
    id: null, dzoName: null, header: null,
    description: null, dzoCode: null, webUrl: null
};

const initialState = {
    editingDzo: initialEditingDzo,
    dzoList: [],
    allDzoList: [],
    isOpen: false,
    formError: null
};

class DzoPage extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.reloadDzo = this.reloadDzo.bind(this);
        this.pushToDzoList = this.pushToDzoList.bind(this);
    }

    componentDidMount() {
        const loadData = async () => {
            const { dzoDtoList: dzoList = [] } = await getDzoList() ?? {};
            const { dzoDtoList: allDzoList = [] } = await getAllDzoList() ?? {};
            this.setState({ dzoList, allDzoList });
        };
        loadData();
    }

    clearState = () => this.setState({ editingDzo: initialEditingDzo });

    openModal = () => this.setState({ isOpen: true });

    closeModal = () => this.setState({ isOpen: false }, this.clearState);

    handleDelete = (id) => {
        if (window.confirm(REMOVE_QUESTION)) {
            deleteDzo(id).then(() => {
                const croppedDzoList = this.state.dzoList.filter(dzo => dzo.dzoId !== id);
                this.setState({ dzoList: croppedDzoList });
            })
            .catch(() => alert(DZO_DELETE_ERROR));
        }
    };

    handleEdit = (id, dzoName, header, description, dzoCode, webUrl) =>
        this.setState({ editingDzo: { id, dzoName, header, description, dzoCode, webUrl } }, this.openModal);

    renderModalForm = () => {
        const { formError, editingDzo } = this.state;
        const formData = editingDzo?.id != null ? populateFormWithData(DZO_EDIT_FROM, editingDzo) : DZO_ADD_FROM;
        return (
            <div className={ styles.modalForm }>
                <img src={ cross } onClick={ this.closeModal } className={ styles.crossSvg } alt={ ButtonLabels.CLOSE } />
                <Form
                    data={ formData }
                    buttonText={ ButtonLabels.SAVE }
                    onSubmit={ this.onSubmit }
                    formClassName={ styles.dzoForm }
                    fieldClassName={ styles.dzoForm__field }
                    activeLabelClassName={ styles.dzoForm__field__activeLabel }
                    buttonClassName={ styles.dzoForm__button }
                    errorText={ getErrorText(formError) }
                    formError={ !!formError }
                    errorClassName={ styles.error }
                />
            </div>
        );
    };

    checkDzoCodeUnique = (dzoCode) => !!this.state.allDzoList.find(dzo => dzo?.dzoCode === dzoCode);

    reloadDzo(dzoDto) {
        const { editingDzo: { id, dzoName }, dzoList } = this.state;
        const newDzoList = dzoList.slice();
        newDzoList.forEach(elem => {
            if (elem.dzoId === id) {
                this.setState({ dzoList: newDzoList });
                elem.dzoName = dzoName;
                elem.header = dzoDto.header;
                elem.description = dzoDto.description;
                elem.webUrl = dzoDto.webUrl;
            }
        });
        this.setState({ dzoList: newDzoList }, this.closeModal);
    }

    pushToDzoList(dzoId, dzoDto) {
        const { id } = dzoId;
        const { dzoList, allDzoList } = this.state;
        const newDzoItem = { ...dzoDto, dzoId: id };
        const newDzoList = [newDzoItem, ...dzoList];
        const newAllDzoList = [newDzoItem, ...allDzoList];
        this.setState({ dzoList: newDzoList, allDzoList: newAllDzoList }, this.closeModal);
    }

    onSubmit = (data) => {
        const { editingDzo } = this.state;
        if (!editingDzo?.dzoCode && this.checkDzoCodeUnique(data?.dzoCode)) {
            alert(DZO_CODE_NOT_UNIQUE);
        } else {
            const dzoDto = {
                ...data,
                description: (data.description === '') ? null : data.description,
                header: (data.header === '') ? null : data.header,
                webUrl: (data.webUrl === '') ? null : data.webUrl,
            };
            if (editingDzo.id != null) {
                updateDzo(editingDzo.id, {
                    ...dzoDto,
                    dzoName: editingDzo.dzoName,
                    dzoCode: editingDzo.dzoCode
                })
                    .then(() => this.reloadDzo(dzoDto))
                    .catch(error => console.warn(error.message));
            } else {
                addDzo(dzoDto)
                    .then(dzoId => this.pushToDzoList(dzoId, dzoDto))
                    .catch(error => console.warn(error.message));
            }
        }
    };

    renderDzoList = () => {
        const { dzoList } = this.state;
        return (
            <Fragment>
                {Array.isArray(dzoList) ? (
                    dzoList.length ?
                        dzoList.map((dzo, i) =>
                            <DzoItem
                                key={ `dzoItem-${i}` }
                                handleDelete={ this.handleDelete }
                                handleEdit={ this.handleEdit }
                                handleAddAppLink={ this.handleAddAppLink }
                                { ...dzo }
                            />
                        ) : (
                            <LoadingStatus loading />
                        )) : (
                    <LoadingStatus />
                )}
            </Fragment>
        );
    };

    renderModifyModal = () => (
        <CustomModal isOpen={ this.state.isOpen } onRequestClose={ this.closeModal }>
            {this.renderModalForm()}
        </CustomModal>
    );

    render() {
        const openWithParam = () => {
            this.openModal();
        };
        return (
            <div className={ styles.dzoPageWrapper }>
                { this.renderModifyModal() }
                <div className={ styles.headerSection }>
                    <h3>{DZO_LIST_TITLE}</h3>
                    <div>
                        <Button
                            onClick={ openWithParam }
                            label={ ADD_DZO_TITLE }
                            font="roboto"
                            type="green"
                        />
                    </div>
                </div>
                <div className={ styles.dzoList }>
                    {this.renderDzoList()}
                </div>
            </div>
        );
    }
}

export default DzoPage;
