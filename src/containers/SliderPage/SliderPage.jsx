import React, { Component, Fragment } from 'react';
import {
    addBanner,
    deleteBanner,
    getBannerList, getDzoDtoList,
    getStaticServerUrl,
    updateBanner,
    uploadFile
} from '../../api/services/adminService';
import {SLIDER_EDIT_FORM} from '../../components/Form/forms';
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
const CHOOSE_DZO_PLEASE = 'Пожалуйста выберите ДЗО!';
const BANNER_DIR = 'banner/';

const LoadingStatus = ({ loading }) => (
    <p className={styles.loadingLabel}>{ loading ? LOADING_LIST_LABEL : BANNERS_GET_ERROR }</p>
)

class SliderPage extends Component {
    constructor(props) {
        super(props);
        this.bannerRef = React.createRef();
        this.state = {
            editingBannerIdx: null,
            editingDzoId: 0,
            editingBannerUrl: null,
            editingDzoName: null,
            banners: [],
            dzoDtoList: [],
            isOpen: false,
            formError: null,
            staticServerUrl: null
        };

        this.handleChangeDzo = this.handleChangeDzo.bind(this)
    }

    componentDidMount() {
        getStaticServerUrl().then(response => {
            const serverUrl = response
            this.setState({ staticServerUrl: serverUrl })
        }).catch(() => {
            this.setState({ staticServerUrl: null })
        })
        getDzoDtoList().then(response => {
            const { dzoDtoList } = response
            this.setState({ dzoDtoList: dzoDtoList })
        }).catch(() => {
            this.setState({ dzoDtoList: [] })
        })
        getBannerList().then(response => {
            const { bannerDtoList } = response
            this.setState({ banners: bannerDtoList })
        }).catch(() => {
            this.setState({ banners: null })
        })
    }

    openModal = () => { this.setState({ isOpen: true }) }

    closeModal = () => { this.setState({ isOpen: false }) }

    getDzoName = (dzoId) => {
        const dzo = this.state.dzoDtoList.filter((elem) => (dzoId === elem.dzoId))
        let dzoName = null
        if (dzo != null && dzo[0] != null) {
            dzoName = dzo[0].dzoName
        }
        return dzoName
    }

    handleDelete = (id) => {
        if (window.confirm(REMOVE_QUESTION)) {
            deleteBanner(id).then(() => {
                const croppedBanners = this.state.banners.filter(banner => banner.bannerId !== id)
                this.setState({ banners: croppedBanners })
            }).catch(() => { alert(BANNERS_DELETE_ERROR) })
        }
    }

    handleEdit = (id, dzoId, url) => {
        const dzoName = this.getDzoName(dzoId)
        this.setState({
                editingBannerIdx: id,
                editingDzoId: dzoId.toString(),
                editingBannerUrl: url,
                editingDzoName: dzoName
        }, () => { this.openModal() })
    }

    handleChangeDzo(event) {
        const dzoName = this.getDzoName(parseInt(event.target.value, 10))
        this.setState({ editingDzoId: event.target.value, editingDzoName: dzoName })
    }

    renderModalForm = () => {
        const {formError, editingBannerIdx, editingDzoId, editingBannerUrl, editingDzoName} = this.state;
        const formData = editingBannerIdx !== null ? populateFormWithData(SLIDER_EDIT_FORM, {
            bannerId: editingBannerIdx,
            dzoId: editingDzoId,
            bannerUrl: editingBannerUrl,
            dzoName: editingDzoName
        }) : SLIDER_EDIT_FORM;
        return (
            <div className={styles.modalForm}>
                <img src={cross} onClick={this.closeModal} className={styles.crossSvg} alt="Закрыть" />
                <Form
                    data={formData}
                    buttonText='Сохранить'
                    onSubmit={this.onSubmit}
                    formClassName={styles.loginForm}
                    fieldClassName={styles.loginForm__field}
                    activeLabelClassName={styles.loginForm__field__activeLabel}
                    buttonClassName={styles.loginForm__button}
                    errorText={getErrorText(formError)}
                    formError={!!formError}
                    errorClassName={styles.error}
                />
                <form className={styles.loginForm}>
                    <label className={styles.loginForm}>
                        <span>ДЗО: </span>
                        <select value={this.state.editingDzoId} onChange={this.handleChangeDzo}>
                            <option id={0} key={0} value={0}></option>
                            {this.state.dzoDtoList.map(option => {
                                return <option id={option} key={option.dzoId} value={option.dzoId}>{option.dzoName}</option>
                            })}
                        </select>
                    </label>
                </form>
                <form className={styles.imageUploadContainer}>
                    <label htmlFor="bannerImageInput">Изображение баннера</label>
                    <input type="file" id="bannerImageInput" ref={this.bannerRef} className={styles.imageUpload} />
                </form>
            </div>
        )
    }

