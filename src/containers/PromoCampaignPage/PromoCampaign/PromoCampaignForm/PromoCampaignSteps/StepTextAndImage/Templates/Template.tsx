import React, { useState } from 'react';
import { BannerCreateDto, BannerCreateTextDto } from '@types';
import { Col, FormItemProps, Row } from 'antd';
import UploadPicture from '@components/UploadPicture/UploadPicture';
import { getLabel } from '@components/LabelWithTooltip/LabelWithTooltip';
import TextBlock from '../TextBlock';
import { INFO_ROWS, INFO_ROWS_KEYS, TemplateRowsValues } from './templateConstants';
import { BUTTON_TEXT } from '@constants/common';

import styles from './Template.module.css';

export type TemplateProps = {
    banners: BannerCreateDto;
    texts: BannerCreateTextDto;
    type: INFO_ROWS_KEYS;
    onRemoveImg: (name: FormItemProps['name']) => void;
    isCopy?: boolean;
};

const Template: React.FC<TemplateProps> = ({ banners, texts, type, onRemoveImg, isCopy }) => {
    const [infoRows] = useState<Record<string, TemplateRowsValues>[]>(INFO_ROWS[type] || []);

    return infoRows.map((row, index) => (
        <Row
            key={index}
            className={styles.row}
            gutter={[16, 32]}
        >
            {Object.keys(row).map((key) => (
                <Col
                    key={key}
                    className={styles.col}
                    span={12}
                >
                    {(row[key].type === 'banner' || row[key].type === 'logo') && (
                        <UploadPicture
                            description={row[key].description}
                            setting={row[key].setting}
                            accept={row[key].access_type}
                            name={['banners', key]}
                            initialValue={banners[key] as string}
                            rules={row[key].rules}
                            onRemoveImg={onRemoveImg}
                            type={row[key].type}
                            label={getLabel(row[key].title, row[key].tooltipImg, true)}
                            uploadButtonText={BUTTON_TEXT.ADD}
                            maxFileSize={row[key].maxSize}
                            validateFileSize={!isCopy}
                            footer
                        />
                    )}
                    {row[key].type === 'text' && (
                        <TextBlock
                            title={row[key].title}
                            placeholder={row[key].placeholder}
                            maxLength={row[key]?.maxLength}
                            rules={row[key].rules}
                            name={['texts', key]}
                            initialValue={texts[key]}
                        />
                    )}
                </Col>
            ))}
        </Row>
    )) as Exclude<React.ReactNode, null | undefined | boolean | React.ReactFragment>;
};

export default Template;
