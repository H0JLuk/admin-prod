import React, { Component } from 'react';
import { swapPositions, uploadFile } from '@apiServices/adminService';
import {
    addPresentation,
    deletePresentation,
    getPresentationList,
    updatePresentation,
} from '@apiServices/landingService';
import { getStaticUrl } from '@apiServices/settingsService';
import { Errors, getErrorText } from '@constants/errors';
import LandingItem from '@components/LandingItem';
import { movementDirections } from '@constants/movementDirections';
import styles from './PresentationPage.module.css';
import { getAppCode } from '@apiServices/sessionService';
import Header from '@components/Header';
import { Button, Form, Input, message, Modal } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { PresentationDto, SavePresentationRequest } from '@types';
import EmptyMessage from '@components/EmptyMessage';
import { BUTTON_TEXT } from '@constants/common';
import { FORM_RULES, getPatternAndMessage } from '@utils/validators';
import UploadPicture from '@components/UploadPicture';
import { UploadFile } from 'antd/lib/upload/interface';

const LANDINGS_EMPTY = {
    firstMessagePart: 'Для этой витрины пока нет лендингов',
    secondMessagePart: 'Чтобы добавить лендинг нажмите кнопку "Добавить лендинг"',
};
const LANDINGS_GET_ERROR = 'Ошибка получения лендингов!';
const LANDINGS_DELETE_ERROR = 'Ошибка удаления лендинга!';
const IMAGE_UPLOAD_ERROR = 'Ошибка загрузки изображения!';
const LANDINGS_MOVE_ERROR = 'Ошибка изменения порядка лендингов';
const ADD_LANDING_TITLE = 'Добавить лендинг';
const REMOVE_QUESTION = 'Удалить лендинг?';
const LANDINGS_LIST_TITLE = 'Список лендингов';
const LANDING_DIR = 'landing';

const initialEditingLanding = {
    landingId: null,
    header: null,
    description: null,
    imageUrl: null,
};

type FormValues = {
    header: string;
    description: string;
    imageUrl: string | UploadFile[];
};

export type initialEditingLandingType = {
    landingId: number | string | null;
    header: string | null;
    description: string | null;
    imageUrl: string | null;
};

type PresentationPageState = {
    loading: boolean;
    editingLanding: initialEditingLandingType;
    landings: PresentationDto[];
    isOpen: boolean;
    formError: Errors | null;
    staticServerUrl: string;
};

class PresentationPage extends Component<Record<string, unknown>, PresentationPageState> {
    constructor(props: Record<string, string>) {
        super(props);
        this.state = {
            loading: true,
            editingLanding: initialEditingLanding,
            landings: [],
            isOpen: false,
            formError: null,
            staticServerUrl: getStaticUrl() as string,
        };
    }

    componentDidMount() {
        getPresentationList()
            .then(response => {
                const { landingDtoList } = response;
                this.setState({ landings: landingDtoList, loading: false });
            })
            .catch(() => {
                this.setState({ landings: [], loading: false });
                message.error(LANDINGS_GET_ERROR);
            });
    }

    clearState = () => this.setState({ editingLanding: initialEditingLanding });

    openModal = () => this.setState({ isOpen: true });

    closeModal = () => this.setState({ isOpen: false }, this.clearState);

    handleDelete = (id: number) => {
        if (window.confirm(REMOVE_QUESTION)) {
            deletePresentation(id)
                .then(() => {
                    const croppedLandings = this.state.landings.filter(landing => landing.landingId !== id);
                    this.setState({ landings: croppedLandings });
                })
                .catch(() => alert(LANDINGS_DELETE_ERROR));
        }
    };

    handleMove = (id: number, direction: number) => {
        const { landings } = this.state;
        const position = landings.findIndex((i) => i.landingId === id);
        if (position < 0) {
            throw new Error('Given item not found.');
        } else if ((direction === movementDirections.UP && position === 0) || (direction === movementDirections.DOWN && position === landings.length - 1)) {
            return;
        }
        const item = landings[position];
        const newLandings = landings.filter((i) => i.landingId !== id);
        newLandings.splice(position + direction, 0, item);
        swapPositions(id, landings[position + direction].landingId as number, LANDING_DIR)
            .then(() => this.setState({ landings: newLandings }))
            .catch(() => alert(LANDINGS_MOVE_ERROR));
    };

    handleEdit = (landingId: number, header: string, description: string, imageUrl: string) => this.setState({
        editingLanding: { landingId, header, description, imageUrl },
    }, this.openModal);

