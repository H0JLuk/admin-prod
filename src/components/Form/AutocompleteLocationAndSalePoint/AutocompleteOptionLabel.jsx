import React from 'react';
import PropTypes from 'prop-types';
import { highlightSearchingText } from '../../../utils/utils';

import styles from './AutocompleteLocationAndSalePoint.module.css';

const AutocompleteOptionLabel = ({ parentName, name, highlightValue, highlightClassName }) => (
    <div className={ styles.autocompleteOption }>
        <div className={ styles.optionParentName }>
            { highlightSearchingText(parentName, highlightValue, highlightClassName) }
        </div>
        <div className={ styles.optionName }>
            { highlightSearchingText(name, highlightValue, highlightClassName) }
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
