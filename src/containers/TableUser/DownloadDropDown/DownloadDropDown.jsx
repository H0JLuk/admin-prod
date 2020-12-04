import React, { useMemo, useState } from 'react';
import cn from 'classnames';
import { Button, Dropdown } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { templateLink } from '../../../utils/helper';

import styles from './DownloadDropDown.module.css';

const DOWNLOAD_TEMPLATE = 'Скачать шаблон';
const DOWNLOAD_LOAD_TEMPLATE = 'Для загрузки';
const DOWNLOAD_DELETE_TEMPLATE = 'Для удаления';

const DownloadDropDown = () => {
    const [templateDropdown, setTemplateDropdown] = useState(false);

    const dropdownMenu = useMemo(() => (
        <div className={ styles.dropdownMenu }>
            <div className={ styles.dropdownLinkWrapper }>
                <a href={ templateLink('user-upload.xlsx') }>
                    { DOWNLOAD_LOAD_TEMPLATE }
                </a>
                <a href={ templateLink('user-delete.xlsx') }>
                    { DOWNLOAD_DELETE_TEMPLATE }
                </a>
            </div>
        </div>
    ), []);

    return (
        <Dropdown
            overlay={ dropdownMenu }
            trigger={ ['click'] }
            visible={ templateDropdown }
            onVisibleChange={ setTemplateDropdown }
        >
            <Button
                className={ cn(styles.dropdownButton, { [styles.dropdownActive]: templateDropdown }) }
                shape="round"
                size="large"
            >
                { DOWNLOAD_TEMPLATE } { !templateDropdown ? <DownOutlined /> : <UpOutlined />}
            </Button>
        </Dropdown>
    );
};

export default DownloadDropDown;
