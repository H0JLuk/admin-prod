import React from 'react';
import Modal from 'react-modal';

const customStyles = {
    content: {
        position: 'static',
        margin: '70px auto',
        minWidth: '800px',
        maxWidth: '1080px',
        minHeight: '500px'
    }
}

const CustomModal = ({ children, ...restPros }) => (
    <Modal {...restPros} style={customStyles} ariaHideApp={false}>{children}</Modal>
);

CustomModal.propTypes = { ...Modal.propTypes };

export default CustomModal;
