import React, { Component } from 'react';
import { Empty, Typography, notification } from 'antd';
import cn from 'classnames';
import { updateTokenLifetime } from '../../api/services';
import {
    createPromoCampaign,
    editPromoCampaign,
    deletePromoCampaign,
    getPromoCampaignList,
    getPromoCampaignStatistics,
    reorderPromoCampaigns,
    uploadPromoCodes
} from '../../api/services/promoCampaignService';
import {
    deletePromoCampaignBanner,
    editPromoCampaignBanner,
    createPromoCampaignBanner
} from '../../api/services/promoCampaignBannerService';
import {
    deletePromoCampaignText,
    editPromoCampaignText,
    createPromoCampaignText
} from '../../api/services/promoCampaignTextService';
import styles from './PromoCampaignPage.module.css';
import { NavLink, withRouter } from 'react-router-dom';
import _ from 'lodash';
import { PromoCampaignList } from './PromoCampaignList/PromoCampaignList';
import SavePromoCampaignModal from '../../components/CustomModal/SavePromoCampaignModal/SavePromoCampaignModal';
import SavePromoCampaignBannerModal from '../../components/CustomModal/SavePromoCampaignBannerModal/SavePromoCampaignBannerModal';
import SavePromoCampaignTextModal from '../../components/CustomModal/SavePromoCampaignTextModal/SavePromoCampaignTextModal';
import PromoCodeStatisticModal from '../../components/CustomModal/PromoCodeStatisticModal/PromoCodeStatisticModal';
import UploadPromoCodesModal from '../../components/CustomModal/UploadPromoCodesModal/UploadPromoCodesModal';
import FloatingButton from '../../components/TooltipButton/FloatingButton/FloatingButton';
import { PlusOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import { getDzoList } from '../../api/services/dzoService';
import { errorNotice } from '../../components/toast/Notice';
import arrayMove from 'array-move';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import { getLinkForRedesignPromoCampaign } from '../../utils/appNavigation';

const PROMO_CAMPAIGN_LIST_TITLE = 'Промо-кампании';
const LIST_ERROR = 'Не удалось получить список промо-кампаний';
const STATISTICS_ERROR = 'Не удалось получить статистику для промо-кампании';
const ON_PROMOCODES_LOADED = 'Промокоды успешно загружены';
const MODE_CREATE = 'create';
const MODE_BANNER = 'Баннер';
const MODE_TEXT = 'Текст';

const onPromoLoadedWithTextAndBanner = (type, promoCampaignName, mode) => {
    return (
        <p>
            { mode } с типом <span className={ styles.bold }>{ type }</span> успешно загружен для
            <span className={ cn(styles.bold, styles.promoCampaignName) }>{ promoCampaignName }</span>
        </p>
    );
};

const onPromoCampaignSave = (name, mode) => {
    const modeText = mode === 'create' ? 'создана' : 'сохранена';
    const promoCampaignName = name.replace('Промо-кампания', '');
    return (
        <p>
            Промо-кампания <span className={ styles.bold }>{ promoCampaignName }</span> успешно { modeText }
        </p>
    );
};

const showSuccessNotification = (message) => {
    notification.success({
        duration: 0,
        message,
        placement: 'bottomRight',
    });
};

const SortableItem = sortableElement(props => <tr { ...props } />);
const SortableContainer = sortableContainer(props => <tbody { ...props } />);

class PromoCampaignPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDzoList: [],
            currentStatistics: undefined,
            currentPromoCampaign: undefined,
            currentPromoCampaignBanner: undefined,
            currentPromoCampaignText: undefined,
            promoCampaignList: [],
            savePromoCampaignModalOpen: false,
            savePromoCampaignBannerModalOpen: false,
            savePromoCampaignTextModalOpen: false,
            uploadPromoCodesModalOpen: false,
            promoCodeStatisticModalOpen: false,
            listError: null,
            statisticsError: null,
            imgDarkBackground: false
        };
    }

    componentDidMount() {
        updateTokenLifetime();
        getPromoCampaignList()
            .then(response => {
                const { promoCampaignDtoList } = response;
                this.setState({ promoCampaignList: promoCampaignDtoList });
                return getDzoList();
            }).then(response => {
            const { dzoDtoList } = response;
            this.setState({ allDzoList: dzoDtoList });
        }).catch(() => this.setState({ allDzoList: [], promoCampaignList: [], listError: LIST_ERROR }));
    }

    handleClickStatistics = (promoCampaign) => {
        this.setState({
            currentPromoCampaign: promoCampaign,
        });
        getPromoCampaignStatistics(promoCampaign.id).then(response => {
            const { promoCampaignStatisticsDto } = response;
            this.setState({
                currentStatistics: promoCampaignStatisticsDto,
                promoCodeStatisticModalOpen: true,
            });
        }).catch(() => this.setState({
            currentStatistics: undefined,
            promoCodeStatisticModalOpen: true,
            statisticsError: STATISTICS_ERROR
        }));
    }

    onBackgroundChange = () => {
        const { imgDarkBackground } = this.state;
        this.setState({ imgDarkBackground: !imgDarkBackground });
    }

    createPromoCampaign = () => {
        this.setState({ currentPromoCampaign: undefined, savePromoCampaignModalOpen: true });
    }

    editPromoCampaign = (currentPromoCampaign) => {
        this.setState({ savePromoCampaignModalOpen: true, currentPromoCampaign });
    }

    savePromoCampaign = (editedPromoCampaign) => {
        const { currentPromoCampaign } = this.state;
        if (currentPromoCampaign) {
            editPromoCampaign(editedPromoCampaign)
                .then(() => this.pushToPromoCampaignList(editedPromoCampaign))
                .then(() => showSuccessNotification(onPromoCampaignSave(editedPromoCampaign.name)))
                .catch(error => errorNotice(error.message));
        } else {
            const newPromoCampaign = { ...editedPromoCampaign, promoCampaignBanners: [], promoCampaignTexts: [] };
            createPromoCampaign(newPromoCampaign)
                .then(({ id }) => this.pushToPromoCampaignList({ ...newPromoCampaign, id }))
                .then(() => showSuccessNotification(onPromoCampaignSave(editedPromoCampaign.name, MODE_CREATE)))
                .catch(error => errorNotice(error.message));
        }
    }

    deletePromoCampaign = (promoCampaign) => {
        deletePromoCampaign(promoCampaign.id)
            .then(() => {
                let { promoCampaignList } = this.state;
                promoCampaignList = promoCampaignList.filter(pc => pc.id !== promoCampaign.id);
                this.setState({ promoCampaignList });
            }).catch();
    }

    editPromoCampaignVisibilitySettings = (currentPromoCampaign) => {
        const { history, match } = this.props;

        history.push(`${match.url}/${currentPromoCampaign.id}/visibility-setting`);
    }

    pushToPromoCampaignList = (promoCampaign) => {
        let { promoCampaignList, currentPromoCampaign } = this.state;
        if (currentPromoCampaign) {
            promoCampaignList = promoCampaignList.map(pc => {
                if (pc.id === currentPromoCampaign.id) {
                    return promoCampaign;
                } else {
                    return pc;
                }
            });
        } else {
            promoCampaignList = [...promoCampaignList, promoCampaign];
        }
        this.setState({ promoCampaignList }, () => this.closeSavePromoCampaignModal());

    }

    createPromoCampaignBanner = (currentPromoCampaign) => {
        this.setState({ currentPromoCampaignBanner: undefined, currentPromoCampaign, savePromoCampaignBannerModalOpen: true });
    }

    editPromoCampaignBanner = (currentPromoCampaignBanner, currentPromoCampaign) => {
        this.setState({ savePromoCampaignBannerModalOpen: true, currentPromoCampaignBanner, currentPromoCampaign });
    }

    savePromoCampaignBanner = (formData, type) => {
        const { currentPromoCampaignBanner, currentPromoCampaign } = this.state;
        if (currentPromoCampaignBanner) {
            editPromoCampaignBanner(currentPromoCampaignBanner.id, formData)
                .then(banner => this.pushToPromoCampaignBannerList(banner))
                .then(() => showSuccessNotification(onPromoLoadedWithTextAndBanner(type, currentPromoCampaign.name, MODE_BANNER)))
                .catch(error => errorNotice(error.message));
        } else {
            createPromoCampaignBanner(formData)
                .then(banner => this.pushToPromoCampaignBannerList(banner))
                .then(() => showSuccessNotification(onPromoLoadedWithTextAndBanner(type, currentPromoCampaign.name, MODE_BANNER)))
                .catch(error => errorNotice(error.message));
        }
    }

    pushToPromoCampaignBannerList = (promoCampaignBanner) => {
        const { promoCampaignList, currentPromoCampaign, currentPromoCampaignBanner } = this.state;
        promoCampaignBanner.url = promoCampaignBanner.url + '&' + new Date().getTime();
        if (currentPromoCampaignBanner) {
            currentPromoCampaign.promoCampaignBanners = currentPromoCampaign.promoCampaignBanners.filter(banner => banner.id !== currentPromoCampaignBanner.id);
        }
        currentPromoCampaign.promoCampaignBanners = [...currentPromoCampaign.promoCampaignBanners, promoCampaignBanner];
        promoCampaignList.forEach(pc =>  { if (pc.id === currentPromoCampaign.id) {
            return currentPromoCampaign;
        } });
        this.setState({ promoCampaignList }, () => this.closeSavePromoCampaignBannerModal());
    }

    deletePromoCampaignBanner = (currentPromoCampaignBanner, currentPromoCampaign) => {
        deletePromoCampaignBanner(currentPromoCampaignBanner.id)
            .then(() => {
                const { promoCampaignList } = this.state;
                currentPromoCampaign.promoCampaignBanners = currentPromoCampaign.promoCampaignBanners.filter(banner => banner.id !== currentPromoCampaignBanner.id);
                promoCampaignList.forEach(pc =>  { if (pc.id === currentPromoCampaign.id) {
                    return currentPromoCampaign;
                } });
                this.setState({ promoCampaignList });
            })
            .catch(error => errorNotice(error.message));
    }
    createPromoCampaignText = (currentPromoCampaign) => {
        this.setState({ currentPromoCampaignText: undefined, currentPromoCampaign, savePromoCampaignTextModalOpen: true });
    }

    editPromoCampaignText = (currentPromoCampaignText, currentPromoCampaign) => {
        this.setState({ savePromoCampaignTextModalOpen: true, currentPromoCampaignText, currentPromoCampaign });
    }

    deletePromoCampaignText = (currentPromoCampaignText, currentPromoCampaign) => {
        deletePromoCampaignText(currentPromoCampaignText.id)
            .then(() => {
                const { promoCampaignList } = this.state;
                currentPromoCampaign.promoCampaignTexts = currentPromoCampaign.promoCampaignTexts.filter(text => text.id !== currentPromoCampaignText.id);
                promoCampaignList.forEach(pc =>  { if (pc.id === currentPromoCampaign.id) {
                    return currentPromoCampaign;
                } });
                this.setState({ promoCampaignList });
            })
            .catch(error => errorNotice(error.message));
    }

    savePromoCampaignText = (editedPromoCampaignText) => {
        const { currentPromoCampaignText, currentPromoCampaign } = this.state;
        if (currentPromoCampaignText) {
            editPromoCampaignText(currentPromoCampaignText.id, editedPromoCampaignText)
                .then((text) => this.pushToPromoCampaignTextList(text))
                .then(() =>
                    showSuccessNotification(
                        onPromoLoadedWithTextAndBanner(
                            editedPromoCampaignText.type,
                            currentPromoCampaign.name,
                            MODE_TEXT
                        )
                    )
                )
                .catch((error) => errorNotice(error.message));
        } else {
            createPromoCampaignText(editedPromoCampaignText)
                .then((text) => this.pushToPromoCampaignTextList(text))
                .then(() =>
                    showSuccessNotification(
                        onPromoLoadedWithTextAndBanner(
                            editedPromoCampaignText.type,
                            currentPromoCampaign.name,
                            MODE_TEXT
                        )
                    )
                )
                .catch((error) => errorNotice(error.message));
        }
    }

    pushToPromoCampaignTextList = (promoCampaignText) => {
        const { promoCampaignList, currentPromoCampaign, currentPromoCampaignText } = this.state;
        if (currentPromoCampaignText) {
            currentPromoCampaign.promoCampaignTexts = currentPromoCampaign.promoCampaignTexts.filter(text => text.id !== currentPromoCampaignText.id);
        }
        currentPromoCampaign.promoCampaignTexts = [...currentPromoCampaign.promoCampaignTexts, promoCampaignText];
        promoCampaignList.forEach(pc =>  { if (pc.id === currentPromoCampaign.id) {
            return currentPromoCampaign;
        }});
        this.setState({ promoCampaignList }, () => this.closeSavePromoCampaignTextModal());
    }

    onPromoCodeUpload = (currentPromoCampaign) => {
        this.setState({ uploadPromoCodesModalOpen: true, currentPromoCampaign });
    }

    promoCodeUpload = (data) => {
        const { currentPromoCampaign } = this.state;
        uploadPromoCodes(currentPromoCampaign.id, data)
            .then(() => this.closeUploadPromoCodesModal())
            .then(()=> showSuccessNotification(ON_PROMOCODES_LOADED))
            .catch(error => errorNotice(error.message));
    }

    closeSavePromoCampaignModal = () => this.setState({ savePromoCampaignModalOpen: false, currentPromoCampaign: undefined })

    closeSavePromoCampaignBannerModal = () => this.setState({ savePromoCampaignBannerModalOpen: false, currentPromoCampaignBanner: undefined, currentPromoCampaign: undefined })

    closeSavePromoCampaignTextModal = () => this.setState({ savePromoCampaignTextModalOpen: false, currentPromoCampaignText: undefined, currentPromoCampaign: undefined })

    closeUploadPromoCodesModal = () => this.setState({ uploadPromoCodesModalOpen: false, currentPromoCampaign: undefined })

    closePromoCodeStatisticModal = () => this.setState({ promoCodeStatisticModalOpen: false, currentStatistics: null, currentPromoCampaign: undefined })

    getDzoById = (dzoId) => this.state.allDzoList.find(item => item.dzoId === dzoId).dzoName

    getAvailableDzo = () => this.state.allDzoList.filter(item => !item.isDeleted);

    onSortEnd = ({ oldIndex, newIndex }) => {
        const { promoCampaignList } = this.state;
        if (oldIndex !== newIndex) {
            const newData = arrayMove([].concat(promoCampaignList), oldIndex, newIndex).filter(el => !!el);
            const idMap = {};
            newData.forEach((elem, index) => idMap[elem.id] = index);
            reorderPromoCampaigns(idMap)
                .then(() => this.setState({ promoCampaignList: newData }))
                .catch((error) => errorNotice(error.message));
        }
    };

    DraggableBodyRow = (props) => {
        const { promoCampaignList } = this.state;
        if (props['data-row-key']) {
            const index = promoCampaignList.findIndex(x => x.id === props['data-row-key']);
            return <SortableItem index={ index } { ...props } />;
        } else {
            return <SortableItem { ...props } />;
        }
    };

    DraggableContainer = props => (
        <SortableContainer
            useDragHandle
            helperClass={ styles.rowDragging }
            onSortEnd={ this.onSortEnd }
            { ...props }
        />
    );

    renderPromoCampaignList = () => {
        const {
            loading,
            promoCampaignList,
            savePromoCampaignModalOpen,
            savePromoCampaignBannerModalOpen,
            savePromoCampaignTextModalOpen,
            uploadPromoCodesModalOpen,
            promoCodeStatisticModalOpen,
            currentPromoCampaign,
            currentPromoCampaignBanner,
            currentPromoCampaignText,
            currentStatistics,
            imgDarkBackground
        } = this.state;
        return (
            <div className={ styles.promoCampaigns }>
                <div style={ { textAlign: 'center', padding: 10 } }><NavLink to={ getLinkForRedesignPromoCampaign() }>Редизайн</NavLink></div>
                <div className={ styles.amListHeader }>
                    <Typography.Text mark strong>{PROMO_CAMPAIGN_LIST_TITLE}</Typography.Text>
                </div>
                {!_.isEmpty(promoCampaignList) || loading
                    ? <PromoCampaignList
                        loading={ loading }
                        promoCampaigns={ promoCampaignList }
                        onCreatePromoCampaignBanner={ this.createPromoCampaignBanner }
                        onCreatePromoCampaignText={ this.createPromoCampaignText }
                        onEditPromoCampaign={ this.editPromoCampaign }
                        onEditPromoCampaignBanner={ this.editPromoCampaignBanner }
                        onEditPromoCampaignText={ this.editPromoCampaignText }
                        onEditPromoCampaignVisibilitySettings={ this.editPromoCampaignVisibilitySettings }
                        onDeletePromoCampaign={ this.deletePromoCampaign }
                        onDeletePromoCampaignBanner={ this.deletePromoCampaignBanner }
                        onDeletePromoCampaignText={ this.deletePromoCampaignText }
                        onShowStatistic={ this.handleClickStatistics }
                        onPromoCodeUpload={ this.onPromoCodeUpload }
                        onGetDzo={ this.getDzoById }
                        imgDarkBackground={ imgDarkBackground }
                        onBackgroundChange={ this.onBackgroundChange }
                        DraggableBodyRow={ this.DraggableBodyRow }
                        DraggableContainer={ this.DraggableContainer }
                    />
                    : <Empty description={
                        <span>Нет промо кампаний, но вы можете <span className={ styles.promoCampaignsLink }
                                                                     onClick={ this.createPromoCampaign }> создать новую!</span> </span>
                    } />}

                <SavePromoCampaignModal
                    title={ currentPromoCampaign ? 'Редактирование промо кампании' : 'Добавление промокампании' }
                    editMode={ !!currentPromoCampaign }
                    open={ savePromoCampaignModalOpen }
                    editingObject={ currentPromoCampaign }
                    dzoList={ this.getAvailableDzo() }
                    onClose={ this.closeSavePromoCampaignModal }
                    onSave={ this.savePromoCampaign }
                />

                <SavePromoCampaignBannerModal
                    title={ currentPromoCampaignBanner ? 'Редактирование баннера' : 'Добавление баннера' }
                    open={ savePromoCampaignBannerModalOpen }
                    editingObject={ currentPromoCampaignBanner }
                    currentPromoCampaign={ currentPromoCampaign }
                    onClose={ this.closeSavePromoCampaignBannerModal }
                    onSave={ this.savePromoCampaignBanner }
                />

                <SavePromoCampaignTextModal
                    title={ currentPromoCampaignText ? 'Редактирование текста' : 'Добавление текста' }
                    open={ savePromoCampaignTextModalOpen }
                    editingObject={ currentPromoCampaignText }
                    currentPromoCampaign={ currentPromoCampaign }
                    onClose={ this.closeSavePromoCampaignTextModal }
                    onSave={ this.savePromoCampaignText }
                />

                <PromoCodeStatisticModal
                    title="Статистика использования промокодов"
                    open={ promoCodeStatisticModalOpen }
                    data={ currentStatistics }
                    currentPromoCampaign={ currentPromoCampaign }
                    onClose={ this.closePromoCodeStatisticModal }
                />

                <UploadPromoCodesModal
                    title="Загрузить промо-коды"
                    open={ uploadPromoCodesModalOpen }
                    currentPromoCampaign={ currentPromoCampaign }
                    onClose={ this.closeUploadPromoCodesModal }
                    onSave={ this.promoCodeUpload }
                />

                <FloatingButton text="Добавление промо кампании"
                                onClick={ this.createPromoCampaign }
                                icon={ <PlusOutlined /> }
                                type="primary"
                />
            </div>
        );
    }

    renderError = (error) => {
        if (!error) {
            return;
        }
        return (
            <div>{error}</div>
        );
    }

    render() {
        return (
            <div>
                {this.renderError(this.state.listError)}
                <div>
                    {this.renderPromoCampaignList()}
                </div>
            </div>
        );
    }
}

export default withRouter(PromoCampaignPage);