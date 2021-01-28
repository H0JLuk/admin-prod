import React from 'react';

export const TOOLTIP_TEXT_FOR_URL_LABEL = (
    <div>
        Для добавления параметров в ссылку используйте операторы ? и &.
        <br />
        {'Параметр задается парой: имя={значение}.'} Имя параметра задается произвольное, латинскими буквами.
        <br />
        {'Для статических параметров Для динамических параметров используйте в значении ключевые фразы: {OFFER_ID}, {PROMOCODE}.'}
        <br />
        {'Пример: https://sbermarket.ru?source=vitrina.sber.ru&offer_client={OFFER_ID}&code_client={PROMOCODE}'}
    </div>
);