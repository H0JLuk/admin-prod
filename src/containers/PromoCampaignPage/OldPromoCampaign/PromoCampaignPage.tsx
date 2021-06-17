import React, { Component } from 'react';
import { Empty, Typography } from 'antd';
import cn from 'classnames';
import { updateTokenLifetime } from '@apiServices';
import {
    createPromoCampaign,
    editPromoCampaign,
    deletePromoCampaign,
    getPromoCampaignList,
    getPromoCampaignStatistics,
    reorderPromoCampaigns,
    uploadPromoCodes
} from '@apiServices/promoCampaignService';
import {
    deletePromoCampaignBanner,
    editPromoCampaignBanner,
    createPromoCampaignBanner
} from '@apiServices/promoCampaignBannerService';
import {
    deletePromoCampaignText,
    editPromoCampaignText,
    createPromoCampaignText
} from '@apiServices/promoCampaignTextService';
import styles from './PromoCampaignPage.module.css';
import { generatePath, match, NavLink, withRouter } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import PromoCampaignList from './PromoCampaignList';
import SavePromoCampaignModal from '@components/CustomModal/SavePromoCampaignModal';
import { IOnSaveState } from '@components/CustomModal/SavePromoCampaignModal/SavePromoCampaignModal';
import SavePromoCampaignBannerModal from '@components/CustomModal/SavePromoCampaignBannerModal/SavePromoCampaignBannerModal';
import SavePromoCampaignTextModal from '@components/CustomModal/SavePromoCampaignTextModal/SavePromoCampaignTextModal';
import PromoCodeStatisticModal from '@components/CustomModal/PromoCodeStatisticModal/PromoCodeStatisticModal';
import UploadPromoCodesModal from '../PromoCampaign/PromoCampaignList/PromoCampaignListItem/PromoCampaignItemMenu/PromoCampaignModalMenu';
import { FloatingButton } from '@components/TooltipButton';
import { PlusOutlined } from '@ant-design/icons';
import { getDzoList } from '@apiServices/dzoService';
import { errorNotice } from '@components/toast/Notice';
import { customNotifications } from '@utils/notifications';
import arrayMove from 'array-move';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { getLinkForPromoCampaignPage, getPathForPromoCampaignVisibititySettings } from '@utils/appNavigation';
import { History, Location } from 'history';
import {
    BannerDto,
    BannerTextDto,
    PromoCampaignDto,
    PromoCampaignStatisticsDto,
    IDzoItem,
    PromoCampaignTextCreateDto,
    PromoCampaignCreateDto,
} from '@types';

const PROMO_CAMPAIGN_LIST_TITLE = 'Промо-кампании';
const LIST_ERROR = 'Не удалось получить список промо-кампаний';
const STATISTICS_ERROR = 'Не удалось получить статистику для промо-кампании';
const ON_PROMOCODES_LOADED = 'Промокоды успешно загружены';
const MODE_CREATE = 'create';
const MODE_BANNER = 'Баннер';
const MODE_TEXT = 'Текст';

const onPromoLoadedWithTextAndBanner = (type: string, promoCampaignName: string, mode: string) => (
    <p>
        {mode} с типом <span className={styles.bold}>{type}</span> успешно загружен для
        <span className={cn(styles.bold, styles.promoCampaignName)}>{promoCampaignName}</span>
    </p>
);

const onPromoCampaignSave = (name: string, mode?: string) => {
    const modeText = mode === 'create' ? 'создана' : 'сохранена';
    const promoCampaignName = name.replace('Промо-кампания', '');
    return (
        <p>
            Промо-кампания <span className={styles.bold}>{promoCampaignName}</span> успешно {modeText}
        </p>
    );
};

const showSuccessNotification = (message: React.ReactNode) => {
    customNotifications.success({
        message,
    });
};

// TODO: change type
const SortableItem = SortableElement((props: any) => <tr {...props} />);
const SortableContainerItems = SortableContainer((props: any) => <tbody {...props} />);

type PromoCampaignPageProps = {
    history: History;
    location: Location;
    match: match;
};

export type PromoCampaignPageState = {
    loading: boolean;
    allDzoList: IDzoItem[];
    currentStatistics?: PromoCampaignStatisticsDto;
    currentPromoCampaign?: PromoCampaignDto;
    currentPromoCampaignBanner?: BannerDto;
    currentPromoCampaignText?: BannerTextDto;
    promoCampaignList: PromoCampaignDto[];
    savePromoCampaignModalOpen: boolean;
    savePromoCampaignBannerModalOpen: boolean;
    savePromoCampaignTextModalOpen: boolean;
    uploadPromoCodesModalOpen: boolean;
    promoCodeStatisticModalOpen: boolean;
    listError: string | null;
    statisticsError: string | null;
    imgDarkBackground: boolean;
};

