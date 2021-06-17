
import React, { MouseEvent } from 'react';
import { ChildButton, Directions, FloatingMenu, MainButton } from 'react-floating-button-menu';
import TooltipButton from '../../TooltipButton';
import onClickOutside from 'react-onclickoutside';
import { EllipsisOutlined, CloseOutlined } from '@ant-design/icons';
import isEmpty from 'lodash/isEmpty';

import styles from './ActionsMenu.module.css';

type ActionsMenuProps = {
    direction?: Directions;
};

type ActionsMenuState = {
    isOpen: boolean;
};
class ActionsMenu extends React.Component<ActionsMenuProps, ActionsMenuState> {

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
            <div className={styles.actions_menu}>
                <FloatingMenu
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    className={styles.menu}
                    slideSpeed={500}
                    direction={direction || Directions.Left}
                    spacing={6}
                    isOpen={isOpen}>
                    {
                        [
                            <MainButton
                                iconResting={<TooltipButton text="Действия" shape="circle" icon={<EllipsisOutlined />} />}
                                iconActive={<TooltipButton text="Закрыть" shape="circle" icon={<CloseOutlined />} />}
                                onClick={(e: MouseEvent) => {
                                    if (e) e.stopPropagation();
                                    this.setState({ isOpen: !isOpen });
                                }}
                                background=""
                                size={32}
                                key="MainButton"
                            />,
                            ...React.Children.toArray(children)
                                .filter(o => !isEmpty(o))
                                .reverse()
                                .map((o, index) => (<ChildButton key={index} icon={o} size={32} />))
                        ]
                    }

                </FloatingMenu>
            </div>
        );
    }
}

export default onClickOutside(ActionsMenu);
