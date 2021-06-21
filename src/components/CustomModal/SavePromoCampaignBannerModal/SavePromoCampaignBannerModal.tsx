import React, { Component, MouseEvent } from 'react';
import { Form, Input, Upload, Modal } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import eq from 'lodash/eq';
import { warnNotice } from '../../toast/Notice';
import { APPLICATION_JSON_TYPE, BANNER_TYPE } from '@constants/common';
import { DraggerProps } from 'antd/lib/upload';
import { BannerDto, PromoCampaignDto } from '@types';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';

type PromoCampaignBanner = Partial<BannerDto> & {
    promoCampaignId?: number | null;
};

type SavePromoCampaignBannerModalProps = {
    title: string;
    editingObject?: PromoCampaignBanner | null;
    currentPromoCampaign?: PromoCampaignDto;
    open: boolean;
    onClose: () => void;
    onSave: (formData: FormData, type: string) => void;
};

type SavePromoCampaignBannerModalState = {
    promoCampaignBanner: PromoCampaignBanner;
    editedPromoCampaignBanner?: PromoCampaignBanner | null;
    uploading: boolean;
    file: File | null;
    fileList: DraggerProps['fileList'];
};

const { Dragger } = Upload;
const ACCEPTED_TYPES = '.png,.jpg,.jpeg,.svg';
const emptyPromoCampaignBanner: PromoCampaignBanner = {
    type: '' as BANNER_TYPE,
    promoCampaignId: null
};

class SavePromoCampaignBannerModal extends Component<SavePromoCampaignBannerModalProps, SavePromoCampaignBannerModalState> {
    constructor(props: SavePromoCampaignBannerModalProps) {
        super(props);
        this.state = {
            promoCampaignBanner: emptyPromoCampaignBanner,
            editedPromoCampaignBanner: null,
            uploading: false,
            file: null,
            fileList: [],
        };
    }

    componentDidUpdate(prevProps: SavePromoCampaignBannerModalProps) {
        if (!eq(prevProps, this.props)) {
            const { editingObject } = this.props;
            const type = this.props.editingObject?.type;
            const id = this.props.currentPromoCampaign?.id;
            this.setState({
                editedPromoCampaignBanner: editingObject,
                promoCampaignBanner: { type, promoCampaignId: id },
                file: null,
                fileList: []
            });
        }
    }

    handleUpload = () => {
        const { promoCampaignBanner, file } = this.state;
        this.setState({ uploading: true });
        const formData = new FormData();
        formData.append('bannerRequest', new Blob([JSON.stringify(promoCampaignBanner)], {
            type: APPLICATION_JSON_TYPE,
        }));
        if (file) {
            formData.append('image', file, file.name);
        }
        this.savePromoCampaignBanner(formData, promoCampaignBanner.type!);
    };

    handleSubmit = (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
        e && e.preventDefault();
        this.handleUpload();
    };

    savePromoCampaignBanner = (formData: FormData, type: string) => {
        if (!this.state.editedPromoCampaignBanner && !this.state.file) {
            return warnNotice('Выберите файл для загрузки!');
        }
        else if (this.state.fileList && this.state.fileList.length > 1) {
            return warnNotice('Можно загрузить только один файл за раз!');
        }
        else if (!this.state.promoCampaignBanner.type) {
            return warnNotice('Введите корректный тип баннера!');
        }
        else if (this.state.promoCampaignBanner.type.startsWith('LOGO') &&
            !this.state.file?.name.endsWith('.svg')) {
            return warnNotice('Файл для типа LOGO должен иметь расширение .svg!');
        }
        this.props.onSave(formData, type);
    };

    render() {
        const {
            open,
            title,
            onClose
        } = this.props;
        const customProps: DraggerProps = {
            name: 'file',
            multiple: false,
            accept: ACCEPTED_TYPES,
            listType: 'picture',
            fileList: this.state.fileList,
            onRemove: (file: UploadFile) => {
                this.setState((state) => {
                    const index = state.fileList?.indexOf(file);
                    const newFileList = state.fileList?.slice();
                    newFileList && index && newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: (file: File) => {
                this.setState({
                    file,
                });
                return false;
            },
            onChange: (info: UploadChangeParam<UploadFile>) => {
                if (info.fileList.length > 1) {
                    info.fileList = info.fileList.slice(-1);
                }
                this.setState({ fileList: info.fileList });
            }
        };

        const { promoCampaignBanner } = this.state;
        return (
            <Modal title={title}
                visible={open}
                onOk={this.handleSubmit}
                okText="Сохранить"
                cancelText="Отменить"
                onCancel={onClose}>
                <Form
                    layout="vertical"
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    onSubmit={this.handleSubmit}
                >
                    <Form.Item required
                        label="Изображение">
                        <Dragger {...customProps}>
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
                            value={promoCampaignBanner.type}
                            onChange={(e) => this.setState({ promoCampaignBanner: { ...promoCampaignBanner, type: e.target.value as BANNER_TYPE } })}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

(SavePromoCampaignBannerModal as any).defaultProps = {
    editingObject: emptyPromoCampaignBanner,
    currentPromoCampaign: {},
    title: ''
};

export default SavePromoCampaignBannerModal;
