import React, { Component } from 'react';
import { Modal } from 'antd';
import _ from 'lodash';

class Confirm extends Component {
    openModal = () => {
        const { onConfirm, text } = this.props;
        return confirm(text, onConfirm);
    };

    render() {
        return (
            <div onClick={ (e) => {
                e && e.stopPropagation();
                this.openModal();
            } } { ...this.props }>
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
    onCancel: _.noop,
});

export default Confirm;