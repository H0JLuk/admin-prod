import React from 'react';
import ReactDOM from 'react-dom';
import noop from 'lodash/noop';
import { Button, notification } from 'antd';
import { ArgsProps, NotificationInstance } from 'antd/lib/notification';

class Notifications {
    noticeKeys: string[] = [];

    btnContainerNode: HTMLDivElement;

    constructor() {
        this.btnContainerNode = document.createElement('div');
        this.btnContainerNode.setAttribute('id', 'container-for-clearAll');
        document.body.appendChild(this.btnContainerNode);

        this.closeAll = this.closeAll.bind(this);
    }

    private showNotification(
        { onClose, style = {}, ...rest } = {} as ArgsProps,
        action: NotificationInstance['open']
    ) {
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

    private onCloseNotice(noticeKey: string, callback: () => void = noop) {
        this.noticeKeys = this.noticeKeys.filter(key => noticeKey !== key);
        callback();
        this.renderClearBtn();
    }

    open(args: ArgsProps) {
        this.showNotification(args, notification.open);
    }
    success(args: ArgsProps) {
        this.showNotification(args, notification.success);
    }
    info(args: ArgsProps) {
        this.showNotification(args, notification.info);
    }
    warning(args: ArgsProps) {
        this.showNotification(args, notification.warning);
    }
    error(args: ArgsProps) {
        this.showNotification(args, notification.error);
    }

    closeAll() {
        this.noticeKeys.forEach(notification.close);
        this.noticeKeys = [];
        this.renderClearBtn();
    }

    private renderClearBtn() {
        ReactDOM.render(
            this.noticeKeys.length > 1 ? (
                <Button onClick={this.closeAll} type="primary">
                    Очистить все
                </Button>
            ) : <></>,
            this.btnContainerNode
        );
    }
}

export const customNotifications = new Notifications();
