import React, { useState } from 'react';
import { Col, Row } from 'antd';
import { TextBlock, ImageBlock } from './TemplateBlocks';
import { INFO_ROWS, IRow } from './templateConstants';
import { PromoCampaignDto } from '@types';

import styles from './Template.module.css';

type ITemplateProps = Pick<PromoCampaignDto, 'banners' | 'type' | 'texts'>;

const getBanners = (banners: ITemplateProps['banners']) => banners.reduce<Record<string, string>>(
    (result, { type, url }) => ({ ...result, [type]: url }),
    {}
);

const getTexts = (texts: ITemplateProps['texts']) => texts.reduce<Record<string, string>>((result, { type, value }) => {
    if (Object.prototype.hasOwnProperty.call(result, type)) {
        return result;
    }
    return { ...result, [type]: value };
}, {});

const Template: React.FC<ITemplateProps>= ({ banners, texts, type }) => {
    const [filteredBanners] = useState(() => getBanners(banners));
    const [filteredTexts] = useState(() => getTexts(texts));
    const [infoRows] = useState<IRow[]>(INFO_ROWS[type] || []);

    return infoRows.map((row, index) => (
        <Row
            key={index}
            className={styles.row}
            gutter={16}
        >
            {Object.keys(row).map((key) => (
                <Col
                    key={key}
                    className={styles.col}
                    span={12}
                >
                    {['banner', 'logo'].includes(row[key].type) && (
                        <ImageBlock
                            label={row[key].label}
                            type={row[key].type}
                            src={filteredBanners[key]}
                        />
                    )}
                    {row[key]?.type === 'text' && (
                        <TextBlock
                            label={row[key].label}
                            text={filteredTexts[key]}
                        />
                    )}
                </Col>
            ))}
        </Row>
    )) as Exclude<React.ReactNode, null | undefined | boolean | React.ReactFragment>;
};

export default Template;
