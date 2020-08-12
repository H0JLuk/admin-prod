import React, { Component, Fragment } from 'react';
import { uploadFile } from '../../api/services/adminService';
import {
    addBanner,
    deleteBanner,
    getBannerList,
    updateBanner
} from '../../api/services/bannerService';
import { getDzoList } from '../../api/services/dzoService';
import { getStaticUrl } from '../../api/services/settingsService';
import { getErrorText } from '../../constants/errors';
import CustomModal from '../../components/CustomModal/CustomModal';
import BannerItem from '../../components/BannerItem/BannerItem';
import Form from '../../components/Form/Form';
import Button from '../../components/Button/Button';
import cross from '../../static/images/cross.svg';
import styles from './SliderPage.module.css';
import ButtonLabels from '../../components/Button/ButtonLables';
import { getAppCode } from '../../api/services/sessionService';


const BANNERS_GET_ERROR = 'Ошибка получения слайдов!';
const BANNERS_DELETE_ERROR = 'Ошибка удаления слайда!';
const IMAGE_UPLOAD_ERROR = 'Ошибка загрузки изображения!';
const ADD_BANNER_TITLE = 'Добавить слайд';
const REMOVE_QUESTION = 'Удалить слайд?';
const BANNERS_LIST_TITLE = 'Список слайдов';
const LOADING_LIST_LABEL = 'Загрузка';
const UPLOAD_IMAGE_PLEASE = 'Пожалуйста загрузите изображение!';
const CHOOSE_DZO_PLEASE = 'Пожалуйста выберите ДЗО!';
const BANNER_DIR = 'banner';

const LoadingStatus = ({ loading }) => (
    <p className={ styles.loadingLabel }>{ loading ? LOADING_LIST_LABEL : BANNERS_GET_ERROR }</p>
);

class SliderPage extends Component {
    constructor(props) {
        super(props);
        this.bannerRef = React.createRef();
        this.state = {
            editingBanner: {
                id: null,
                url: null,
                dzoId: '',
                dzoName: null,
            },
            banners: [],
            dzoList: [],
            isOpen: false,
            formError: null,
            staticServerUrl: getStaticUrl()
        };

        this.handleChangeDzo = this.handleChangeDzo.bind(this);
    }

    componentDidMount() {
        getDzoList().then(response => {
            const { dzoDtoList } = response;
            this.setState({ dzoList: dzoDtoList });
            return getBannerList();
        }).then(response => {
            const { bannerDtoList } = response;
            this.setState({ banners: bannerDtoList });
        }).catch(() => {
            this.setState({ dzoList: [], banners: [], staticServerUrl: null });
        });
    }

    clearState = () => {
        this.setState({ editingBanner: { id: null, dzoId: '', url: null, dzoName: null } });
    };

    openModal = () => { this.setState({ isOpen: true }); };

    closeModal = () => { this.setState({ isOpen: false }, this.clearState); };

    handleDelete = (id) => {
        if (window.confirm(REMOVE_QUESTION)) {
            deleteBanner(id).then(() => {
                const croppedBanners = this.state.banners.filter(banner => banner.bannerId !== id);
                this.setState({ banners: croppedBanners });
            }).catch(() => { alert(BANNERS_DELETE_ERROR); });
        }
    };

    handleEdit = (id, dzoId, url, dzoName) => {
        this.setState({ editingBanner: { id, dzoId, url, dzoName } }, () => { this.openModal(); });
    };

    handleChangeDzo(event) {
        const { options, selectedIndex, value: dzoId } = event.target;
        const dzoName = options[selectedIndex].text;
        this.setState(prevState => ({ editingBanner: { ...prevState.editingBanner, dzoId, dzoName } }));
    }

    renderModalForm = () => {
        const { formError } = this.state;
        const formData = {};
        return (
            <div className={ styles.modalForm }>
                <img src={ cross } onClick={ this.closeModal } className={ styles.crossSvg } alt={ ButtonLabels.CLOSE } />
                <Form
                    data={ formData }
                    buttonText={ ButtonLabels.SAVE }
                    onSubmit={ this.onSubmit }
                    formClassName={ styles.sliderForm }
                    fieldClassName={ styles.sliderForm__field }
                    activeLabelClassName={ styles.sliderForm__field__activeLabel }
                    buttonClassName={ styles.sliderForm__button }
                    errorText={ getErrorText(formError) }
                    formError={ !!formError }
                    errorClassName={ styles.error }
                />
                <form className={ styles.sliderForm }>
                    <label className={ styles.sliderForm }>
                        <span>ДЗО: </span>
                        <select value={ this.state.editingBanner.dzoId } onChange={ this.handleChangeDzo }>
                            <option id={ 0 } key="dzo_0" value={ null }> </option>
                            { this.state.dzoList.map(option => {
                                return <option id={ option } key={ `dzo_${option.dzoId}` } value={ option.dzoId }>{option.dzoName}</option>;
                            })}
                        </select>
                    </label>
                </form>
                <form className={ styles.imageUploadContainer }>
                    <label htmlFor="bannerImageInput">Изображение баннера</label>
                    <input type="file" id="bannerImageInput" ref={ this.bannerRef } className={ styles.imageUpload } />
                </form>
            </div>
        );
    };

