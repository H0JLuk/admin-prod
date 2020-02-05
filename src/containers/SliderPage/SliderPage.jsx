import React, { Component, Fragment } from 'react';
import { getBannerList } from '../../api/services/adminService';
import PageTemplate from '../PageTemplate/PageTemplate';
import BannerItem from '../../components/BannerItem/BannerItem';
import Button from '../../components/Button/Button';
import styles from './SliderPage.module.css';
import {LOGIN_FORM, SLIDER_EDIT_FROM} from '../../components/Form/forms';
import {getErrorText} from '../../constants/errors';
import Form from '../../components/Form/Form';


const BANNERS_GET_ERROR = 'Ошибка получения слайдов!';
const ADD_BANNER_TITLE = 'Добавить слайд';
const REMOVE_QUESTION = 'Удалить слайд?';
const BANNERS_LIST_TITLE = 'Список слайдов';
const LOADING_LIST_LABEL = 'Загрузка';

const LoadingTitle = () => <p className={styles.loadingLabel}>{LOADING_LIST_LABEL}</p>

class SliderPage extends Component {
    constructor(props) {
        super(props);
        this.bannerRef = React.createRef();
    }

    state = {
        formData: null,
        banners: [],
        formError: null
    }

    componentDidMount() {
        getBannerList().then(response => {
            const { bannerDtoList = [] } = response
            this.setState({ banners: bannerDtoList })
        }).catch(error => {
            alert(BANNERS_GET_ERROR)
            console.error(error.message)
        })
    }

    addBannerHandler = (openModal) => {
        // ...some prepare before form display
        openModal()
    }

    handleDelete = (id) => {
        if (window.confirm(REMOVE_QUESTION)) {
            console.log(`Deleting banner ${id}`)
        }
    }

    handleEdit = (id, openModal) => {
        console.log('Opened form edit', id)
        openModal()
    }

    renderAddButton = (openModal) => (
        <Button onClick={() => { this.addBannerHandler(openModal) }}
                label={ADD_BANNER_TITLE}
                font="roboto"
                type="green"
        />
    )

    renderForm = (closeModal) => {
        const {formError} = this.state;
        return (
            <div style={{ position: "relative" }}>
                <Form
                    data={SLIDER_EDIT_FROM}
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
                <form>
                    <input type="file" ref={this.bannerRef} />
                </form>
                <button onClick={closeModal}>close</button>
            </div>
        )
    }

    onSubmit = (data) => {
        console.log(data);
        console.log(this.bannerRef.current.files[0].name);

        new Promise((resolve) => {
            setTimeout(() => { resolve('/super/image/ulr') }, 1000)
        }).then((url) => {
            data['text'] = url;
            console.log(data);
        })
    }

    renderBannersList = (openModal) => {
        const { banners } = this.state
        const handleEdit = (bannerId) => this.handleEdit(bannerId, openModal)
        return (
            <div className={styles.bannerList}>
                {
                    banners.length ?
                        banners.map((banner, i) =>
                            <BannerItem
                                key={`bannerItem-${i}`}
                                handleDelete={this.handleDelete}
                                handleEdit={handleEdit}
                                {...banner}
                            />
                        ) : <LoadingTitle/>
                }
            </div>
        )
    }

    render() {
        return (
            <PageTemplate
                pageTitle={BANNERS_LIST_TITLE}
                renderAddButton={this.renderAddButton}
                renderChildren={this.renderBannersList}
                renderForm={this.renderForm}
            />
        )
    }
}

export default SliderPage
