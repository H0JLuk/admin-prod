import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { Col, Radio, Row, Switch } from 'antd';
import { getClientAppInfo } from '@apiServices/clientAppService';
import { getAppCode } from '@apiServices/sessionService';
import promoCodeTypes from '@constants/promoCodeTypes';
import behaviorTypes from '@constants/behaviorTypes';
import { BANNER_TYPE } from '@constants/common';
import { ClientAppDto, PromoCampaignDto } from '@types';

import style from '../PromoCampaignInfo.module.css';

type IStepInfoProps = {
    promoCampaign: PromoCampaignDto;
};

const EXCURSION = 'Экскурсия';
const GIFT = 'Подарок';
const CATEGORY = 'Категории';
const NO_CATEGORY_LABEL = 'Нет выбранных категорий';
const URL_PROMO_CAMPAIGN = 'Ссылка на страницу промо-кампании';
const EMPTY_URL_PROMO_CAMPAIGN = 'Нет ссылки';
const TYPE_PROMO_CAMPAIGN = 'Тип промо-кампании';
const TYPE_PROMO_CODE = 'Тип промокода';
const ACTIVE_PERIOD = 'Период действия';
const SHOW_PROMO_CAMPAIGN = 'Витрина, в которой отображается промо-кампания';
const DZO = 'ДЗО';
const STATUS = 'Активность промо-кампании';
const URL_SOURCE_LABEL = 'Источник ссылки';
const URL_SOURCE_DZO_LABEL = 'ДЗО';
const SHOW_GO_TO_LINK_LABEL = 'Отображать кнопку "Перейти на сайт"';
const SHOW_ONLY_IN_BUNDLE = 'Отображать только в составе бандла';
const EXTERNAL_ID_LABEL = 'Внешний ID';
const EMPTY_EXTERNAL_ID_LABEL = 'Внешний ID не выбран';
const DETAIL_BTN_LABEL = 'Текст кнопки';
const EMPTY_DETAIL_BTN_LABEL = 'Текст не задан';
const DETAIL_BTN_URL = 'Ссылка для кнопки';
const EMPTY_DETAIL_BTN_URL = 'Нет ссылки';
const URL_SOURCE_PROMO_CAMPAIGN_LABEL = 'Промо-кампания';
const BEHAVIOR_TYPE_LABEL = 'Отображать QR-код';
const SHOW_VIDEO_TOUR_LABEL = 'Отображать видеоэкскурсию';

const STATUS_TYPE = {
    ACTIVE: 'Активная',
    INACTIVE: 'Неактивная',
};

