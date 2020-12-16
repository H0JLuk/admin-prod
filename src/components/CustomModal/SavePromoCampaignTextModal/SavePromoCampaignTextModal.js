import React, { Component } from 'react';
import { Form, Input, Modal } from 'antd';
import _ from 'lodash';
import { warnNotice } from '../../toast/Notice';

const emptyPromoCampaignText = {
    value: '',
    type: '',
};

class SavePromoCampaignTextModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...emptyPromoCampaignText,
            promoCampaignId: null
        };
    }

    componentDidUpdate(prevProps) {
        if (!_.eq(prevProps, this.props)) {
            const { editingObject, currentPromoCampaign: { id } } = this.props;
            this.setState({ ...editingObject, promoCampaignId: id });
        }
    }

    handleSubmit = (e) => {
        e && e.preventDefault();
        this.savePromoCampaignText(this.state);
    };

    savePromoCampaignText = (promoCampaignText) => {
        if (!promoCampaignText.value) {
            return warnNotice('Введите текст!');
        }
        else if (!promoCampaignText.type) {
            return warnNotice('Введите корректный тип текста!');
        }
        const result = this.props.editingObject || {};
        this.props.onSave(this.state, result.id);
    };

    render() {
        const {
            open,
            title,
            onClose
        } = this.props;

        const {
            value, type
        } = this.state;
        return (
                <Modal title={ title }
                              visible={ open }
                              onOk={ this.handleSubmit }
                              okText="Сохранить"
                              onCancel={ onClose }>
                    <Form layout="vertical" onSubmit={ this.handleSubmit }>
                        <Form.Item required
                                   label="Текст">
                            <Input.TextArea autoFocus
                                   value={ value }
                                   onChange={ (e) => this.setState({ value: e.target.value }) }
                            />
                        </Form.Item>
                        <Form.Item required
                                   label="Тип текста">
                            <Input
                                   value={ type }
                                   onChange={ (e) => this.setState({ type: e.target.value }) }
                            />
                        </Form.Item>
                    </Form>
                </Modal>
        );
    }
}

SavePromoCampaignTextModal.defaultProps = {
    editingObject: emptyPromoCampaignText,
    currentPromoCampaign: {},
    title: ''
};

export default SavePromoCampaignTextModal;