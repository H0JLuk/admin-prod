import React, { Component, Fragment } from 'react';
import { getBannerList } from '../../api/services/adminService';
import PageTemplate from '../PageTemplate/PageTemplate';
import BannerItem from '../../components/BannerItem/BannerItem';
import Button from '../../components/Button/Button';
import styles from './SliderPage.module.css';


const BANNERS_GET_ERROR = 'Ошибка получения слайдов!';
const ADD_BANNER_TITLE = 'Добавить слайд';
const REMOVE_QUESTION = 'Удалить слайд?';
const BANNERS_LIST_TITLE = 'Список слайдов';
const LOADING_LIST_LABEL = 'Загрузка';

const LoadingTitle = () => <p className={styles.loadingLabel}>{LOADING_LIST_LABEL}</p>

class SliderPage extends Component {

    state = {
        formData: null,
        banners: []
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

    renderAddButton = (openModal) => (
        <Button onClick={() => { this.addBannerHandler(openModal) }}
                label={ADD_BANNER_TITLE}
                font="roboto"
                type="green"
        />
    )

    renderForm = (closeModal) => (
        <Fragment>
            Here must be form
            <button onClick={closeModal}>close</button>
        </Fragment>
    )

    renderBannersList = () => {
        const { banners } = this.state
        return (
            <div className={styles.bannerList}>
                {
                    banners.length ?
                        banners.map((banner, i) =>
                            <BannerItem
                                key={`bannerItem-${i}`}
                                handleDelete={this.handleDelete}
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
                renderForm={this.renderForm}
            >
                {this.renderBannersList()}
            </PageTemplate>
        )
    }
}

export default SliderPage
