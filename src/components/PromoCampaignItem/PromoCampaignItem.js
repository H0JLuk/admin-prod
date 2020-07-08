import React, { memo } from "react";
import PropTypes from 'prop-types';
import styles from './PromoCampaignItem.module.css';
import Button from "../Button/Button";
import { STATISTICS } from "../Button/ButtonLables";

function PromoCampaignItem(props) {
    return (
        <div className={ styles.promoCampaignItem }>
            <div className={ styles.descrWrapper }>
                <div className={ styles.fieldsWrapper }>
                    <p><b>Название:</b> {`"${props.name}"`}</p>
                    {props.webUrl &&
                    <p><b>URL:</b> {`"${props.webUrl}"`}</p>
                    }
                </div>
                <div className={ styles.promoCampaignItemActions }>
                    <Button type="blue" label={ STATISTICS } onClick={ () => props.handleStatisticsClick() } />
                </div>
            </div>
        </div>
    );
}

PromoCampaignItem.propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    webUrl: PropTypes.string,
    dzoId: PropTypes.number.isRequired,
    promoCodeType: PropTypes.string.isRequired,
    handleStatisticsClick: PropTypes.func.isRequired,
};

export default memo(PromoCampaignItem);