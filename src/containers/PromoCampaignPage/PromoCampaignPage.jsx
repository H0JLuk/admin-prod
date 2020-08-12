import React, { Component } from 'react';
import { getPromoCampaignList, getPromoCampaignStatistics } from "../../api/services/promoCampaignService";
import CustomModal from "../../components/CustomModal/CustomModal";
import PromoCampaignItem from "../../components/PromoCampaignItem/PromoCampaignItem";
import styles from './PromoCampaignPage.module.css';
import { withRouter } from "react-router-dom";
import cross from "../../static/images/cross.svg";
import ButtonLabels from "../../components/Button/ButtonLables";

const PROMO_CAMPAIGN_LIST_TITLE = 'Промо-кампании';
const LIST_ERROR = 'Не удалось получить список промо-кампаний';
const STATISTICS_ERROR = 'Не удалось получить статистику для промо-кампании';

class PromoCampaignPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStatistics: null,
            currentPromoCampaign: null,
            promoCampaignList: null,
            isOpen: false,
            listError: null,
            statisticsError: null
        };
    }

    componentDidMount() {
        getPromoCampaignList()
            .then(response => {
                const { promoCampaignDtoList } = response;
                this.setState({ promoCampaignList: promoCampaignDtoList });
            })
            .catch(() => this.setState({ promoCampaignList: null, listError: LIST_ERROR }));
    }

    closeModal = () => this.setState({
        isOpen: false, currentStatistics: null, currentPromoCampaign: null
    });

    handleClickStatistics = (promoCampaign) => {
        this.setState({
            currentPromoCampaign: promoCampaign,
        });
        getPromoCampaignStatistics(promoCampaign.id).then(response => {
            const { promoCampaignStatisticsDto } = response;
            this.setState({
                currentStatistics: promoCampaignStatisticsDto,
                isOpen: true,
            });
        }).catch(() => this.setState({
            currentStatistics: null,
            isOpen: true,
            statisticsError: STATISTICS_ERROR
        }));
    }

    renderStatisticsModal = () => (
        <CustomModal
            isOpen={ this.state.isOpen }
            onRequestClose={ this.closeModal }
        >
            { this.renderError(this.state.statisticsError) }
            { this.renderModalChildren() }
        </CustomModal>
    )

    renderModalChildren = () => {
        if (!this.state.currentPromoCampaign || !this.state.currentStatistics) {
            return;
        }
        const { currentStatistics, currentPromoCampaign } = this.state;
        const currentPromoCodeType = currentPromoCampaign.promoCodeType;
        const { totalPromoCodesNumber, issuedPromoCodesNumber } = currentStatistics;
        const title = currentPromoCampaign.name;
        let description;
        switch (currentPromoCodeType) {
            case 'PERSONAL':
                description = 'В рамках данной промо-кампании любым клиентам выдаются персональные промокоды';
                break;
            case 'PERSONAL_CLIENT_POOL':
                description = 'В рамках данной промо-кампании определенным клиентам выдаются персональные промокоды';
                break;
            case 'COMMON':
                description = 'В рамках данной промо-кампании любым клиентам выдается единый промокод';
                break;
            case 'COMMON_CLIENT_POOL':
                description = 'В рамках данной промо-кампании определенным клиентам клиентам выдается единый промокод';
                break;
            case 'NONE':
                description = 'В рамках данной промо-кампании промокоды не выдаются';
                break;
            default:
                console.error(`Unknown promo code type: ${currentPromoCodeType}`);
        }
        return (
            <div className={ styles.modalForm }>
                <img src={ cross } onClick={ this.closeModal } className={ styles.crossSvg } alt={ ButtonLabels.CLOSE } />
                <div>
                    <h3>{title}</h3>
                    <h5>{description}</h5>
                    { currentPromoCodeType && currentPromoCodeType !== 'NONE' &&
                        <div className={ styles.promoCampaignStatistics }>
                            <table>
                                <tr>
                                    <td><b>Всего промокодов:</b></td>
                                    <td>{ totalPromoCodesNumber }</td>
                                </tr>
                                <tr>
                                    <td><b>Выдано:</b></td>
                                    <td>{ issuedPromoCodesNumber }</td>
                                </tr>
                            </table>
                        </div>
                    }
                </div>
            </div>
        );
    }

    renderPromoCampaignList = () => {
        if (!this.state.promoCampaignList) {
            return;
        }
        const { promoCampaignList } = this.state;
        const promoCampaignItems = promoCampaignList.map( (campaign, i) => {
            return (
                <PromoCampaignItem
                    key={ `promoCampaignItem-${ i }` }
                    dzoId={ campaign.dzoId }
                    id={ campaign.id }
                    name={ campaign.name }
                    promoCodeType={ campaign.promoCodeType }
                    handleStatisticsClick={ () => this.handleClickStatistics(campaign) }
                />);
        });
        return (
            <div>{promoCampaignItems}</div>
        );
    }

    renderError = (error) => {
        if (!error) {
            return;
        }
        return (
            <div className={ styles.error }>{ error }</div>
        );
    }

    render() {
        return (
            <div className={ styles.wrapper }>
                <div className={ styles.promoCampaignPageWrapper }>
                    { this.renderStatisticsModal() }
                    <div className={ styles.headerSection }>
                        <h3>{PROMO_CAMPAIGN_LIST_TITLE}</h3>
                    </div>
                    { this.renderError(this.state.listError) }
                    <div className={ styles.promoCampaignList }>
                        {this.renderPromoCampaignList()}
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(PromoCampaignPage);