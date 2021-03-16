import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { Col, Radio, Row, Switch } from 'antd';
import { getClientAppList } from '../../../../../api/services/clientAppService';
import { getAppCode } from '../../../../../api/services/sessionService';
import promoCodeTypes from '../../../../../constants/promoCodeTypes';

import style from '../PromoCampaignInfo.module.css';

const EXCURSION = 'Экскурсия';
const GIFT = 'Подарок';
const CATEGORY = 'Категории';
const NO_CATEGORY_LABEL = 'Нет выбранных категорий';
const URL_PROMO_CAMPAIGN = 'Ссылка на страницу промо-кампании';
const EMPTY_URL_PROMO_CAMPAIGN = 'Нет ссылки';
const TYPE_PROMO_CAMPAIGN = 'Тип промо-кампании';
const TYPE_PROMO_CODE = 'Тип промокода';
const ACTIVE_PERIOD = 'Период действия';
const SHOW_PROMO_CAMPAIGN = 'Витрины, в которых отображается промо-кампания';
const DZO = 'ДЗО';
const STATUS = 'Активность промо-кампании';
const URL_SOURCE_LABEL = 'Источник ссылки';
const URL_SOURCE_DZO_LABEL = 'ДЗО';
const SHOW_GO_TO_LINK_LABEL = 'Отображать кнопку "Перейти на сайт"';
const SHOW_ONLY_BUNDLE = 'Отображать только в составе бандла';
const EXTERNAL_ID_LABEL = 'Внешний ID';
const EMPTY_EXTERNAL_ID_LABEL = 'Внешний ID не выбран';
const URL_SOURCE_PROMO_CAMPAIGN_LABEL = 'Промо-кампания';

const STATUS_TYPE = {
    ACTIVE: 'Активная',
    INACTIVE: 'Неактивная',
};

const StepInfo = ({ promoCampaign }) => {

    const [clientApp, setClientApp] = useState();
    const appCode = getAppCode();

    useEffect(() => {
        (async () => {
            const { clientApplicationDtoList = [] } = await getClientAppList();
            const app = clientApplicationDtoList.find(({ code }) => code === appCode);
            setClientApp(app);
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={ style.containerStep }>
            <div className={ style.container }>
                <Row gutter={ [24, 40] }>
                    <Col span={ 24 }>
                        <div className={ style.infoTitle }>{ CATEGORY }</div>
                        <div className={ style.infoText }>
                            { promoCampaign.categoryList?.length
                                ? promoCampaign.categoryList.map(({ categoryName }) => categoryName).join(', ')
                                : <i>{ NO_CATEGORY_LABEL }</i>
                            }
                        </div>
                    </Col>

                    <Col span={ 8 }>
                        <div className={ style.infoTitle }>{ URL_PROMO_CAMPAIGN }</div>
                        <div className={ style.webLink }>
                            { promoCampaign.webUrl || <i>{ EMPTY_URL_PROMO_CAMPAIGN }</i> }
                        </div>
                    </Col>

                    <Col span={ 8 }>
                        <div className={ style.infoTitle }>{ URL_SOURCE_LABEL }</div>
                        <div className={ style.flexRow }>
                            <Radio
                                className={ style.checkbox }
                                checked={ promoCampaign?.settings?.priorityOnWebUrl !== true }
                                disabled
                            >
                                { URL_SOURCE_DZO_LABEL }
                            </Radio>
                            <Radio
                                className={ style.checkbox }
                                checked={ promoCampaign?.settings?.priorityOnWebUrl === true }
                                disabled
                            >
                                { URL_SOURCE_PROMO_CAMPAIGN_LABEL }
                            </Radio>
                        </div>
                    </Col>

                    <Col span={ 8 } className={ style.switchContainer }>
                        <div className={ style.switch }>
                            <div className={ style.infoTitle }>{ SHOW_GO_TO_LINK_LABEL }</div>
                            <Switch disabled checked={ promoCampaign.settings?.alternativeOfferMechanic } />
                        </div>
                    </Col>

                    <Col span={ 8 }>
                        <div className={ style.infoTitle }>{ DZO }</div>
                        <div className={ style.infoText }>
                            { promoCampaign.dzoName }
                        </div>
                    </Col>

                    <Col span={ 8 }>
                        <div className={ style.infoTitle }>{ ACTIVE_PERIOD }</div>
                        <div className={ style.infoText }>
                            { promoCampaign.startDate } - { promoCampaign.finishDate }
                        </div>
                    </Col>

                    <Col span={ 8 } className={ style.switchContainer }>
                        <div className={ style.switch }>
                            <div className={ style.infoTitle }>{ SHOW_ONLY_BUNDLE }</div>
                            <Switch disabled checked={ promoCampaign.standalone } />
                        </div>
                    </Col>

                    <Col span={ 8 }>
                        <div className={ style.infoTitle }>{ TYPE_PROMO_CODE }</div>
                        <div className={ style.infoText }>
                            { promoCodeTypes[promoCampaign.promoCodeType].label }
                        </div>
                    </Col>

                    <Col span={ 8 }>
                        <div className={ style.infoTitle }>{ EXTERNAL_ID_LABEL }</div>
                        <div className={ style.infoText }>
                            { promoCampaign.externalId || <i>{ EMPTY_EXTERNAL_ID_LABEL }</i> }
                        </div>
                    </Col>

                    <Col span={ 8 }>
                        <div className={ style.infoTitle }>{ STATUS }</div>
                        <div className={ cn(style.status, { [style.danger]: !promoCampaign.active }) }>
                            { promoCampaign.active ? STATUS_TYPE.ACTIVE : STATUS_TYPE.INACTIVE }
                        </div>
                    </Col>
                </Row>
            </div>

            <div className={ style.infoDetail }>
                <Row gutter={ [16, 16] }>
                    <Col span={ 12 }>
                        <div className={ style.container }>
                            <div className={ style.infoTitle }>{ SHOW_PROMO_CAMPAIGN }</div>
                            <div className={ style.infoText }>
                                { clientApp && clientApp.displayName }
                            </div>
                        </div>
                    </Col>
                    <Col span={ 12 }>
                        <div className={ style.container }>
                            <div className={ style.infoTitle }>{ TYPE_PROMO_CAMPAIGN }</div>
                            <div className={ style.flex }>
                                <Radio
                                    className={ style.checkbox }
                                    checked={ promoCampaign.type === 'NORMAL' }
                                    disabled
                                >
                                    { EXCURSION }
                                </Radio>
                                <Radio
                                    className={ style.checkbox }
                                    checked={ promoCampaign.type === 'PRESENT' }
                                    disabled
                                >
                                    { GIFT }
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