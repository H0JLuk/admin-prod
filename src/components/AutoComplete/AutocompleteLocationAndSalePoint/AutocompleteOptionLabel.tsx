import React from 'react';
import PropTypes from 'prop-types';
import { highlightSearchingText } from '@utils/utils';

import styles from './AutocompleteLocationAndSalePoint.module.css';

type AutocompleteOptionLabelProps = {
    parentName?: string;
    name: string;
    highlightValue?: string;
    highlightClassName?: string;
};

const AutocompleteOptionLabel: React.FC<AutocompleteOptionLabelProps> = ({
    parentName,
    name,
    highlightValue,
    highlightClassName = styles.highlight,
}) => (
    <div className={styles.autocompleteOption}>
        <div className={styles.optionParentName}>
            {highlightSearchingText(parentName, highlightValue, highlightClassName)}
        </div>
        <div className={styles.optionName}>
            {highlightSearchingText(name, highlightValue, highlightClassName)}
        </div>
    </div>
);

AutocompleteOptionLabel.propTypes = {
    parentName: PropTypes.string,
    name: PropTypes.string.isRequired,
    highlightValue: PropTypes.string,
    highlightClassName: PropTypes.string,
};

export default AutocompleteOptionLabel;
