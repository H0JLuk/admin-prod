import React, { memo } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const SearchInputWithAction = ({
    placeholder,
    onChangeValue,
    params,
    onChangeInput = noop,
}) => {
    const onChangeHandler = ({ target: { value } }) => {
        onChangeInput();
        onChangeValue({ ...params, filterText: value });
    };

    return (
        <Input
            onChange={ onChangeHandler }
            placeholder={ placeholder }
            value={ params.filterText }
            prefix={ <SearchOutlined /> }
            allowClear
        />
    );
};

SearchInputWithAction.propTypes = {
    placeholder: PropTypes.string.isRequired,
    onChangeValue: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    onChangeInput: PropTypes.func
};

export default memo(SearchInputWithAction);
