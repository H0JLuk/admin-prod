import React, { Component } from 'react';
import { swapPositions, uploadFile } from '@apiServices/adminService';
import {
    addLanding,
    deleteLanding,
    getLandingList,
    updateLanding,
} from '@apiServices/landingService';
import { getStaticUrl } from '@apiServices/settingsService';
import { LANDING_EDIT_FORM } from '@components/Form/forms';
import { Errors, getErrorText } from '@constants/errors';
import CustomModal from '@components/CustomModal/CustomModal';
import LandingItem from '@components/LandingItem';
import { movementDirections } from '@constants/movementDirections';
import Form from '@components/Form';
import Button from '@components/Button';
import cross from '@imgs/cross.svg';
import styles from './PresentationPage.module.css';
import { populateFormWithData } from '@components/Form/formHelper';
import ButtonLabels from '@components/Button/ButtonLables';
import { getAppCode } from '@apiServices/sessionService';
import Header from '@components/Header';
import { Empty, message } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { LandingDto, SaveLandingRequest } from '@types';

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
const UPLOAD_IMAGE_PLEASE = 'Пожалуйста загрузите изображение!';
const LANDING_DIR = 'landing';

const EmptyMessage = () => (
    <Empty description={null} className={styles.emptyMessage} >
        <div>{LANDINGS_EMPTY.firstMessagePart}</div>
        <div>{LANDINGS_EMPTY.secondMessagePart}</div>
    </Empty>
);

const initialEditingLanding = {
    landingId: null,
    header: null,
    description: null,
    imageUrl: null,
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
    landings: LandingDto[];
    isOpen: boolean;
    formError: Errors | null;
    staticServerUrl: string;
};

class PresentationPage extends Component<Record<string, unknown>, PresentationPageState> {
    private landingRef: React.RefObject<HTMLInputElement & { files: File[]; }>;

    constructor(props: Record<string, string>) {
        super(props);
        this.landingRef = React.createRef();
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
        getLandingList()
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
            deleteLanding(id)
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
        const formData = editingLanding.landingId !== null ? populateFormWithData(LANDING_EDIT_FORM, {
            landingId: editingLanding.landingId as string,
            header: editingLanding.header,
            description: editingLanding.description,
            imageUrl: editingLanding.imageUrl,
        }) : LANDING_EDIT_FORM;
        return (
            <div className={styles.modalForm}>
                <img src={cross} onClick={this.closeModal} className={styles.crossSvg} alt={ButtonLabels.CLOSE} />
                <Form
                    data={formData}
                    buttonText={ButtonLabels.SAVE}
                    onSubmit={this.onSubmit}
                    formClassName={styles.landingForm}
                    fieldClassName={styles.landingForm__field}
                    activeLabelClassName={styles.landingForm__field__activeLabel}
                    buttonClassName={styles.landingForm__button}
                    errorText={getErrorText(formError)}
                    formError={!!formError}
                    errorClassName={styles.error}
                />
                <form className={styles.imageUploadContainer}>
                    <label htmlFor="landingImageInput">Изображение лендинга</label>
                    <input type="file" id="landingImageInput" ref={this.landingRef} className={styles.imageUpload} />
                </form>
            </div>
        );
    };

    reloadLandings = (data: SaveLandingRequest, url: string) => {
        const { landings, editingLanding: { landingId } } = this.state;
        const newLandings = landings.slice();
        newLandings.forEach(elem => {
            if (elem.landingId === landingId && this.landingRef.current) {
                if (this.landingRef.current.files.length > 0 && elem.imageUrl === url) {
                    elem.imageUrl = '';
                    this.setState({ landings: newLandings });
                }
                elem.imageUrl = url;
                elem.header = data.header;
                elem.description = data.description;
            }
        });
        this.setState({ landings: newLandings }, this.closeModal);
    };

    onSubmit = (data: SaveLandingRequest | Record<string, string>) => {
        const { editingLanding: { imageUrl, landingId }, staticServerUrl } = this.state;
        if (this.landingRef.current && !this.landingRef.current.files.length && !imageUrl) {
            alert(UPLOAD_IMAGE_PLEASE);
            return;
        }
        let landingDto: SaveLandingRequest;
        if (landingId !== null && this.landingRef.current && !this.landingRef.current.files.length && imageUrl) {
            landingDto = { ...data, imageUrl: imageUrl.slice(staticServerUrl.length) } as SaveLandingRequest;
            updateLanding(landingId as number, landingDto)
                .catch(error => console.log(error.message));
            this.reloadLandings(data as SaveLandingRequest, imageUrl);
        } else {
            const imageFile = this.landingRef.current && this.landingRef.current.files[0];
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const imageName = `${getAppCode()}/${LANDING_DIR}/${imageFile!.name}`;

            uploadFile(imageFile as File, imageName)
                .then(response => {
                    landingDto = { ...data, imageUrl: response.path } as SaveLandingRequest;
                    if (landingId !== null) {
                        return updateLanding(landingId as number, landingDto);
                    } else {
                        return addLanding(landingDto);
                    }
                })
                .then(response => {
                    const imageUrl = `${this.state?.staticServerUrl}${landingDto?.imageUrl}`;
                    if (landingId !== null) {
                        this.reloadLandings(data as SaveLandingRequest, imageUrl);
                    } else {
                        const { id } = response;
                        const newLandingItem = { ...landingDto, landingId: id, imageUrl };
                        const landings = [...this.state.landings, newLandingItem];
                        this.setState({ landings }, this.closeModal);
                    }
                })
                .catch(error => {
                    alert(IMAGE_UPLOAD_ERROR);
                    console.log(error.message);
                });
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
            : <EmptyMessage />;
    };

    renderModifyModal = () => (
        <CustomModal
            isOpen={this.state.isOpen}
            onRequestClose={this.closeModal}>
            {this.renderModalForm()}
        </CustomModal>
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
                                label={ADD_LANDING_TITLE}
                                font="roboto"
                                type="green"
                            />
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
