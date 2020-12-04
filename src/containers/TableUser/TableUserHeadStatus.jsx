import React, { useMemo } from 'react';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

const STATUS = 'Статус';

const TableUserHeadStatus = ({ className, onClick, sortValue }) => {
    const arrow = useMemo(() => {
        switch (sortValue) {
            case true: {
                return <DownOutlined />;
            }
            case false: {
                return <UpOutlined />;
            }
            default: {
                return null;
            }
        }
    }, [sortValue]);

    return (
        <div className={ className } onClick={ onClick }>
            { STATUS } { arrow }
        </div>
    );
};

export default TableUserHeadStatus;
