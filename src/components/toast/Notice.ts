import { message } from 'antd';
import React from 'react';

type Action = typeof message.info | typeof message.error | typeof message.warn;

const duration = 6;

export const infoNotice = (msg: React.ReactNode) => showMessage(msg, message.info);

export const errorNotice = (msg: React.ReactNode) => showMessage(msg, message.error);

export const warnNotice = (msg: React.ReactNode) => showMessage(msg, message.warn);


const showMessage = (msg: React.ReactNode, action: Action) => action(msg, duration);