    renderModalForm = () => {
        const { formError, editingLanding } = this.state;

        return (
            <div className={styles.modalForm}>
                <Form
                    className={styles.presentationForm}
                    layout="vertical"
                    onFinish={this.onSubmit}
                    validateTrigger="onSubmit"
                >
                    <Form.Item
                        name="header"
                        label="Заголовок"
                        rules={[
                            FORM_RULES.REQUIRED,
                            {
                                ...getPatternAndMessage('presentation', 'common'),
                            },
                        ]}
                        initialValue={editingLanding.header ?? ''}
                        validateFirst
                    >
                        <Input
                            maxLength={60}
                            allowClear
                        />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Описание"
                        rules={[
                            FORM_RULES.REQUIRED,
                            {
                                ...getPatternAndMessage('presentation', 'common'),
                            },
                        ]}
                        initialValue={editingLanding.description ?? ''}
                        validateFirst
                    >
                        <Input.TextArea maxLength={150} />
                    </Form.Item>

                    <UploadPicture
                        name="imageUrl"
                        label="Изображение презентации"
                        initialValue={editingLanding.imageUrl || []}
                        rules={[FORM_RULES.REQUIRED]}
                        type="banner"
                        removeIconView={false}
                        accept="image/*"
                        footer
                    />

                    {formError && <p className={styles.error}>{getErrorText(formError)}</p>}

                    <Button
                        className={styles.presentationForm__button}
                        type="primary"
                        htmlType="submit"
                    >
                        {BUTTON_TEXT.SAVE}
                    </Button>
                </Form>
            </div>
        );
    };

    reloadLandings = (data: SavePresentationRequest, url: string) => {
        const { landings, editingLanding: { landingId } } = this.state;
        const newLandings = landings.slice();
        newLandings.forEach(elem => {
            if (elem.landingId === landingId) {
                elem.imageUrl = url;
                elem.header = data.header;
                elem.description = data.description;
            }
        });
        this.setState({ landings: newLandings }, this.closeModal);
    };

    onSubmit = async ({ imageUrl: formImage, ...data }: FormValues) => {
        const { editingLanding, staticServerUrl } = this.state;
        let { landingId } = editingLanding;
        let landingImage = formImage;

        try {
            if (typeof landingImage !== 'string') {
                try {
                    const imageFile = landingImage[0].originFileObj!;
                    const imageName = `${getAppCode()}/${LANDING_DIR}/${imageFile.name.replace(/\s/g, '_').replace(/[()]+/g, '')}`;
                    const { path } = await uploadFile(imageFile, imageName);
                    landingImage = path;
                } catch (err) {
                    alert(IMAGE_UPLOAD_ERROR);
                    console.log(err.message);
                }
            } else {
                landingImage = editingLanding.imageUrl?.slice(staticServerUrl.length) ?? '';
            }

            const landingDto = {
                ...data,
                imageUrl: landingImage,
            } as SavePresentationRequest;
            const imageUrl = `${staticServerUrl}${landingDto.imageUrl}`;

            if (landingId !== null) {
                await updatePresentation(landingId as number, landingDto);
                this.reloadLandings(landingDto, imageUrl);
            } else {
                ({ id: landingId } = await addPresentation(landingDto));
                const newLandingItem = { ...landingDto, landingId, imageUrl };
                const landings = [...this.state.landings, newLandingItem];
                this.setState({ landings }, this.closeModal);
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    renderLandingsList = () => {
        const { landings, loading } = this.state;

        if (loading) {
            return (
                <div className={styles.loadingContainer}>
                    <div className={styles.loading}>
                        <SyncOutlined spin />
                    </div>
                </div>
            );
        }

        return landings.length
            ? landings.map((landing, i) => (
                <LandingItem
                    key={`landingItem-${i}`}
                    handleDelete={this.handleDelete}
                    handleEdit={this.handleEdit}
                    handleMove={this.handleMove}
                    {...landing}
                />
            ))
            : (
                <EmptyMessage
                    className={styles.emptyMessage}
                    firstMessage={LANDINGS_EMPTY.firstMessagePart}
                    secondMessage={LANDINGS_EMPTY.secondMessagePart}
                />
            );
    };

    renderModifyModal = () => (
        <Modal
            visible={this.state.isOpen}
            onCancel={this.closeModal}
            footer={null}
            destroyOnClose
        >
            {this.renderModalForm()}
        </Modal>
    );

    render() {
        const openWithParam = () => {
            this.openModal();
        };
        return (
            <div className={styles.landingPageWrapper}>
                <Header buttonBack={false} menuMode />
                <div className={styles.landingContainer}>
                    {this.renderModifyModal()}
                    <div className={styles.headerSection}>
                        <h3>{LANDINGS_LIST_TITLE}</h3>
                        <div>
                            <Button
                                onClick={openWithParam}
                                type="primary"
                                shape="round"
                            >
                                {ADD_LANDING_TITLE}
                            </Button>
                        </div>
                    </div>
                    <div className={styles.landingList}>
                        {this.renderLandingsList()}
                    </div>
                </div>
            </div>
        );
    }
}

export default PresentationPage;
