import React, { Component } from 'react';
import { Modal } from 'antd';
import noop from 'lodash/noop';

export type ConfirmProps = {
    onConfirm: () => void;
    text: React.ReactNode;
};

class Confirm extends Component<ConfirmProps> {
    openModal = () => {
        const { onConfirm, text } = this.props;
        return confirm(text, onConfirm);
    };

    render() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { onConfirm, ...props } = this.props;

        return (
            <div
                onClick={
                    (e: React.MouseEvent<HTMLDivElement>) => {
                        e.stopPropagation();
                        this.openModal();
                    }
                }
                {...props}
            >
                {this.props.children}
            </div>
        );
    }
}

const confirm = (text: ConfirmProps['text'], onConfirm: ConfirmProps['onConfirm']) => Modal.confirm({
    title: text,
    content: '',
    okText: 'Да',
    cancelText: 'Нет',
    onOk: onConfirm,
    onCancel: noop,
});

export default Confirm;
