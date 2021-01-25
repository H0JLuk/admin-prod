import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styles from './ClientAppItem.module.css';
import Button from '../Button/Button';
import ButtonLabels from '../Button/ButtonLables';

const ClientAppItem = (props) => {
    const { /*handleEdit, displayName,*/ name, code, isDeleted, handleAdministrate, handleEditProperties } = props;

    // const handleEditClientApp = () => {
    //     handleEdit(id, name, displayName, code, isDeleted);
    // };

    const handleAdministrateClientApp = () => handleAdministrate(code);

    const handleEditPropertiesClientApp = () => handleEditProperties(code);

    return (
        <div className={ styles.clientAppItem }>
            <div className={ styles.descrWrapper }>
                <div className={ styles.fieldsWrapper }>
                    {isDeleted && <p className={ styles.deleted }><b>Приложение удалено!</b></p>}
                    <p><b>Имя:</b>{ ` "${ name }"` }</p>
                    <p><b>Код:</b>{ ` "${ code }"` }</p>
                    <p><b>Deleted:</b> {isDeleted.toString()}</p>
                </div>
                <div className={ styles.clientAppItemActions }>
                    <Button type="green" label={ ButtonLabels.PROPERTIES } onClick={ handleEditPropertiesClientApp } />
                    <Button type="blue" label={ ButtonLabels.ADMINISTRATE } onClick={ handleAdministrateClientApp } />
                    {/*<Button type="green" label={EDIT} onClick={handleEditClientApp}/>*/}
                </div>
            </div>
        </div>
    );
};

ClientAppItem.propTypes = {
    id: PropTypes.number.isRequired,
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    isDeleted: PropTypes.bool,
    handleAdministrate: PropTypes.func.isRequired,
    handleEditProperties: PropTypes.func.isRequired,
    properties: PropTypes.object,
    handleEdit: PropTypes.func.isRequired
};

export default memo(ClientAppItem);