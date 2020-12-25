import React, { useState, useEffect } from 'react';
import { Col, Row } from 'antd';
import { TextBlock, ImageBlock } from './TemplateBlocks';
import { INFO_ROWS } from './templateConstants';

import styles from './Template.module.css';

const Template = ({ banners, texts, type }) => {
    const [filteredBanners, setFilteredBanners] = useState({});
    const [filteredTexts, setFilteredTexts] = useState({});
    const [infoRows, setInfoRows] = useState([]);

    useEffect(() => {
        const resultBanners = banners.reduce((result, { type, url }) => {
            if (Object.prototype.hasOwnProperty.call(result, type)) {
                return result;
            }
            return { ...result, [type]: url };
        }, {});
        const resultTexts = texts.reduce((result, { type, value }) => {
            if (Object.prototype.hasOwnProperty.call(result, type)) {
                return result;
            }
            return { ...result, [type]: value };
        }, {});

        setInfoRows(INFO_ROWS[type] || []);
        setFilteredBanners(resultBanners);
        setFilteredTexts(resultTexts);
    }, [banners, texts, type]);

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
                    { ['image', 'icon'].includes(row[key].type) && (
                        <ImageBlock
                            label={ row[key].label }
                            type={ row[key].type }
                            src={ filteredBanners[key] }
                        />
                    ) }
                    { row[key].type === 'text' && (
                        <TextBlock
                            label={ row[key].label }
                            text={ filteredTexts[key] }
                        />
                    ) }
                </Col>
            )) }
        </Row>
    ));
};

export default Template;