    reloadBanners = (url, dzoId) => {
        const banners = this.state.banners.slice();
        banners.forEach(banner => {
            if (banner.bannerId === this.state.editingBanner.id) {
                if (this.bannerRef.current.files.length > 0 && banner.bannerUrl === url) {
                    banner.bannerUrl = '';
                    this.setState(banners);
                }
                banner.bannerUrl = url;
                banner.dzoId = dzoId;
                banner.dzoName = this.state.editingBanner.dzoName;
            }
        });
        this.setState({ banners }, this.closeModal);
    };

    onSubmit = () => {
        if (!this.bannerRef.current.files.length && !this.state.editingBanner.url) {
            alert(UPLOAD_IMAGE_PLEASE);
            return;
        }
        if (!this.state.editingBanner.dzoId) {
            alert(CHOOSE_DZO_PLEASE);
            return;
        }
        let bannerDto;
        if (this.state.editingBanner.id !== null && !this.bannerRef.current.files.length) {
            bannerDto = {
                dzoId: this.state.editingBanner.dzoId,
                bannerUrl: this.state.editingBanner.url.slice(this.state.staticServerUrl.length)
            };
            updateBanner(this.state.editingBanner.id, bannerDto)
                .catch(error => {
                    console.log(error.message);
                });
            this.reloadBanners(this.state.editingBanner.url, this.state.editingBanner.dzoId);
        } else {
            const imageFile = this.bannerRef.current.files[0];
            const imageName = `${getAppCode()}/${BANNER_DIR}/${imageFile.name}`;

            uploadFile(imageFile, imageName)
                .then(response => {
                    bannerDto = { bannerUrl: response.path, dzoId: this.state.editingBanner.dzoId };
                    if (this.state.editingBanner.id !== null) {
                        return updateBanner(this.state.editingBanner.id, bannerDto);
                    } else {
                        return addBanner(bannerDto);
                    }
                })
                .then(response => {
                    if (this.state.editingBanner.id !== null) {
                        this.reloadBanners(this.state.staticServerUrl + bannerDto.bannerUrl, this.state.editingBanner.dzoId);
                    } else {
                        const { id } = response;
                        const newBannerItem = {
                            bannerId: id,
                            bannerUrl: this.state.staticServerUrl + bannerDto.bannerUrl,
                            dzoName: this.state.editingBanner.dzoName,
                            dzoId: this.state.editingBanner.dzoId
                        };
                        const banners = [...this.state.banners, newBannerItem];
                        this.setState({ banners }, this.closeModal);
                    }
                })
                .catch(error => {
                    alert(IMAGE_UPLOAD_ERROR);
                    console.log(error.message);
                });
        }
    };

    renderBannersList = () => {
        const { banners } = this.state;
        const isSuccess = Array.isArray(banners);
        return (
            <Fragment>
                {
                    isSuccess ? (
                        banners.length ?
                            banners.map((banner, i) =>
                                <BannerItem
                                    key={ `bannerItem-${i}` }
                                    handleDelete={ this.handleDelete }
                                    handleEdit={ this.handleEdit }
                                    { ...banner }
                                />
                            ) : <LoadingStatus loading />
                    ) : <LoadingStatus />
                }
            </Fragment>
        );
    };

    renderModifyModal = () => (
        <CustomModal
            isOpen={ this.state.isOpen }
            onRequestClose={ this.closeModal }>
            {this.renderModalForm()}
        </CustomModal>
    );

    render() {
        const openWithParam = () => {
            this.openModal();
        };
        return (
            <div className={ styles.sliderPageWrapper }>
                { this.renderModifyModal() }
                <div className={ styles.headerSection }>
                    <h3>{BANNERS_LIST_TITLE}</h3>
                    <div>
                        <Button
                            onClick={ openWithParam }
                            label={ ADD_BANNER_TITLE }
                            font="roboto"
                            type="green"
                        />
                    </div>
                </div>
                <div className={ styles.bannerList }>
                    {this.renderBannersList()}
                </div>
            </div>
        );
    }
}

export default SliderPage;
