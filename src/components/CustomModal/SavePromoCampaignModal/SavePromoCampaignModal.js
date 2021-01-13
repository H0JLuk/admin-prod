import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Form, Input, Checkbox, Select, Modal,
    // DatePicker, Space
} from 'antd';
import _ from 'lodash';
import { warnNotice } from '../../toast/Notice';
// import moment from 'moment';
import promoCodeTypes from '../../../constants/promoCodeTypes';

const { Option } = Select;
// const { RangePicker } = DatePicker;
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
            // dates: null,
        };
    }

    componentDidUpdate(prevProps) {
        if (!_.eq(prevProps, this.props)) {
            const { editingObject , dzoList } = this.props;
            this.setState({
                ...editingObject,
                dzoList,
                // dates: [moment(editingObject.startDate), moment(editingObject.finishDate)]
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
            editingObject,
            editMode
        } = this.props;

        const {
            name, webUrl, active, dzoId, promoCodeType, dzoList, type,
            // dates
        } = this.state;
        return (
            <Modal title={ title }
                   visible={ open }
                   onOk={ this.handleSubmit }
                   okText="Сохранить"
                   cancelText="Отменить"
                   onCancel={ onClose }
            >
                <Form layout="vertical" onSubmit={ this.handleSubmit }>
                    <Form.Item required label="Название">
                        <Input autoFocus
                               value={ name }
                               onChange={ (e) => this.setState({ name: e.target.value }) }
                        />
                    </Form.Item>
                    <Form.Item label="Ссылка на страницу промо-кампании">
                        <Input value={ webUrl }
                               onChange={ (e) => this.setState({ webUrl: e.target.value }) }
                        />
                    </Form.Item>
                    {/*<Form.Item label="Период действия промо-кампании">*/}
                    {/*    <Space direction="vertical" size={ 12 }>*/}
                    {/*        <RangePicker disabled value={ dates } onChange={ (dates, dateStrings) => this.setState({*/}
                    {/*            dates,*/}
                    {/*            startDate: dateStrings[0],*/}
                    {/*            finishDate: dateStrings[1]*/}
                    {/*        }) } />*/}
                    {/*    </Space>*/}
                    {/*</Form.Item>*/}
                    <Form.Item label="Активная">
                        <Checkbox checked={ active }
                                  onChange={ (e) => this.setState({ active: e.target.checked }) }
                        />
                    </Form.Item>
                    <Form.Item required label="Тип промокода">
                        <Select disabled={ editingObject.promoCodeType }
                                placeholder="Выбирите тип промокодов"
                                value={ promoCodeType }
                                onChange={ (promoCodeType) => this.setState({ promoCodeType }) }
                        >
                            <Option value={ NONE.value }>Нет промокодов</Option>
                            <Option value={ PERSONAL.value }>Персональные (для всех)</Option>
                            <Option value={ COMMON.value }>Общий (один для всех)</Option>
                            <Option value={ PERSONAL_CLIENT_POOL.value } disabled>
                                Персональный (для определенного списка клиентов)
                            </Option>
                            <Option value={ COMMON_CLIENT_POOL.value } disabled>
                                Общий (для определенного списка клиентов)
                            </Option>
                        </Select>
                    </Form.Item>
                    <Form.Item required label="Тип промо-кампании">
                        <Select placeholder="Выбирите тип промо-кампании"
                                value={ type }
                                onChange={ (type) => this.setState({ type }) }
                        >
                            <Option value="NORMAL">Нормальный</Option>
                            <Option value="PRESENT">Подарок</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item required label="Партнер (ДЗО)">
                        <Select
                                disabled={ editMode }
                                value={ dzoId }
                                placeholder="Выберите партнера из списка"
                                onChange={ (dzoId) => this.setState({ dzoId }) }
                        >
                            {dzoList.map(option => (
                                <Option key={ option.dzoCode } value={ option.dzoId }>
                                    {option.dzoName} ({option.dzoCode})
                                </Option>)
                            )}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

SavePromoCampaignModal.propTypes = {
    editingObject: PropTypes.object,
    editMode: PropTypes.bool,
    dzoList: PropTypes.array,
    title: PropTypes.string
};

SavePromoCampaignModal.defaultProps = {
    editingObject: emptyPromoCampaign,
    editMode: false,
    dzoList: [],
    title: ''
};

export default SavePromoCampaignModal;