import React, { Component } from 'react';
import { Modal } from 'antd';
import noop from 'lodash/noop';

class Confirm extends Component {
    openModal = () => {
        const { onConfirm, text } = this.props;
        return confirm(text, onConfirm);
    };

    render() {
        // eslint-disable-next-line no-unused-vars
        const { onConfirm, ...props } = this.props;

        return (
            <div onClick={ (e) => {
                e && e.stopPropagation();
                this.openModal();
            } } { ...props }>
                {this.props.children}
            </div>
        );
    }
}

const confirm = (text, onConfirm) => Modal.confirm({
    title: text,
    content: '',
    okText: 'Да',
    cancelText: 'Нет',
    onOk: onConfirm,
    onCancel: noop,
});

export default Confirm;