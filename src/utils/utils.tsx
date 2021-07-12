import React from 'react';
import { DEFAULT_SLEEP_TIME } from '@constants/common';
import { Modal, ModalFuncProps } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export function highlightSearchingText(value = '', searchValue = '', highlightClassName = '') {
    if (!searchValue || !value) {
        return <span>{value}</span>;
    }

    const newValue = [];
    const index = value
        .trim()
        .toLocaleUpperCase()
        .indexOf(
            searchValue
                .trim()
                .toLocaleUpperCase(),
        );

    if (index + 1) {
        newValue.push(value.substring(0, index));
        newValue.push(
            <span key={index} className={highlightClassName}>
                {value.substring(index, index + searchValue.length)}
            </span>,
        );
        newValue.push(value.substring(index + searchValue.length));
    } else {
        newValue.push(value);
    }

    return <span>{newValue}</span>;
}

export async function requestsWithMinWait<T>(promise: Promise<T>, minWait = DEFAULT_SLEEP_TIME): Promise<T> {
    const [result] = await Promise.all([promise, sleep(minWait)]);
    return result;
}

export function getStringOptionValue({ parentName = '', name = '' } = {}) {
    if (!parentName) {
        return name ?? '';
    }

    return [parentName, name].join(', ');
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function confirmModal({
    onOk,
    title = 'Вы уверены?',
    icon: customIcon,
    content = '',
    okText = 'Да',
    cancelText = 'Отмена',
    centered = true,
    ...restOptions
}: ModalFuncProps) {
    const icon = customIcon ? customIcon : <ExclamationCircleOutlined />;
    Modal.confirm({ onOk, title, icon, content, okText, cancelText, centered, ...restOptions });
}

export function successModal({
    onOk,
    title = 'Готово',
    okText = 'ОК',
    cancelText = 'Отмена',
    centered = true,
    cancelButtonProps = { hidden: true },
    maskClosable = false,
    ...restOptions
}: ModalFuncProps) {
    Modal.success({ onOk, title, okText, cancelText, centered, cancelButtonProps, maskClosable, ...restOptions });
}

export function errorModal({
    onOk,
    title = 'Готово',
    okText = 'ОК',
    cancelText = 'Отмена',
    centered = true,
    cancelButtonProps = { hidden: true },
    maskClosable = false,
    ...restOptions
}: ModalFuncProps) {
    Modal.error({ onOk, title, okText, cancelText, centered, cancelButtonProps, maskClosable, ...restOptions });
}
