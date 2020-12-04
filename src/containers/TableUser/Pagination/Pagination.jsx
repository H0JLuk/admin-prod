import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import styles from './Pagination.module.css';

const SHOW_ON_PAGE = 'Показать строки';

const Pagination = ({
    currentPage,
    totalPage,
    showOnPageCount,
    onClickNext,
    onClickPrev,
    changeShowOnPageCount,
    loadTableData
}) => {
    const onChangeSelect = useCallback((value) => changeShowOnPageCount(Number(value)), [changeShowOnPageCount]);

    return (
        <div className={ styles.container }>
            <span className={ styles.rowCountLabel }>
                { SHOW_ON_PAGE }
            </span>
            <Select
                className={ styles.selectPagination }
                defaultValue={ showOnPageCount[0] }
                disabled={ loadTableData }
                onChange={ onChangeSelect }
            >
                {showOnPageCount.map((count) => (
                    <Select.Option
                        key={ count }
                        value={ count }
                    >
                        {count}
                    </Select.Option>
                ))}
            </Select>
            <div className={ styles.space }>
                {currentPage} из {totalPage}
            </div>
            <button
                className={ styles.btnPagination }
                onClick={ onClickPrev }
                disabled={ loadTableData }
            >
                <LeftOutlined />
            </button>
            <button
                className={ styles.btnPagination }
                onClick={ onClickNext }
                disabled={ loadTableData }
            >
                <RightOutlined />
            </button>
        </div>
    );
};

Pagination.defaultProps = {
    currentPage: 0,
    totalPage: 1,
    showOnPageCount: [10, 20, 50],
};

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPage: PropTypes.number.isRequired,
    showOnPageCount: PropTypes.array.isRequired,
    onClickNext: PropTypes.func.isRequired,
    onClickPrev: PropTypes.func.isRequired,
    changeShowOnPageCount: PropTypes.func.isRequired,
    loadTableData: PropTypes.bool.isRequired,
};

export default Pagination;