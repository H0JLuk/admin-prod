import React from 'react';
import { Form, Input } from 'antd';
import { showCount } from '../../../../../../../constants/common';

import styles from './TextBlock.module.css';

const TextBlock = ({
    title,
    placeholder,
    rows = 3,
    maxLength = null,
    rules,
    name,
    initialValue = '',
}) => {

    return (
        <div className={ styles.textBlock }>
            <Form.Item
                label={ title }
                name={ name }
                initialValue={ initialValue }
                rules={ rules }
            >
                <Input.TextArea
                    maxLength={ maxLength || null }
                    placeholder={ placeholder }
                    rows={ rows }
                    className={ styles.textArea }
                    showCount={ maxLength && showCount }
                />
            </Form.Item>

        </div>
    );
};

export default TextBlock;
