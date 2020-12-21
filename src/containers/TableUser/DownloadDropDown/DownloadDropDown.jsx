import React, { useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { templateLink } from '../../../utils/helper';

import styles from './DownloadDropDown.module.css';

const DOWNLOAD_TEMPLATE = 'Скачать шаблон';
const DOWNLOAD_LOAD_TEMPLATE = 'Для загрузки';
const DOWNLOAD_DELETE_TEMPLATE = 'Для удаления';

const DownloadDropDown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    const toggleOpen = useCallback(() => setIsOpen((state) => !state), []);

    const closeWhenClickOutside = useCallback((e) => {
        if (!ref.current?.contains(e.target)) {
            setIsOpen(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('click', closeWhenClickOutside);
        } else {
            document.removeEventListener('click', closeWhenClickOutside);
        }

        return () => document.removeEventListener('click', closeWhenClickOutside);
    }, [isOpen, closeWhenClickOutside]);

    return (
        <div className={ styles.dropdown } ref={ ref }>
            <Button
                className={ cn(styles.dropdownButton, { [styles.dropdownActive]: isOpen }) }
                onClick={ toggleOpen }
            >
                { DOWNLOAD_TEMPLATE } { !isOpen ? <DownOutlined /> : <UpOutlined />}
            </Button>
            <div className={ cn(styles.dropdownMenu, { [styles.open]: isOpen }) }>
                <div className={ styles.dropdownLinkWrapper }>
                    <a href={ templateLink('user-upload.xlsx') }>
                        { DOWNLOAD_LOAD_TEMPLATE }
                    </a>
                    <a href={ templateLink('user-delete.xlsx') }>
                        { DOWNLOAD_DELETE_TEMPLATE }
                    </a>
                </div>
            </div>
        </div>
    );
};

export default DownloadDropDown;
