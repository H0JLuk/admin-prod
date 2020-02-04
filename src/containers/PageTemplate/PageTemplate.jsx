import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CustomModal from '../../components/CustomModal/CustomModal';
import styles from './PageTemplate.module.css';


/**
 * Forms the common structure of ( Slides / DZO / Landing / Category ) editing page. Renders children.
 * @param {string} pageTitle - title of whole page.
 * @param {Component} renderAddButton - button component which opens modal with FormComponent.
 * @param {function} renderForm - renders add (update) form inside modal window.
 * */
class PageTemplate extends Component {

    state = { isOpen: false }

    setModal = (bool) => { this.setState({ isOpen: bool }) }

    renderModifyModal = () => {
        const { renderForm } = this.props
        const closeModal = () => { this.setModal(false) }
        return (
            <CustomModal
                isOpen={this.state.isOpen}
                onRequestClose={closeModal}>
                { renderForm ? renderForm(closeModal) : null }
            </CustomModal>
        )
    }

    render() {
        const { children, pageTitle, renderAddButton } = this.props
        const openModal = () => { this.setModal(true) }
        return (
            <div className={styles.pageTemplateWrapper}>
                { this.renderModifyModal() }
                <div className={styles.pageHeaderSection}>
                    <h3>{pageTitle}</h3>
                    <div>{renderAddButton ? renderAddButton(openModal) : null}</div>
                </div>
                <div>
                    {children}
                </div>
            </div>
        )
    }
}

PageTemplate.propTypes = {
    pageTitle: PropTypes.string.isRequired,
    renderAddButton: PropTypes.func.isRequired,
    renderForm: PropTypes.func.isRequired,
}

export default PageTemplate;