class PromoCampaignPage extends Component<PromoCampaignPageProps, PromoCampaignPageState> {
    constructor(props: PromoCampaignPageProps) {
        super(props);
        this.state = {
            loading: false,
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

    handleClickStatistics = (promoCampaign: PromoCampaignDto) => {
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
    };

    onBackgroundChange = () => {
        const { imgDarkBackground } = this.state;
        this.setState({ imgDarkBackground: !imgDarkBackground });
    };

    createPromoCampaign = () => {
        this.setState({ currentPromoCampaign: undefined, savePromoCampaignModalOpen: true });
    };

    editPromoCampaign = (currentPromoCampaign: PromoCampaignDto) => {
        this.setState({ savePromoCampaignModalOpen: true, currentPromoCampaign });
    };

    savePromoCampaign = (editedPromoCampaign: PromoCampaignDto | IOnSaveState) => {
        const { currentPromoCampaign } = this.state;
        if (currentPromoCampaign) {
            editPromoCampaign(editedPromoCampaign as PromoCampaignDto)
                .then(() => this.pushToPromoCampaignList(editedPromoCampaign as PromoCampaignDto))
                .then(() => showSuccessNotification(onPromoCampaignSave(editedPromoCampaign.name)))
                .catch(error => errorNotice(error.message));
        } else {
            const newPromoCampaign = { ...editedPromoCampaign, banners: [], texts: [] };
            createPromoCampaign(newPromoCampaign as PromoCampaignCreateDto)
                .then(({ id }) => this.pushToPromoCampaignList({ ...newPromoCampaign, id } as PromoCampaignDto))
                .then(() => showSuccessNotification(onPromoCampaignSave(editedPromoCampaign.name, MODE_CREATE)))
                .catch(error => errorNotice(error.message));
        }
    };

    deletePromoCampaign = (promoCampaign: PromoCampaignDto) => {
        deletePromoCampaign(promoCampaign.id)
            .then(() => {
                let { promoCampaignList } = this.state;
                promoCampaignList = promoCampaignList.filter(pc => pc.id !== promoCampaign.id);
                this.setState({ promoCampaignList });
            }).catch();
    };

    editPromoCampaignVisibilitySettings = (currentPromoCampaign: PromoCampaignDto) => {
        const { history } = this.props;
        const path = getPathForPromoCampaignVisibititySettings();

        history.push(generatePath(path, { promoCampaignId: currentPromoCampaign.id }));
        // history.push(`${match.url}/${currentPromoCampaign.id}/visibility-setting`);
    };

    pushToPromoCampaignList = (promoCampaign: PromoCampaignDto) => {
        let { promoCampaignList, currentPromoCampaign } = this.state;
        if (currentPromoCampaign) {
            promoCampaignList = promoCampaignList.map(pc => {
                if (currentPromoCampaign && pc.id === currentPromoCampaign.id) {
                    return promoCampaign;
                } else {
                    return pc;
                }
            });
        } else {
            promoCampaignList = [...promoCampaignList, promoCampaign];
        }
        this.setState({ promoCampaignList }, () => this.closeSavePromoCampaignModal());

    };

    createPromoCampaignBanner = (currentPromoCampaign: PromoCampaignDto) => {
        this.setState({ currentPromoCampaignBanner: undefined, currentPromoCampaign, savePromoCampaignBannerModalOpen: true });
    };

    editPromoCampaignBanner = (currentPromoCampaignBanner: BannerDto, currentPromoCampaign: PromoCampaignDto) => {
        this.setState({ savePromoCampaignBannerModalOpen: true, currentPromoCampaignBanner, currentPromoCampaign });
    };

    savePromoCampaignBanner = (formData: FormData, type: string) => {
        const { currentPromoCampaignBanner, currentPromoCampaign } = this.state;
        if (currentPromoCampaign) {
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
    };

    pushToPromoCampaignBannerList = (promoCampaignBanner: BannerDto) => {
        const { promoCampaignList, currentPromoCampaign, currentPromoCampaignBanner } = this.state;
        promoCampaignBanner.url = promoCampaignBanner.url + '&' + new Date().getTime();
        if (currentPromoCampaign && currentPromoCampaignBanner) {
            currentPromoCampaign.banners = currentPromoCampaign.banners.filter(banner => banner.id !== currentPromoCampaignBanner.id);
            currentPromoCampaign.banners = [...currentPromoCampaign.banners, promoCampaignBanner];
            promoCampaignList.forEach(pc => { if (pc.id === currentPromoCampaign.id) {
                return currentPromoCampaign;
            } });
        }
        this.setState({ promoCampaignList }, () => this.closeSavePromoCampaignBannerModal());
    };

    deletePromoCampaignBanner = (currentPromoCampaignBanner: BannerDto, currentPromoCampaign: PromoCampaignDto) => {
        deletePromoCampaignBanner(currentPromoCampaignBanner.id)
            .then(() => {
                const { promoCampaignList } = this.state;
                currentPromoCampaign.banners = currentPromoCampaign.banners.filter(banner => banner.id !== currentPromoCampaignBanner.id);
                promoCampaignList.forEach(pc => { if (pc.id === currentPromoCampaign.id) {
                    return currentPromoCampaign;
                } });
                this.setState({ promoCampaignList });
            })
            .catch(error => errorNotice(error.message));
    };
    createPromoCampaignText = (currentPromoCampaign: PromoCampaignDto) => {
        this.setState({ currentPromoCampaignText: undefined, currentPromoCampaign, savePromoCampaignTextModalOpen: true });
    };

    editPromoCampaignText = (currentPromoCampaignText: BannerTextDto, currentPromoCampaign: PromoCampaignDto) => {
        this.setState({ savePromoCampaignTextModalOpen: true, currentPromoCampaignText, currentPromoCampaign });
    };

    deletePromoCampaignText = (currentPromoCampaignText: BannerTextDto, currentPromoCampaign: PromoCampaignDto) => {
        deletePromoCampaignText(currentPromoCampaignText.id)
            .then(() => {
                const { promoCampaignList } = this.state;
                currentPromoCampaign.texts = currentPromoCampaign.texts.filter(text => text.id !== currentPromoCampaignText.id);
                promoCampaignList.forEach(pc => { if (pc.id === currentPromoCampaign.id) {
                    return currentPromoCampaign;
                } });
                this.setState({ promoCampaignList });
            })
            .catch(error => errorNotice(error.message));
    };

    savePromoCampaignText = (editedPromoCampaignText: Omit<PromoCampaignTextCreateDto, 'promoCampaignId'> & { promoCampaignId: number | null; }) => {
        const { currentPromoCampaignText, currentPromoCampaign } = this.state;
        if (currentPromoCampaign) {
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
                createPromoCampaignText(editedPromoCampaignText as PromoCampaignTextCreateDto)
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
    };

    pushToPromoCampaignTextList = (promoCampaignText: BannerTextDto) => {
        const { promoCampaignList, currentPromoCampaign, currentPromoCampaignText } = this.state;
        if (currentPromoCampaignText && currentPromoCampaign) {
            currentPromoCampaign.texts = currentPromoCampaign.texts.filter(text => text.id !== currentPromoCampaignText.id);
            currentPromoCampaign.texts = [...currentPromoCampaign.texts, promoCampaignText];
            promoCampaignList.forEach(pc => { if (pc.id === currentPromoCampaign.id) {
                return currentPromoCampaign;
            }});
        }
        this.setState({ promoCampaignList }, () => this.closeSavePromoCampaignTextModal());
    };

    onPromoCodeUpload = (currentPromoCampaign: PromoCampaignDto) => {
        this.setState({ uploadPromoCodesModalOpen: true, currentPromoCampaign });
    };

    promoCodeUpload = async (data: FormData | Blob) => {
        const { currentPromoCampaign } = this.state;
        try {
            currentPromoCampaign && await uploadPromoCodes(currentPromoCampaign.id, data as Blob);
            this.closeUploadPromoCodesModal();
            return showSuccessNotification(ON_PROMOCODES_LOADED);
        } catch (error) {
            errorNotice(error.message);
        }
    };

    closeSavePromoCampaignModal = () => this.setState({ savePromoCampaignModalOpen: false, currentPromoCampaign: undefined });

    closeSavePromoCampaignBannerModal = () => this.setState({ savePromoCampaignBannerModalOpen: false, currentPromoCampaignBanner: undefined, currentPromoCampaign: undefined });

    closeSavePromoCampaignTextModal = () => this.setState({ savePromoCampaignTextModalOpen: false, currentPromoCampaignText: undefined, currentPromoCampaign: undefined });

    closeUploadPromoCodesModal = () => this.setState({ uploadPromoCodesModalOpen: false, currentPromoCampaign: undefined });

    closePromoCodeStatisticModal = () => this.setState({ promoCodeStatisticModalOpen: false, currentStatistics: undefined, currentPromoCampaign: undefined });

    getDzoById = (dzoId: number) => (this.state.allDzoList.find(item => item.dzoId === dzoId) || {}).dzoName || '';

    getAvailableDzo = () => this.state.allDzoList.filter(item => !item.deleted);

    onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number; }) => {
        const { promoCampaignList } = this.state;
        if (oldIndex !== newIndex) {
            const newData = arrayMove(([] as PromoCampaignDto[]).concat(promoCampaignList), oldIndex, newIndex).filter(el => !!el);
            const idMap: Record<number, number> = {};
            newData.forEach((elem, index) => idMap[elem.id] = index);
            reorderPromoCampaigns(idMap)
                .then(() => this.setState({ promoCampaignList: newData }))
                .catch((error) => errorNotice(error.message));
        }
    };

    DraggableBodyRow = (props: any) => {
        const { promoCampaignList } = this.state;
        if (props['data-row-key']) {
            const index = promoCampaignList.findIndex(x => x.id === props['data-row-key']);
            return <SortableItem index={index} {...props} />;
        } else {
            return <SortableItem {...props} />;
        }
    };

    DraggableContainer = (props: any) => (
        <SortableContainerItems
            useDragHandle
            helperClass={styles.rowDragging}
            onSortEnd={this.onSortEnd}
            {...props}
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
            <div className={styles.promoCampaigns}>
                <div style={{ textAlign: 'center', padding: 10 }}><NavLink to={getLinkForPromoCampaignPage()}>Редизайн</NavLink></div>
                <div className={styles.amListHeader}>
                    <Typography.Text mark strong>{PROMO_CAMPAIGN_LIST_TITLE}</Typography.Text>
                </div>
                {!isEmpty(promoCampaignList) || loading
                    ? <PromoCampaignList
                        loading={loading}
                        promoCampaigns={promoCampaignList}
                        onCreatePromoCampaignBanner={this.createPromoCampaignBanner}
                        onCreatePromoCampaignText={this.createPromoCampaignText}
                        onEditPromoCampaign={this.editPromoCampaign}
                        onEditPromoCampaignBanner={this.editPromoCampaignBanner}
                        onEditPromoCampaignText={this.editPromoCampaignText}
                        onEditPromoCampaignVisibilitySettings={this.editPromoCampaignVisibilitySettings}
                        onDeletePromoCampaign={this.deletePromoCampaign}
                        onDeletePromoCampaignBanner={this.deletePromoCampaignBanner}
                        onDeletePromoCampaignText={this.deletePromoCampaignText}
                        onShowStatistic={this.handleClickStatistics}
                        onPromoCodeUpload={this.onPromoCodeUpload}
                        onGetDzo={this.getDzoById}
                        imgDarkBackground={imgDarkBackground}
                        onBackgroundChange={this.onBackgroundChange}
                        DraggableBodyRow={this.DraggableBodyRow}
                        DraggableContainer={this.DraggableContainer}
                    />
                    : (
                        <Empty
                            description={
                                <span>
                                    Нет промо кампаний, но вы можете
                                    <span className={styles.promoCampaignsLink} onClick={this.createPromoCampaign}> создать новую!</span>
                                </span>
                            }
                        />
                    )}

                <SavePromoCampaignModal
                    title={currentPromoCampaign ? 'Редактирование промо кампании' : 'Добавление промокампании'}
                    editMode={!!currentPromoCampaign}
                    open={savePromoCampaignModalOpen}
                    editingObject={currentPromoCampaign}
                    dzoList={this.getAvailableDzo()}
                    onClose={this.closeSavePromoCampaignModal}
                    onSave={this.savePromoCampaign}
                />

                <SavePromoCampaignBannerModal
                    title={currentPromoCampaignBanner ? 'Редактирование баннера' : 'Добавление баннера'}
                    open={savePromoCampaignBannerModalOpen}
                    editingObject={currentPromoCampaignBanner}
                    currentPromoCampaign={currentPromoCampaign}
                    onClose={this.closeSavePromoCampaignBannerModal}
                    onSave={this.savePromoCampaignBanner}
                />

                <SavePromoCampaignTextModal
                    title={currentPromoCampaignText ? 'Редактирование текста' : 'Добавление текста'}
                    open={savePromoCampaignTextModalOpen}
                    editingObject={currentPromoCampaignText}
                    currentPromoCampaign={currentPromoCampaign}
                    onClose={this.closeSavePromoCampaignTextModal}
                    onSave={this.savePromoCampaignText}
                />

                <PromoCodeStatisticModal
                    title="Статистика использования промокодов"
                    open={promoCodeStatisticModalOpen}
                    data={currentStatistics}
                    currentPromoCampaign={currentPromoCampaign}
                    onClose={this.closePromoCodeStatisticModal}
                />

                <UploadPromoCodesModal
                    title="Загрузить промо-коды"
                    open={uploadPromoCodesModalOpen}
                    currentPromoCampaign={currentPromoCampaign}
                    onClose={this.closeUploadPromoCodesModal}
                    onSave={this.promoCodeUpload}
                />

                <FloatingButton
                    text="Добавление промо кампании"
                    onClick={this.createPromoCampaign}
                    icon={<PlusOutlined />}
                    type="primary"
                />
            </div>
        );
    };

    renderError = (error: Error['message'] | null) => {
        if (!error) {
            return;
        }
        return (
            <div>{error}</div>
        );
    };

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
