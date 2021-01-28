import React, { useState, useCallback } from 'react';
import { Form, Input } from 'antd';

import styles from './TextBlock.module.css';

const ENDS_WORD = 'Осталось символов';

const TextBlock = ({
    title,
    placeholder,
    rows = 3,
    maxLength = null,
    rules,
    name,
    initialValue = '',
}) => {
    const [text, setText] = useState(initialValue);

    const onChange = useCallback(({ target: { value } }) => setText(value), []);
    const charactersLeft = maxLength - text.length;

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
                    onChange={ onChange }
                />
            </Form.Item>
            { maxLength && (
                <div className={ styles.detail }>
                    { ENDS_WORD } { charactersLeft >= 0 ? charactersLeft : 0 }
                </div>
            ) }
        </div>
    );
};

export default TextBlock;
