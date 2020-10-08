import React, { Component } from 'react';
import { Form, Upload, Modal, Typography } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { warnNotice } from '../../toast/Notice';
import example from '../../../static/images/promoCodeUploadExample.png';

const { Dragger } = Upload;
const acceptedTypes = '.xls,.xlsx';

class UploadPromoCodesModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPromoCampaign: null,
            uploading: false,
            file: null,
            fileList: [],
        };
    }

    componentDidUpdate(prevProps) {
        if (!_.eq(prevProps, this.props)) {
            const { currentPromoCampaign } = this.props;
            this.setState({ currentPromoCampaign, file: null, fileList: [] });
        }
    }

    handleUpload = () => {
        const { file } = this.state;
        this.setState({
            uploading: true,
        });
        let formData = new FormData();
        formData.append('file', file, file.name);
        this.uploadPromoCodes(formData);
    };

    handleSubmit = (e) => {
        e && e.preventDefault();
        this.handleUpload();
    };

    uploadPromoCodes = (formData) => {
        if (!this.state.file) {
             return warnNotice('Выберите файл для загрузки!');
        }
        else if (this.state.fileList.length > 1) {
            return warnNotice('Можно загрузить только один файл за раз!');
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
            accept: acceptedTypes,
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
            uploading
        } = this.state;
        return (
                <Modal title={ title }
                              visible={ open }
                              onOk={ this.handleSubmit }
                              okText="Сохранить"
                              onCancel={ onClose }>
                    <Typography.Paragraph>Файл с промокодами должен быть в формат .xls или .xlsx.</Typography.Paragraph>
                    <Typography.Paragraph>Промокоды в файле должны быть перечислены в первом столбце (столбце "А") первого листа файла.</Typography.Paragraph>
                    <Typography.Paragraph>Если тип промокода - COMMON (один промо код для всех), то в файле должен быть строго один промо код.</Typography.Paragraph>
                    <img src={ example } alt="example" width="50%" />
                    <Form layout="vertical" onSubmit={ this.handleSubmit }>
                        <Form.Item required
                                   label="Excel файл">
                            <Dragger uploading={ uploading }
                                     { ...customProps }>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                <p className="ant-upload-hint">
                                    Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                                    band files
                                </p>
                            </Dragger>
                        </Form.Item>
                    </Form>
                </Modal>
        );
    }
}

UploadPromoCodesModal.defaultProps = {
    currentPromoCampaign: null,
    title: ''
};

export default UploadPromoCodesModal;