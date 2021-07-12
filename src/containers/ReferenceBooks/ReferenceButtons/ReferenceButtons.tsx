import React from 'react';
import { Button } from 'antd';
import { BUTTON_TEXT } from '@constants/common';

type ButtonProps = {
    mode: string;
    onCancel: () => void;
    onDelete: () => void;
    form: string;
};

const ReferenceButtons: React.FC<ButtonProps> = ({ mode, onCancel, onDelete, form }) => {
    const SubmitButton = (
        <Button
            htmlType="submit"
            form={form}
            type="primary"
        >
            {mode === 'add' ? BUTTON_TEXT.ADD : BUTTON_TEXT.SAVE}
        </Button>
    );

    const CancelButton = (
        <Button onClick={onCancel}>
            {BUTTON_TEXT.CANCEL}
        </Button>
    );

    switch (mode) {
        case 'add':
            return (
                <>
                    {CancelButton}
                    {SubmitButton}
                </>
            );

        case 'edit':
            return (
                <>
                    {SubmitButton}
                    {CancelButton}
                    <Button type="primary" danger onClick={onDelete}>
                        {BUTTON_TEXT.DELETE}
                    </Button>
                </>
            );

        default:
            return null;
    }
};

export default ReferenceButtons;
