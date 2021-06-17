import React from 'react';
import Modal from 'react-modal';

const customStyles: ReactModal.Styles = {
    content: {
        position: 'static',
        margin: '120px auto 0',
        padding: 0,
        minWidth: '300px',
        maxWidth: '670px',
        minHeight: '300px'
    }
};

const CustomModal: React.FC<ReactModal.Props> = ({ children, ...restPros }) => (
    <Modal {...restPros} style={customStyles} ariaHideApp={false}>{children}</Modal>
);

export default CustomModal;
