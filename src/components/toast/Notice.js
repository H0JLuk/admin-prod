import { message } from 'antd';


const duration = 2;

export const infoNotice = (msg) => showMessage(msg, message.info);

export const errorNotice = (msg) => showMessage(msg,  message.error);

export const warnNotice = (msg) => showMessage(msg,  message.warn);


const showMessage = (msg, action) => action(msg, duration);