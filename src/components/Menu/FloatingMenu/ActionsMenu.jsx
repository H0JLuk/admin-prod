import React from 'react';
import { ChildButton, FloatingMenu, MainButton } from 'react-floating-button-menu';
import './ActionsMenu.css';
import TooltipButton from '../../TooltipButton/TooltipButton';
import onClickOutside from 'react-onclickoutside';
import { EllipsisOutlined, CloseOutlined } from '@ant-design/icons';
import _ from 'lodash';


class ActionsMenu extends React.Component {

    handleClickOutside = () => {
        this.setState({ isOpen: false });
    };

    state = {
        isOpen: false
    };

    render() {
        const { isOpen } = this.state;

        const { direction, children } = this.props;

        return (
            <div className="actions-menu">
                <FloatingMenu
                    className="menu"
                    slideSpeed={ 500 }
                    direction={ direction || 'left' }
                    spacing={ 6 }
                    isOpen={ isOpen }>
                    {
                        [
                            <MainButton
                                iconResting={ <TooltipButton text="Действия" shape="circle" icon={ <EllipsisOutlined /> } /> }
                                iconActive={ <TooltipButton text="Закрыть" shape="circle" icon={ <CloseOutlined /> } /> }
                                onClick={ (e) => {
                                    if (e) e.stopPropagation();
                                    this.setState({ isOpen: !isOpen });
                                } }
                                size={ 32 }
                                key="MainButton"
                            />,
                            ...React.Children.toArray(children)
                                .filter(o => !_.isEmpty(o))
                                .reverse()
                                .map((o, index) => (<ChildButton key={ index } icon={ o } size={ 32 } />))
                        ]
                    }

                </FloatingMenu>
            </div>
        );
    }
}

export default onClickOutside(ActionsMenu);