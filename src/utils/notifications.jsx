import React from 'react';
import ReactDOM from 'react-dom';
import noop from 'lodash/noop';
import { Button, notification } from 'antd';

class Notifications {
    /** @type {string[]} */
    noticeKeys = [];

    /** @type {HTMLDivElement} */
    btnContainerNode;

    constructor() {
        this.btnContainerNode = document.createElement('div');
        this.btnContainerNode.setAttribute('id', 'container-for-clearAll');
        document.body.appendChild(this.btnContainerNode);

        ['success', 'info', 'warning', 'error', 'open'].forEach(type => {
            this[type] = function(args) {
                this.showNotification(args, notification[type]);
            };
        });

        this.closeAll = this.closeAll.bind(this);
    }

    /**
     * @param {import('antd/lib/notification').ArgsProps} args
     * @param {import('antd/lib/notification').NotificationInstance['open']} action
     */
    showNotification({ onClose, style = {}, ...rest } = {}, action) {
        const key = `key_${Date.now()}`;
        this.noticeKeys.push(key);
        action({
            key,
            duration: 0,
            onClose: () => this.onCloseNotice(key, onClose),
            style: { width: '400px', ...style },
            ...rest,
        });
        this.renderClearBtn();
    }

    /**
     * @param {string} noticeKey
     * @param {() => void} callback
     */
    onCloseNotice(noticeKey, callback = noop) {
        this.noticeKeys = this.noticeKeys.filter(key => noticeKey !== key);
        callback();
        this.renderClearBtn();
    }

    closeAll() {
        this.noticeKeys.forEach(notification.close);
        this.noticeKeys = [];
        this.renderClearBtn();
    }

    renderClearBtn() {
        ReactDOM.render(
            this.noticeKeys.length > 1 ? (
                <Button onClick={ this.closeAll } type="primary">
                    Очистить все
                </Button>
            ) : null,
            this.btnContainerNode
        );
    }
}

/**
 * @typedef {object} NotificationsMethods
 * @prop {import('antd/lib/notification').NotificationInstance['success']} success
 * @prop {import('antd/lib/notification').NotificationInstance['info']} info
 * @prop {import('antd/lib/notification').NotificationInstance['warning']} warning
 * @prop {import('antd/lib/notification').NotificationInstance['error']} error
 * @prop {import('antd/lib/notification').NotificationInstance['open']} open
 * @prop {() => void} closeAll
 * @prop {string[]} noticeKeys
 */

/** @type {NotificationsMethods} */
export const customNotifications = new Notifications();
