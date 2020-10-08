import React, { Component } from 'react';
import { Form, Input, Upload, Modal } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { warnNotice } from '../../toast/Notice';

const { Dragger } = Upload;
const ACCEPTED_TYPES = '.png,.jpg,.jpeg,.svg';
const emptyPromoCampaignBanner = {
    type: '',
    promoCampaignId: null
};

class SavePromoCampaignBannerModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            promoCampaignBanner: emptyPromoCampaignBanner,
            editedPromoCampaignBanner: null,
            uploading: false,
            file: null,
            fileList: [],
        };
    }

    componentDidUpdate(prevProps) {
        if (!_.eq(prevProps, this.props)) {
            const { editingObject, editingObject: { type } , currentPromoCampaign: { id } } = this.props;
            this.setState({
                editedPromoCampaignBanner: editingObject,
                promoCampaignBanner : { type, promoCampaignId: id },
                file: null,
                fileList: []
            });
        }
    }

    handleUpload = () => {
        const { promoCampaignBanner, file } = this.state;
        this.setState({ uploading: true });
        let formData = new FormData();
        formData.append('bannerRequest', new Blob([JSON.stringify(promoCampaignBanner)], {
            type: 'application/json'
        }));
        if (file) {
            formData.append('image', file, file.name);
        }
        this.savePromoCampaignBanner(formData);
    };

    handleSubmit = (e) => {
        e && e.preventDefault();
        this.handleUpload();
    };

    savePromoCampaignBanner = (formData) => {
        if (!this.state.editedPromoCampaignBanner && !this.state.file) {
             return warnNotice('Выберите файл для загрузки!');
        }
        else if (this.state.fileList.length > 1) {
            return warnNotice('Можно загрузить только один файл за раз!');
        }
        else if (!this.state.promoCampaignBanner.type) {
            return warnNotice('Введите корректный тип баннера!');
        }
        else if (this.state.promoCampaignBanner.type.startsWith('LOGO') &&
            !this.state.file.name.endsWith('.svg')) {
            return warnNotice('Файл для типа LOGO должен иметь расширение .svg!');
        }
        this.props.onSave(formData);
    };

    render() {
        const {
            open,
            title,
            onClose
        } = this.props;

        const customProps = {
            name: 'file',
            multiple: false,
            uploading: false,
            accept: ACCEPTED_TYPES,
            listType: 'picture',
            fileList: this.state.fileList,
            onRemove: file => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: file => {
                this.setState({
                    file,
                });
                return false;
            },
            onChange: info => {
                if (info.fileList.length > 1) {
                    info.fileList = info.fileList.slice(-1);
                }
                this.setState({ fileList: info.fileList });
            }
        };

        const {
            promoCampaignBanner, uploading
        } = this.state;
        return (
                <Modal title={ title }
                              visible={ open }
                              onOk={ this.handleSubmit }
                              okText="Сохранить"
                              onCancel={ onClose }>
                    <Form layout="vertical" onSubmit={ this.handleSubmit }>
                        <Form.Item required
                                   label="Изображение">
                            <Dragger uploading={ uploading }
                                     { ...customProps }>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Для загрузки нажмите или перетащите файл в эту область</p>
                                <p className="ant-upload-hint">Поддерживается загрузка одного файла</p>
                            </Dragger>
                        </Form.Item>
                        <Form.Item required
                                   label="Тип баннера">
                            <Input autoFocus
                                   value={ promoCampaignBanner.type }
                                   onChange={ (e) => this.setState({ promoCampaignBanner : { ...promoCampaignBanner, type: e.target.value } }) }
                            />
                        </Form.Item>
                    </Form>
                </Modal>
        );
    }
}

SavePromoCampaignBannerModal.defaultProps = {
    editingObject: emptyPromoCampaignBanner,
    currentPromoCampaign: {},
    title: ''
};

export default SavePromoCampaignBannerModal;