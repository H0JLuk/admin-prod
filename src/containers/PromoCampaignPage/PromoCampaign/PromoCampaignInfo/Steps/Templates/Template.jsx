import React, { useState } from 'react';
import { Col, Row } from 'antd';
import { TextBlock, ImageBlock } from './TemplateBlocks';
import { INFO_ROWS } from './templateConstants';

import styles from './Template.module.css';

const getBanners = (banners) => banners.reduce(
    (result, { type, url }) => ({ ...result, [type]: url }),
    {}
);

const getTexts = (texts) => texts.reduce((result, { type, value }) => {
    if (Object.prototype.hasOwnProperty.call(result, type)) {
        return result;
    }
    return { ...result, [type]: value };
}, {});

const Template = ({ banners, texts, type }) => {
    const [filteredBanners] = useState(() => getBanners(banners));
    const [filteredTexts] = useState(() => getTexts(texts));
    const [infoRows] = useState(INFO_ROWS[type] || []);

    return infoRows.map((row, index) => (
        <Row
            key={ index }
            className={ styles.row }
            gutter={ [16] }
        >
            { Object.keys(row).map((key) => (
                <Col
                    key={ key }
                    className={ styles.col }
                    span={ 12 }
                >
                    { ['banner', 'logo'].includes(row[key].type) && (
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
