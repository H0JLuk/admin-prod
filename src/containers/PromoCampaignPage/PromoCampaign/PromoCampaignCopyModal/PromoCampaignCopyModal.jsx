import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { useHistory } from 'react-router-dom';
import Modal from 'antd/lib/modal/Modal';
import { Button } from 'antd';
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined';
import { getPathForCopyPromoCampaign } from '../../../../utils/appNavigation';

const MODAL_CANCEL = 'Нет, настроить заново';
const MODAL_OK = 'Да, скопировать';
const MODAL_CONTENT = 'Хотите скопировать промо-кампанию вместе с настройками видимости?';

const modalPrefixClass = 'ant-modal-confirm';

const PromoCampaignCopyModal = ({
    promoCampaignData,
    children,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const history = useHistory();

    if (!promoCampaignData) {
        return children;
    }

    try {
        React.Children.only(children);
    } catch (e) {
        console.error('`children` of `PromoCampaignCopyModal` component  must be single reactNode');
        return null;
    }

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const onCopyPromoCampaign = async (copyVisibilitySettings = true) => {
        const routeState = {
            promoCampaign: promoCampaignData,
            copyVisibilitySettings,
        };
        history.push(getPathForCopyPromoCampaign(), routeState);
    };

    const copyWithSettings = () => onCopyPromoCampaign();
    const copyWithoutSettings = () => onCopyPromoCampaign(false);

    return (
        <>
            { React.cloneElement(children, { onClick: openModal }) }
            <Modal
                visible={ isModalOpen }
                width={ 450 }
                onCancel={ closeModal }
                footer={ null }
                className={ cn(modalPrefixClass, `${ modalPrefixClass }-confirm`) }
                destroyOnClose
                centered
            >
                <div className={ `${ modalPrefixClass }-body-wrapper` }>
                    <div className={ `${ modalPrefixClass }-body` }>
                        <ExclamationCircleOutlined />
                        <span className={ `${ modalPrefixClass }-title` }>
                            У промо-кампании
                            <b> { promoCampaignData.name } </b>
                            есть настройки видимости
                        </span>
                        <div className={ `${ modalPrefixClass }-content` }>
                            { MODAL_CONTENT }
                        </div>
                    </div>
                    <div className={ `${ modalPrefixClass }-btns` }>
                        <Button onClick={ copyWithoutSettings }
                        >
                            { MODAL_CANCEL }
                        </Button>
                        <Button
                            type="primary"
                            onClick={ copyWithSettings }
                        >
                            { MODAL_OK }
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

PromoCampaignCopyModal.propTypes = {
    promoCampaignData: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
};

export default PromoCampaignCopyModal;
