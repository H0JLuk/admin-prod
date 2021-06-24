import React, { ChangeEvent, memo } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { SearchParams } from './types';

type SearchInputWithActionProps = {
    placeholder: string;
    onChangeValue: (val: SearchParams) => void;
    params: SearchParams;
    onChangeInput?: () => void;
    resetPage?: boolean;
};

const SearchInputWithAction: React.FC<SearchInputWithActionProps> = ({
    placeholder,
    onChangeValue,
    params,
    onChangeInput = noop,
    resetPage,
}) => {
    const onChangeHandler = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
        onChangeInput();
        resetPage && (params.pageNo = 0);
        onChangeValue({ ...params, filterText: value });
    };

    return (
        <Input
            onChange={onChangeHandler}
            placeholder={placeholder}
            value={params.filterText}
            prefix={<SearchOutlined />}
            allowClear
        />
    );
};

SearchInputWithAction.propTypes = {
    placeholder: PropTypes.string.isRequired,
    onChangeValue: PropTypes.func.isRequired,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    params: PropTypes.object.isRequired,
    onChangeInput: PropTypes.func,
};

export default memo(SearchInputWithAction);
