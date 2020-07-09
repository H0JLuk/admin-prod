import React, {memo} from "react";
import PropTypes from 'prop-types'
import styles from './ClientAppItem.module.css'
import Button from "../Button/Button";
import {ADMINISTRATE, EDIT} from "../Button/ButtonLables";

const ClientAppItem = (props) => {
    const {id, name, code, isDeleted, handleEdit, handleAdministrate} = props;

    const handleEditClientApp = () => {
        handleEdit(id, name, code, isDeleted)
    };

    const handleAdministrateClientApp = () => {
        handleAdministrate(code)
    }

    return (
        <div className={styles.clientAppItem}>
            <div className={styles.descrWrapper}>
                <div className={styles.fieldsWrapper}>
                    <p><b>Имя:</b> "{name}"</p>
                    <p><b>Код:</b> "{code}"</p>
                    <p><b>Deleted:</b> {isDeleted.toString()}</p>
                </div>
                <div className={styles.clientAppItemActions}>
                    <Button type="blue" label={ADMINISTRATE} onClick={handleAdministrateClientApp}/>
                    <Button type="green" label={EDIT} onClick={handleEditClientApp}/>
                </div>
            </div>
        </div>
    )
};

ClientAppItem.propTypes = {
    id: PropTypes.number.isRequired,
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    isDeleted: PropTypes.bool,
    handleAdministrate: PropTypes.func.isRequired,
    handleEdit: PropTypes.func.isRequired
};

export default memo(ClientAppItem);