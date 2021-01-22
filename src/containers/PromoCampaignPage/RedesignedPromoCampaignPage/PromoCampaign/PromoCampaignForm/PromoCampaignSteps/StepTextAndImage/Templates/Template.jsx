import React, { useState, useEffect } from 'react';
import { Col, Row } from 'antd';
import UploadFile from '../../StepLanding/FormControllers/UploadFile/UploadFile';
import { getLabel } from '../../../../../../../../components/LabelWithTooltipImg/LabelWithTooltipImg';
import TextBlock from '../TextBlock/TextBlock';
import { INFO_ROWS } from './templateConstants';

import styles from './Template.module.css';

const ADD = 'Добавить';

const Template = ({ banners, texts, type, onRemoveImg }) => {
    const [infoRows, setInfoRows] = useState([]);

    useEffect(() => {
        setInfoRows(INFO_ROWS[type] || []);
    }, [type]);

    return infoRows.map((row, index) => (
        <Row
            key={ index }
            className={ styles.row }
            gutter={ [16, 32] }
        >
            { Object.keys(row).map((key) => (
                <Col
                    key={ key }
                    className={ styles.col }
                    span={ 12 }
                >
                    { ['logo', 'banner'].includes(row[key].type) && (
                        <UploadFile
                            description={ row[key].description }
                            setting={ row[key].setting }
                            accept={ row[key].access_type }
                            name={ ['promoCampaignBanners', key] }
                            initialValue={ banners[key] }
                            rules={ row[key].rules }
                            onRemoveImg={ onRemoveImg }
                            type={ row[key].type }
                            label={ getLabel(row[key].title, row[key].tooltipImg) }
                            uploadButtonText={ ADD }
                            footer
                        />
                    ) }
                    { row[key].type === 'text' && (
                        <TextBlock
                            title={ row[key].title }
                            placeholder={ row[key].placeholder }
                            maxLength={ row[key]?.maxLength }
                            rules={ row[key].rules }
                            name={ ['promoCampaignTexts', key] }
                            initialValue={ texts[key] }
                        />
                    ) }
                </Col>
            )) }
        </Row>
    ));
};

export default Template;