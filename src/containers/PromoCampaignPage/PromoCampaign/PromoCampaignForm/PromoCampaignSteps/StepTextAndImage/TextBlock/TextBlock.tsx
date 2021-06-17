import React from 'react';
import { Form, FormItemProps, Input } from 'antd';
import { showCount } from '@constants/common';

import styles from './TextBlock.module.css';

export type TextBlockProps = {
    title: string;
    placeholder?: string;
    rows?: number;
    maxLength?: number;
    rules: FormItemProps['rules'];
    name: FormItemProps['name'];
    initialValue: string;
};

const TextBlock: React.FC<TextBlockProps> = ({
    title,
    placeholder,
    rows = 3,
    maxLength = null,
    rules,
    name,
    initialValue = '',
}) => (
    <div className={styles.textBlock}>
        <Form.Item
            label={title}
            name={name}
            initialValue={initialValue}
            rules={rules}
            validateFirst
        >
            <Input.TextArea
                maxLength={(maxLength || null) as number}
                placeholder={placeholder}
                rows={rows}
                className={styles.textArea}
                showCount={maxLength ? showCount : false}
            />
        </Form.Item>

    </div>
);

export default TextBlock;