    reloadBanners = (url, dzoId) => {
        const banners = this.state.banners.slice()
        banners.forEach(banner => {
            if (banner.bannerId === this.state.editingBannerIdx) {
                banner.bannerUrl = url
                banner.dzoId = dzoId
                banner.dzoName = this.state.editingDzoName
            }
        })
        this.setState({banners: banners, isOpen: false})
    }

    onSubmit = () => {
        if (!this.bannerRef.current.files.length && (this.state.editingBannerUrl == null || !this.state.editingBannerUrl.length)) {     // on create case!
            alert(UPLOAD_IMAGE_PLEASE);
            return;
        }
        if (this.state.editingDzoId === null || this.state.editingDzoId === '0') {
            alert(CHOOSE_DZO_PLEASE);
            return;
        }
        let bannerDto;
        if (this.state.editingBannerIdx !== null && !this.bannerRef.current.files.length) {
            bannerDto = {
                dzoId: this.state.editingDzoId,
                bannerUrl: this.state.editingBannerUrl.slice(this.state.staticServerUrl.length)
            }
            updateBanner(this.state.editingBannerIdx, bannerDto)
                .catch(error => {
                    console.log(error.message)
                })
            this.reloadBanners(this.state.editingBannerUrl, this.state.editingDzoId)
        } else {
            const imageFile = this.bannerRef.current.files[0];
            const imageName = BANNER_DIR + imageFile.name;

            uploadFile(imageFile, imageName)
                .then(response => {
                    bannerDto = {bannerUrl: response.path, dzoId: this.state.editingDzoId}
                    if (this.state.editingBannerIdx !== null) {
                        return updateBanner(this.state.editingBannerIdx, bannerDto)
                    } else {
                        return addBanner(bannerDto)
                    }
                })
                .then(response => {
                    if (this.state.editingBannerIdx !== null) {
                        this.reloadBanners(this.state.staticServerUrl + bannerDto.bannerUrl)
                    } else {
                        const {id: bannerId = 0} = response
                        const newBannerItem = {
                            bannerId,
                            bannerUrl: this.state.staticServerUrl + bannerDto.bannerUrl,
                            dzoName: this.state.editingDzoName,
                            dzoId: this.state.editingDzoId
                        }
                        const banners = [...this.state.banners, newBannerItem]
                        this.setState({banners, isOpen: false})
                    }
                })
                .catch(error => {
                    console.log(error.message)
                })
        }
    }

    renderBannersList = () => {
        const { banners } = this.state
        const isSuccess = Array.isArray(banners)
        return (
            <Fragment>
                {
                    isSuccess ? (
                        banners.length ?
                            banners.map((banner, i) => {
                                const dzo = this.state.dzoDtoList.filter((elem) => (banner.dzoId === elem.dzoId))
                                let dzoName = null
                                if (dzo != null && dzo[0] != null) {
                                    dzoName = dzo[0].dzoName
                                }
                                banner.dzoId = parseInt(banner.dzoId, 10)
                                return <BannerItem
                                    key={`bannerItem-${i}`}
                                    handleDelete={this.handleDelete}
                                    handleEdit={this.handleEdit}
                                    dzoName={dzoName}
                                    {...banner}
                                />
                            }) : <LoadingStatus loading />
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
        const openWithParam = () => { this.setState({
            editingBannerIdx: null,
            editingDzoId: 0,
            editingBannerUrl: null,
            editingDzoName: null
        }, this.openModal) }
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
