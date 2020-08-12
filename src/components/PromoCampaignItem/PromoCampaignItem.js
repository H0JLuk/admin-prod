import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styles from './PromoCampaignItem.module.css';
import Button from '../Button/Button';
import ButtonLabels from '../Button/ButtonLables';

function PromoCampaignItem({ webUrl, name, handleStatisticsClick }) {
    return (
        <div className={ styles.promoCampaignItem }>
            <div className={ styles.descrWrapper }>
                <div className={ styles.fieldsWrapper }>
                    <p><b>Название:</b> { `"${ name }"` }</p>
                    { webUrl &&
                        <p><b>URL:</b> { `"${ webUrl }"` }</p>
                    }
                </div>
                <div className={ styles.promoCampaignItemActions }>
                    <Button
                        type="blue"
                        label={ ButtonLabels.STATISTICS }
                        onClick={ () => handleStatisticsClick() }
                    />
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