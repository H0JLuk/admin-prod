import React, { Component } from 'react';
import { Form, Input, Checkbox, DatePicker, Space, Select, Modal } from 'antd';
import _ from 'lodash';
import { warnNotice } from '../../toast/Notice';
import moment from 'moment';
import promoCodeTypes from '../../../constants/promoCodeTypes';

const { Option } = Select;
const { RangePicker } = DatePicker;
const emptyPromoCampaign = {
    name: '',
    webUrl: null,
    startDate: undefined,
    finishDate: undefined,
    promoCodeType: null,
    type: null,
    active: false,
    dzoId: null,
};
const {
    PERSONAL,
    PERSONAL_CLIENT_POOL,
    COMMON,
    COMMON_CLIENT_POOL,
    NONE } = promoCodeTypes;

class SavePromoCampaignModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...emptyPromoCampaign,
            dzoList: [],
            dates: null,
        };
    }

    componentDidUpdate(prevProps) {
        if (!_.eq(prevProps, this.props)) {
            const { editingObject , dzoList } = this.props;
            this.setState({
                ...editingObject,
                dzoList,
                dates: [moment(editingObject.startDate), moment(editingObject.finishDate)]
            });
        }
    }

    handleSubmit = (e) => {
        e && e.preventDefault();
        this.savePromoCampaign(this.state);
    };

    savePromoCampaign = (promoCampaign) => {
        const length = _.size(promoCampaign.name);

        if (length < 3 || length > 62) {
            return warnNotice('Введите корректное название!');
        }
         else if (!promoCampaign.promoCodeType) {
            return warnNotice('Выбирите промокод из списка!');
        }
        else if (!promoCampaign.dzoId) {
            return warnNotice('Выбирите партнера из списка!');
        }
        const result = this.props.editingObject || {};
        this.props.onSave(this.state, result.id);
    };

    render() {
        const {
            open,
            title,
            onClose,
            editingObject
        } = this.props;

        const {
            name, webUrl, active, dzoId, promoCodeType, dzoList, dates, type
        } = this.state;
        return (
            <Modal title={ title }
                   visible={ open }
                   onOk={ this.handleSubmit }
                   okText="Сохранить"
                   onCancel={ onClose }>
                <Form layout="vertical" onSubmit={ this.handleSubmit }>
                    <Form.Item required
                               label="Название">
                        <Input autoFocus
                               value={ name }
                               onChange={ (e) => this.setState({ name: e.target.value }) }
                        />
                    </Form.Item>
                    <Form.Item label="Ссылка на страницу промо-кампании">
                        <Input autoFocus
                               value={ webUrl }
                               onChange={ (e) => this.setState({ webUrl: e.target.value }) }
                        />
                    </Form.Item>
                    <Form.Item label="Период действия промо-кампании">
                        <Space direction="vertical" size={ 12 }>
                            <RangePicker disabled value={ dates } onChange={ (dates, dateStrings) => this.setState({
                                dates,
                                startDate: dateStrings[0],
                                finishDate: dateStrings[1]
                            }) } />
                        </Space>
                    </Form.Item>
                    <Form.Item label="Активная">
                        <Checkbox autoFocus
                                  checked={ active }
                                  onChange={ (e) => this.setState({ active: e.target.checked }) } />
                    </Form.Item>
                    <Form.Item required
                               label="Тип промокода">
                        <Select autoFocus
                                disabled={ editingObject.promoCodeType }
                                placeholder="Выбирите тип промокодов"
                                value={ promoCodeType }
                                onChange={ (promoCodeType) => this.setState({ promoCodeType }) }>
                            <Option value={ NONE }>Нет промокодов</Option>
                            <Option value={ PERSONAL }>Персональные (для всех)</Option>
                            <Option value={ COMMON }>Общий (один для всех)</Option>
                            <Option value={ PERSONAL_CLIENT_POOL } disabled>Персональный (для определенного списка
                                клиентов)</Option>
                            <Option value={ COMMON_CLIENT_POOL } disabled>Общий (для определенного списка
                                клиентов)</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item required
                               label="Тип промо-кампании">
                        <Select autoFocus
                                placeholder="Выбирите тип промо-кампании"
                                value={ type }
                                onChange={ (type) => this.setState({ type }) }>
                            <Option value="NORMAL">Нормальный</Option>
                            <Option value="PRESENT">Подарок</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item required
                               label="Партнер (ДЗО)">
                        <Select autoFocus
                                value={ dzoId }
                                placeholder="Выберите партнера из списка"
                                onChange={ (dzoId) => this.setState({ dzoId }) }>
                            {dzoList.map(option => <Option key={ option.dzoCode }
                                                           value={ option.dzoId }>{option.dzoName} ({option.dzoCode})</Option>)}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

SavePromoCampaignModal.defaultProps = {
    editingObject: emptyPromoCampaign,
    dzoList: [],
    title: ''
};

export default SavePromoCampaignModal;