import React, { memo } from 'react'
import PropTypes from 'prop-types'
import styles from './SimpleDzoItem.module.css'


const SimpleDzoItem = (props) => {
    const { dzoCode, dzoName } = props

    return (
        <div className={styles.dzoItem}>
            <div className={styles.descrWrapper}>
                <div className={styles.textFieldFormat}>
                    <p className={styles.textFormat}>{dzoName}({dzoCode})</p>
                </div>
            </div>
        </div>
    )
}

SimpleDzoItem.propTypes = {

    dzoCode: PropTypes.string.isRequired,
    dzoName: PropTypes.string.isRequired,
}

export default memo(SimpleDzoItem);
