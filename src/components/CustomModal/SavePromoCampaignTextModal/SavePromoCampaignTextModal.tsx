import React, { Component } from 'react';
import { Form, Input, Modal } from 'antd';
import eq from 'lodash/eq';
import { warnNotice } from '../../toast/Notice';
import { BannerTextDto, PromoCampaignDto, PromoCampaignTextCreateDto } from '@types';

export type SavePromoCampaignTextModalProps = {
    editingObject: BannerTextDto;
    currentPromoCampaign: PromoCampaignDto;
    title: string;
    open: boolean;
    onClose: () => void;
    onSave: (state: Omit<PromoCampaignTextCreateDto, 'promoCampaignId'> & { promoCampaignId: number | null; }) => void;
};

type EmptyPromoCampaignTextModal = {
    id: number | null;
    value: string;
    type: string;
};

type SavePromoCampaignTextModalState = Omit<BannerTextDto, 'id'> & {
    id: number | null;
    promoCampaignId: number | null;
};

const emptyPromoCampaignText = {
    value: '',
    type: '',
    id: null,
};

class SavePromoCampaignTextModal extends Component<SavePromoCampaignTextModalProps, SavePromoCampaignTextModalState> {
    static defaultProps = {
        editingObject: emptyPromoCampaignText,
        currentPromoCampaign: {},
        title: ''
    };

    public state = {
        ...emptyPromoCampaignText,
        promoCampaignId: null,
    };

    componentDidUpdate(prevProps: SavePromoCampaignTextModalProps) {
        if (!eq(prevProps, this.props)) {
            const { editingObject, currentPromoCampaign: { id } } = this.props;
            this.setState({ ...editingObject, promoCampaignId: id });
        }
    }

    handleSubmit = (e: React.SyntheticEvent) => {
        e && e.preventDefault();
        this.savePromoCampaignText(this.state);
    };

    savePromoCampaignText = (promoCampaignText: EmptyPromoCampaignTextModal) => {
        if (!promoCampaignText.value) {
            return warnNotice('Введите текст!');
        }
        else if (!promoCampaignText.type) {
            return warnNotice('Введите корректный тип текста!');
        }
        this.props.onSave(this.state);
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
            <Modal title={title}
                visible={open}
                onOk={this.handleSubmit}
                okText="Сохранить"
                cancelText="Отменить"
                onCancel={onClose}
            >
                <Form layout="vertical" onFinish={this.handleSubmit} >
                    <Form.Item
                        required
                        label="Текст"
                    >
                        <Input.TextArea
                            autoFocus
                            value={value}
                            onChange={(e) => this.setState({ value: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item
                        required
                        label="Тип текста">
                        <Input
                            value={type}
                            onChange={(e) => this.setState({ type: e.target.value })}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default SavePromoCampaignTextModal;
