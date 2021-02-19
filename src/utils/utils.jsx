
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import React from 'react';

export function highlightSearchingText(value = '', searchValue = '', highlightClassName) {
    if (!searchValue || !value) {
        return <span>{ value }</span>;
    }

    const newValue = [];
    const index = value
        .trim()
        .toLocaleUpperCase()
        .indexOf(
            searchValue
                .trim()
                .toLocaleUpperCase()
            );

    if (index + 1) {
        newValue.push(value.substring(0, index));
        newValue.push(
            <span key={ index } className={ highlightClassName }>
                { value.substring(index, index + searchValue.length) }
            </span>
        );
        newValue.push(value.substring(index + searchValue.length));
    } else {
        newValue.push(value);
    }

    return <span>{ newValue }</span>;
}

export function getStringOptionValue({ parentName = '', name = '' } = {}) {
    if (!parentName) {
        return name ?? '';
    }

    return [parentName, name].join(', ');
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * @param {import('antd/lib/modal').ModalFuncProps} data
 */
export function confirmModal({
    onOk,
    title = 'Вы уверены?',
    icon: customIcon,
    content = '',
    okText = 'Да',
    cancelText = 'Отмена',
    centered = true,
    ...restOptions
}) {
    const icon = customIcon ? customIcon : <ExclamationCircleOutlined />;
    Modal.confirm({ onOk, title, icon, content, okText, cancelText, centered, ...restOptions });
}

/**
 * @param {import('antd/lib/modal').ModalFuncProps} data
 */
export function successModal({
    onOk,
    title = 'Готово',
    okText = 'ОК',
    cancelText = 'Отмена',
    centered = true,
    cancelButtonProps = { hidden: true },
    maskClosable = false,
    ...restOptions
}) {
    Modal.success({ onOk, title, okText, cancelText, centered, cancelButtonProps, maskClosable, ...restOptions });
}

/**
 * @param {import('antd/lib/modal').ModalFuncProps} data
 */
export function errorModal({
    onOk,
    title = 'Готово',
    okText = 'ОК',
    cancelText = 'Отмена',
    centered = true,
    cancelButtonProps = { hidden: true },
    maskClosable = false,
    ...restOptions
}) {
    Modal.error({ onOk, title, okText, cancelText, centered, cancelButtonProps, maskClosable, ...restOptions });
}