const StepInfo: React.FC<IStepInfoProps> = ({ promoCampaign }) => {
    const [clientApp, setClientApp] = useState<ClientAppDto>();
    const appCode = getAppCode() || '';

    useEffect(() => {
        (async () => {
            try {
                const app = await getClientAppInfo(appCode);
                setClientApp(app);
            } catch (e) {
                console.warn(e?.message);
            }
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={style.containerStep}>
            <div className={style.container}>
                <Row gutter={[24, 40]}>
                    <Col span={16}>
                        <div className={style.infoTitle}>{CATEGORY}</div>
                        <div className={style.infoText}>
                            {promoCampaign.categoryList?.length
                                ? promoCampaign.categoryList.map(({ categoryName }) => categoryName).join(', ')
                                : <i>{NO_CATEGORY_LABEL}</i>
                            }
                        </div>
                    </Col>

                    <Col span={8} className={style.switchContainer}>
                        <div className={style.switch}>
                            <div className={style.infoTitle}>
                                {SHOW_VIDEO_TOUR_LABEL}
                            </div>
                            <Switch
                                checked={!promoCampaign.settings?.disabled_banner_types?.includes(BANNER_TYPE.VIDEO)}
                                disabled
                            />
                        </div>
                    </Col>

                    <Col span={8}>
                        <div className={style.infoTitle}>{URL_PROMO_CAMPAIGN}</div>
                        <div className={style.webLink}>
                            {promoCampaign.webUrl || <i>{EMPTY_URL_PROMO_CAMPAIGN}</i>}
                        </div>
                    </Col>

                    <Col span={8}>
                        <div className={style.infoTitle}>{URL_SOURCE_LABEL}</div>
                        <div className={style.flexRow}>
                            <Radio
                                className={style.checkbox}
                                checked={promoCampaign?.settings?.priority_on_web_url !== true}
                                disabled
                            >
                                {URL_SOURCE_DZO_LABEL}
                            </Radio>
                            <Radio
                                className={style.checkbox}
                                checked={promoCampaign?.settings?.priority_on_web_url === true}
                                disabled
                            >
                                {URL_SOURCE_PROMO_CAMPAIGN_LABEL}
                            </Radio>
                        </div>
                    </Col>

                    <Col span={8} className={style.switchContainer}>
                        <div className={style.switch}>
                            <div className={style.infoTitle}>{SHOW_GO_TO_LINK_LABEL}</div>
                            <Switch
                                disabled
                                checked={promoCampaign.settings?.alternative_offer_mechanic || false}
                            />
                        </div>
                    </Col>

                    <Col span={8}>
                        <div className={style.infoTitle}>{DZO}</div>
                        <div className={style.infoText}>
                            {promoCampaign.dzoName}
                        </div>
                    </Col>

                    <Col span={8}>
                        <div className={style.infoTitle}>{ACTIVE_PERIOD}</div>
                        <div className={style.infoText}>
                            {promoCampaign.startDate} - {promoCampaign.finishDate}
                        </div>
                    </Col>

                    <Col span={8} className={style.switchContainer}>
                        <div className={style.switch}>
                            <div className={style.infoTitle}>{SHOW_ONLY_IN_BUNDLE}</div>
                            <Switch disabled checked={!promoCampaign.standalone} />
                        </div>
                    </Col>

                    <Col span={8}>
                        <div className={style.infoTitle}>{TYPE_PROMO_CODE}</div>
                        <div className={style.infoText}>
                            {promoCodeTypes[promoCampaign.promoCodeType].label}
                        </div>
                    </Col>

                    <Col span={8}>
                        <div className={style.infoTitle}>{EXTERNAL_ID_LABEL}</div>
                        <div className={style.infoText}>
                            {promoCampaign.externalId || <i>{EMPTY_EXTERNAL_ID_LABEL}</i>}
                        </div>
                    </Col>

                    <Col span={8}>
                        <div className={style.infoTitle}>{STATUS}</div>
                        <div className={cn(style.status, { [style.danger]: !promoCampaign.active })}>
                            {promoCampaign.active ? STATUS_TYPE.ACTIVE : STATUS_TYPE.INACTIVE}
                        </div>
                    </Col>

                    <Col span={8}>
                        <div className={style.infoTitle}>{BEHAVIOR_TYPE_LABEL}</div>
                        <div className={style.infoText}>
                            <Switch
                                disabled
                                checked={promoCampaign.behaviorType === behaviorTypes.QR}
                            />
                        </div>
                    </Col>

                    <Col span={16} className={style.formGroup}>
                        <span className={style.formGroupLabel}>
                            Настройки детальной кнопки
                        </span>
                        <Col span={12}>
                            <div className={style.infoTitle}>{DETAIL_BTN_LABEL}</div>
                            <div className={style.infoText}>
                                {promoCampaign.settings.details_button_label || <i>{EMPTY_DETAIL_BTN_LABEL}</i>}
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className={style.infoTitle}>{DETAIL_BTN_URL}</div>
                            <div className={style.infoText}>
                                {promoCampaign.settings.details_button_url || <i>{EMPTY_DETAIL_BTN_URL}</i>}
                            </div>
                        </Col>
                    </Col>

                </Row>
            </div>

            <div className={style.infoDetail}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <div className={style.container}>
                            <div className={style.infoTitle}>{SHOW_PROMO_CAMPAIGN}</div>
                            <div className={style.infoText}>
                                {clientApp?.displayName}
                            </div>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className={style.container}>
                            <div className={style.infoTitle}>{TYPE_PROMO_CAMPAIGN}</div>
                            <div className={style.flex}>
                                <Radio
                                    className={style.checkbox}
                                    checked={promoCampaign.type === 'NORMAL'}
                                    disabled
                                >
                                    {EXCURSION}
                                </Radio>
                                <Radio
                                    className={style.checkbox}
                                    checked={promoCampaign.type === 'PRESENT'}
                                    disabled
                                >
                                    {GIFT}
                                </Radio>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default StepInfo;
