import React from 'react';
import { Empty } from 'antd';

const FIRST_MESSAGE = 'Мы ничего не нашли.';
const SECOND_MESSAGE = 'Измените значение поиска и попробуйте еще раз';

type EmptyMessageProps = {
    className?: string;
    firstMessage?: string;
    secondMessage?: string;
};

const EmptyMessage: React.FC<EmptyMessageProps> = ({
    className,
    firstMessage = FIRST_MESSAGE,
    secondMessage = SECOND_MESSAGE,
}) => (
    <Empty description={null} className={className}>
        <div>{firstMessage}</div>
        <div>{secondMessage}</div>
    </Empty>
);

export default EmptyMessage;
