import React from 'react';
import { Collapse, Empty, Table, Typography, Switch } from 'antd';
import _ from 'lodash';
import TooltipButton from '../../../../components/TooltipButton/TooltipButton';
import ActionsMenu from '../../../../components/Menu/FloatingMenu/ActionsMenu';
import Confirm from '../../../../components/Confirm/Confirm';
import styles from './PromoCampaignList.module.css';
import PromoCampaignItem from '../../../../components/PromoCampaignItem/PromoCampaignItem';
import {
    SwapOutlined,
    DeleteOutlined,
    EditOutlined,
    BarChartOutlined,
    UploadOutlined,
    FileImageOutlined,
    FileTextOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import { sortableHandle } from 'react-sortable-hoc';
import PROMO_CAMPAIGNS from '../../../../constants/promoCampaigns';

const { Panel } = Collapse;
const DELETE_BUTTON_LABEL = 'Удалить';
const EDIT_BUTTON_LABEL = 'Редактировать';
const DragHandle = sortableHandle(() => (
    <SwapOutlined style={ { cursor: 'pointer', color: '#999', transform: 'rotate(90deg)' } } />
));
const BannerPanelHeader = ({ promoCampaign }) => <Typography.Text strong>Список баннеров {promoCampaign.name}</Typography.Text>;
const TextPanelHeader = ({ promoCampaign }) => <Typography.Text strong>Список текстовок {promoCampaign.name}</Typography.Text>;
const onFilterPromoCampaignType = (value, promoCampaign) => promoCampaign.type === value;
const promoCampaignTypeFilters = Object.values(PROMO_CAMPAIGNS).map(el => ({ ...el, text: el.label }));

const renderPromoCampaignType = (value) => PROMO_CAMPAIGNS[value].label;

export const PromoCampaignList = ({
                                      loading,
                                      promoCampaigns,
                                      onCreatePromoCampaignBanner,
                                      onCreatePromoCampaignText,
                                      onEditPromoCampaign,
                                      onEditPromoCampaignBanner,
                                      onEditPromoCampaignText,
                                      onEditPromoCampaignVisibilitySettings,
                                      onDeletePromoCampaign,
                                      onDeletePromoCampaignBanner,
                                      onDeletePromoCampaignText,
                                      onShowStatistic,
                                      onPromoCodeUpload,
                                      onActiveChange,
                                      onGetDzo,
                                      imgDarkBackground,
                                      onBackgroundChange,
                                      DraggableBodyRow,
                                      DraggableContainer,
                                  }) => {

    const renderPromoCampaignBanners = (promoCampaign) =>
        <Collapse>
            <Panel key={ 1 }
                   header={ <BannerPanelHeader promoCampaign={ promoCampaign } /> }>
            {!_.isEmpty(promoCampaign.promoCampaignBanners)
                ? <Table loading={ loading }
                         className={ styles.promoCampaignsTable }
                         pagination={ false }
                         dataSource={ promoCampaign.promoCampaignBanners }>
                    <Table.Column
                        width="70%"
                        title={
                            <>
                                <p>Изображение</p>
                                <p>(Изменить фон для удобства просмотра)</p>
                                <Switch checked={ imgDarkBackground }
                                        onChange={ onBackgroundChange }
                                        checkedChildren="Темный "
                                        unCheckedChildren="Светлый" />
                            </>
                        }
                        key="url"
                        dataIndex="url"
                        render={ (url) => (
                            <img className={ imgDarkBackground ? styles.promoCampaignsImgDark : styles.promoCampaignsImg }
                                 src={ url } alt="banner" />
                        ) }
                    />
                    <Table.Column
                        width="25%"
                        title="Тип"
                        key="type"
                        dataIndex="type"
                    />
                    <Table.Column width="5%"
                                  key="action"
                                  render={ (action, item) => {
                                      return (
                                          <ActionsMenu>
                                              <TooltipButton text={ EDIT_BUTTON_LABEL }
                                                             shape="circle"
                                                             icon={ <EditOutlined /> }
                                                             onClick={ () => onEditPromoCampaignBanner(item, promoCampaign) } />
                                              <Confirm text="Вы уверены, что хотите удалить баннер?"
                                                       onConfirm={ () => onDeletePromoCampaignBanner(item, promoCampaign) }>
                                                  <TooltipButton text={ DELETE_BUTTON_LABEL }
                                                                 shape="circle"
                                                                 type="danger"
                                                                 icon={ <DeleteOutlined /> } />
                                              </Confirm>
                                          </ActionsMenu>
                                      );
                                  } }
                    />
                </Table>

                : <Empty description={
                    <span>
                        Для этой промо кампании нет загруженныйх баннеров, но вы можете
                        <div className={ styles.promoCampaignsLink }
                             onClick={ () => onCreatePromoCampaignBanner(promoCampaign) }> загрузить первый!</div>
                    </span>
                } />
            }
            </Panel>
        </Collapse>;

    const renderPromoCampaignTexts = (promoCampaign) =>
        <Collapse>
            <Panel key={ 1 }
                   header={ <TextPanelHeader promoCampaign={ promoCampaign } /> }>
                {!_.isEmpty(promoCampaign.promoCampaignTexts)
                    ? <Table loading={ loading }
                             className={ styles.promoCampaignsTable }
                             pagination={ false }
                             dataSource={ promoCampaign.promoCampaignTexts }>
                        <Table.Column
                            width="70%"
                            title="Текст промо-кампании"
                            key="value"
                            dataIndex="value"
                            render={ (value) => (
                                <Typography.Text >{value}</Typography.Text>
                            ) }
                        />
                        <Table.Column
                            width="25%"
                            title="Тип текста"
                            key="type"
                            dataIndex="type"
                        />
                        <Table.Column width="5%"
                                      key="action"
                                      render={ (action, item) => {
                                          return (
                                              <ActionsMenu>
                                                  <TooltipButton text={ EDIT_BUTTON_LABEL }
                                                                 shape="circle"
                                                                 icon={ <EditOutlined /> }
                                                                 onClick={ () => onEditPromoCampaignText(item, promoCampaign) } />
                                                  <Confirm
                                                      text="Вы уверены, что хотите удалить текст?"
                                                      onConfirm={ () => onDeletePromoCampaignText(item, promoCampaign) }>
                                                      <TooltipButton text={ DELETE_BUTTON_LABEL }
                                                                     shape="circle"
                                                                     type="danger"
                                                                     icon={ <DeleteOutlined /> } />
                                                  </Confirm>
                                              </ActionsMenu>
                                          );
                                      } }
                        />
                    </Table>

                    : <Empty description={
                        <span>
                            Для этой промо кампании нет добавленных текстовок, но вы можете
                            <div className={ styles.promoCampaignsLink }
                                 onClick={ () => onCreatePromoCampaignText(promoCampaign) }> добавить первую!</div>
                        </span>
                    } />
                }
            </Panel>
        </Collapse>;

    const expandedRowRender = (promoCampaign) => {
        return (
        <>
            <PromoCampaignItem onActiveChange={ onActiveChange }
                               getDzo={ onGetDzo }
                               { ...promoCampaign } />
            {renderPromoCampaignBanners(promoCampaign)}
            {renderPromoCampaignTexts(promoCampaign)}
        </>);
    };

    return (
        <Table loading={ loading }
               rowKey="id"
               className={ styles.promoCampaignsTable }
               pagination={ false }
               dataSource={ promoCampaigns }
               expandable={ { expandedRowRender } }
               components={ {
                   body: {
                       wrapper: DraggableContainer,
                       row: DraggableBodyRow,
                   },
               } }>
            <Table.Column
                width="5%"
                title="Порядок"
                key="order"
                dataIndex="order"
                render={ () => <DragHandle /> }
            />
            <Table.Column
                width="75%"
                title="Имя промо-кампании"
                key="name"
                dataIndex="name"
            />
            <Table.Column
                width="15%"
                title="Тип промо-кампании"
                key="type"
                dataIndex="type"
                render={ renderPromoCampaignType }
                filters={ promoCampaignTypeFilters }
                filterMultiple={ false }
                onFilter={ onFilterPromoCampaignType }
        />
            <Table.Column width="5%"
                          key="action"
                          render={ (item) => <ActionsMenu>
                              {item.promoCodeType !== 'NONE' &&
                              <TooltipButton text="Загрузить промо-коды"
                                             shape="circle"
                                             icon={ <UploadOutlined /> }
                                             onClick={ () => onPromoCodeUpload(item) } />}
                              {item.promoCodeType !== 'NONE' &&
                              <TooltipButton text="Статистика использования промо-кодов"
                                             shape="circle"
                                             icon={ <BarChartOutlined /> }
                                             onClick={ () => onShowStatistic(item) } />}
                              <TooltipButton text="Редактировать промо кампанию"
                                             shape="circle"
                                             icon={ <EditOutlined /> }
                                             onClick={ () => onEditPromoCampaign(item) } />
                              <Confirm placement="left"
                                       text="Вы уверены, что хотите удалить промо кампанию и все ее содержимое?"
                                       onConfirm={ () => onDeletePromoCampaign(item) }>
                                  <TooltipButton text="Удалить промо кампанию"
                                                 shape="circle"
                                                 type="danger"
                                                 icon={ <DeleteOutlined /> }
                                  />
                              </Confirm>
                              <TooltipButton text="Добавить баннер к промокампании"
                                             shape="circle"
                                             type="primary"
                                             icon={ <FileImageOutlined /> }
                                             onClick={ () => onCreatePromoCampaignBanner(item) } />
                              <TooltipButton text="Добавить текст к промо-кампании"
                                             shape="circle"
                                             type="primary"
                                             icon={ <FileTextOutlined /> }
                                             onClick={ () => onCreatePromoCampaignText(item) } />
                              <TooltipButton text="Настроить видимость промо-кампании"
                                             shape="circle"
                                             type="primary"
                                             icon={ <SettingOutlined /> }
                                             onClick={ () => onEditPromoCampaignVisibilitySettings(item) } />
                          </ActionsMenu>
                          }
            />
        </Table>
    );
};
