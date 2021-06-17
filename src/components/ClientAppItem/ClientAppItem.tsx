import React, { memo } from 'react';
import styles from './ClientAppItem.module.css';
import PropTypes from 'prop-types';
import Button from '../Button';
import ButtonLabels from '../Button/ButtonLables';
import noop from 'lodash/noop';
import { ClientAppDto } from '@types';

interface IClientAppItem extends ClientAppDto {
    handleAdministrate?: (code: string) => void;
    handleEditProperties?: (code: string) => void;
}

const ClientAppItem: React.FC<IClientAppItem> = (props) => {
    const { displayName, code, isDeleted, handleAdministrate = noop, handleEditProperties = noop } = props;

    const handleAdministrateClientApp = () => handleAdministrate(code);

    const handleEditPropertiesClientApp = () => handleEditProperties(code);

    return (
        <div className={styles.clientAppItem}>
            <div className={styles.descrWrapper}>
                <div className={styles.fieldsWrapper}>
                    {isDeleted && <p className={styles.deleted}><b>Приложение удалено!</b></p>}
                    <p><b>Имя:</b>{` "${ displayName }"`}</p>
                    <p><b>Код:</b>{` "${ code }"`}</p>
                    <p><b>Deleted:</b> {isDeleted.toString()}</p>
                </div>
                <div className={styles.clientAppItemActions}>
                    <Button type="green" label={ButtonLabels.PROPERTIES} onClick={handleEditPropertiesClientApp} />
                    <Button type="blue" label={ButtonLabels.ADMINISTRATE} onClick={handleAdministrateClientApp} />
                </div>
            </div>
        </div>
    );
};

ClientAppItem.propTypes = {
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    isDeleted: PropTypes.bool.isRequired,
    handleAdministrate: PropTypes.func.isRequired,
    handleEditProperties: PropTypes.func.isRequired,
};

export default memo(ClientAppItem);
