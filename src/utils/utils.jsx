
import React from 'react';

export function highlightSearchingText(value = '', searchValue = '', highlightClassName) {
    if (!searchValue || !value) {
        return <span>{value}</span>;
    }

    const newValue = [];
    const index = value
        .trim()
        .toLocaleUpperCase()
        .indexOf(
            searchValue
                .trim()
                .toLocaleUpperCase()
            );

    if (index + 1) {
        newValue.push(value.substring(0, index));
        newValue.push(
            <span key={ index } className={ highlightClassName }>
                {value.substring(index, index + searchValue.length)}
            </span>
        );
        newValue.push(value.substring(index + searchValue.length));
    } else {
        newValue.push(value);
    }

    return <span>{newValue}</span>;
}

export function getStringOptionValue({ parentName = '', name = '' } = {}) {
    if (!parentName) {
        return name;
    }

    return [parentName, name].join(', ');
}
