import React, { Component, Fragment } from 'react';
import {addBanner, deleteBanner, getBannerList, uploadFile} from '../../api/services/adminService';
import {SLIDER_EDIT_FROM} from '../../components/Form/forms';
import {getErrorText} from '../../constants/errors';
import CustomModal from '../../components/CustomModal/CustomModal';
import BannerItem from '../../components/BannerItem/BannerItem';
import Form from '../../components/Form/Form';
import Button from '../../components/Button/Button';
import cross from '../../static/images/cross.svg';
import styles from './SliderPage.module.css';
import {populateFormWithData} from "../../components/Form/formHelper"


const BANNERS_GET_ERROR = 'Ошибка получения слайдов!';
const BANNERS_DELETE_ERROR = 'Ошибка удаления слайда!';
const ADD_BANNER_TITLE = 'Добавить слайд';
const REMOVE_QUESTION = 'Удалить слайд?';
const BANNERS_LIST_TITLE = 'Список слайдов';
const LOADING_LIST_LABEL = 'Загрузка';
const UPLOAD_IMAGE_PLEASE = 'Пожалуйста загрузите изображение!';

const LoadingStatus = ({ loading }) => (
    <p className={styles.loadingLabel}>{ loading ? LOADING_LIST_LABEL : BANNERS_GET_ERROR }</p>
)

class SliderPage extends Component {
    constructor(props) {
        super(props);
        this.bannerRef = React.createRef();
        this.state = {
            editingBannerIdx: null,
            banners: [],
            isOpen: false,
            formError: null
        }
    }

    componentDidMount() {
        getBannerList().then(response => {
            const { bannerDtoList } = response
            this.setState({ banners: bannerDtoList })
        }).catch(() => {
            this.setState({ banners: null })
        })
    }

    openModal = () => { this.setState({ isOpen: true }) }

    closeModal = () => { this.setState({ isOpen: false }) }

    handleDelete = (id) => {
        if (window.confirm(REMOVE_QUESTION)) {
            deleteBanner(id).then(() => {
                const croppedBanners = this.state.banners.filter(banner => banner.bannerId !== id)
                this.setState({ banners: croppedBanners })
            }).catch(() => { alert(BANNERS_DELETE_ERROR) })
        }
    }

    handleEdit = (id) => {
        this.setState({ editingBannerIdx: id }, () => { this.openModal() })
    }

    renderModalForm = () => {
        const {formError, editingBannerIdx} = this.state;
        const formData = editingBannerIdx !== null ? populateFormWithData(SLIDER_EDIT_FROM, {
            dzoId: editingBannerIdx
        }) : SLIDER_EDIT_FROM;
        return (
            <div className={styles.modalForm}>
                <img src={cross} onClick={this.closeModal} className={styles.crossSvg} alt="Закрыть" />
                <Form
                    data={formData}
                    buttonText='Вход'
                    onSubmit={this.onSubmit}
                    formClassName={styles.loginForm}
                    fieldClassName={styles.loginForm__field}
                    activeLabelClassName={styles.loginForm__field__activeLabel}
                    buttonClassName={styles.loginForm__button}
                    errorText={getErrorText(formError)}
                    formError={!!formError}
                    errorClassName={styles.error}
                />
                <form className={styles.imageUploadContainer}>
                    <label htmlFor="bannerImageInput">Изображение баннера</label>
                    <input type="file" id="bannerImageInput" ref={this.bannerRef} className={styles.imageUpload} />
                </form>
            </div>
        )
    }

    // TODO write method on update slider
    onSubmit = (data) => {
        if (!this.bannerRef.current.files.length) {     // on create case!
            alert(UPLOAD_IMAGE_PLEASE);
            return;
        }

        const imageFile = this.bannerRef.current.files[0];
        const imageName = imageFile.name;
        let bannerDto;

        uploadFile(imageFile, imageName)
            .then(response => {
                bannerDto = {...data, bannerUrl: response.path}
                return addBanner(bannerDto)
            })
            .then(response => {
                const {id: bannerId = 0} = response
                const newBannerItem = {...bannerDto, bannerId}
                const banners = [newBannerItem, ...this.state.banners]
                this.setState({banners, isOpen: false})
            })
            .catch(error => {
                console.log(error.message)
            })
    }

    renderBannersList = () => {
        const { banners } = this.state
        const isSuccess = Array.isArray(banners)
        return (
            <Fragment>
                {
                    isSuccess ? (
                        banners.length ?
                            banners.map((banner, i) =>
                                <BannerItem
                                    key={`bannerItem-${i}`}
                                    handleDelete={this.handleDelete}
                                    handleEdit={this.handleEdit}
                                    {...banner}
                                />
                            ) : <LoadingStatus loading />
                    ) : <LoadingStatus />
                }
            </Fragment>
        )
    }

    renderModifyModal = () => (
        <CustomModal
            isOpen={this.state.isOpen}
            onRequestClose={this.closeModal}>
            {this.renderModalForm()}
        </CustomModal>
    )

    render() {
        const openWithParam = () => { this.setState({ editingBannerIdx: null }, this.openModal) }
        return (
            <div className={styles.sliderPageWrapper}>
                { this.renderModifyModal() }
                <div className={styles.headerSection}>
                    <h3>{BANNERS_LIST_TITLE}</h3>
                    <div>
                        <Button
                            onClick={openWithParam}
                            label={ADD_BANNER_TITLE}
                            font="roboto"
                            type="green"
                        />
                    </div>
                </div>
                <div className={styles.bannerList}>
                    {this.renderBannersList()}
                </div>
            </div>
        )
    }
}

export default SliderPage
