import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Form, Input, Checkbox, Select, Modal,
    // DatePicker, Space
} from 'antd';
import { getUnissuedPromoCodeStatistics } from '@apiServices/promoCodeService';
import eq from 'lodash/eq';
import size from 'lodash/size';
import { warnNotice } from '../../toast/Notice';
// import moment from 'moment';
import callConfirmModalForPromoCodeTypeChanging from '@containers/PromoCampaignPage/PromoCampaign/PromoCampaignForm/PromoCampaignSteps/ConfirmModalForPromoCodeTypeChanging/ConfirmModalForPromoCodeTypeChanging';
import promoCodeTypes from '@constants/promoCodeTypes';
import { DzoDto, PromoCampaignDto } from '@types';

const { Option } = Select;
// const { RangePicker } = DatePicker;

interface ISavePromoCampaignModal {
    editingObject?: PromoCampaignDto;
    editMode: boolean;
    dzoList: DzoDto[];
    title: string;
    onSave: (state: IOnSaveState) => void;
    open: boolean;
    onClose: () => void;
}

export type IOnSaveState = Omit<ISavePromoCampaignModalState, 'dzoList'>;

export type ISavePromoCampaignModalState = Partial<Omit<PromoCampaignDto, 'dzoId' | 'webUrl' | 'promoCodeType' | 'type'>> & {
    name: string;
    webUrl: string | null;
    promoCodeType: string | null;
    type: string | null;
    active: boolean;
    dzoId: number | null;
    dzoList: DzoDto[];
};

const emptyPromoCampaign = {
    name: '',
    webUrl: null,
    promoCodeType: null,
    type: null,
    active: false,
    dzoId: null,
};

const {
    PERSONAL,
    PERSONAL_CLIENT_POOL,
    COMMON,
    COMMON_CLIENT_POOL,
    NONE,
} = promoCodeTypes;

class SavePromoCampaignModal extends Component<ISavePromoCampaignModal, ISavePromoCampaignModalState> {
    constructor(props: ISavePromoCampaignModal) {
        super(props);
        this.state = {
            ...emptyPromoCampaign,
            dzoList: [],
            // dates: null,
        };
    }

    componentDidUpdate(prevProps: ISavePromoCampaignModal) {
        if (!eq(prevProps, this.props)) {
            const { editingObject, dzoList } = this.props;
            this.setState({
                ...(editingObject || {} as PromoCampaignDto),
                dzoList,
                // dates: [moment(editingObject.startDate), moment(editingObject.finishDate)]
            });
        }
    }

    handleOk = async () => {
        const { id: promoCampaignId } = this.props.editingObject ?? {};
        const { promoCodeType } = this.state;

        if (typeof promoCampaignId !== 'undefined' && promoCodeType !== null) {
            await getUnissuedPromoCodeStatistics(promoCampaignId, promoCodeType);
        }

        this.savePromoCampaign({ ...this.state, promoCodeType });
    };

    handleSubmit = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        console.log(e);
        e && e.preventDefault();

        const oldValue = this.props.editingObject?.promoCodeType;
        const newValue = this.state.promoCodeType;
        const { editMode } = this.props;

        if (newValue !== oldValue && editMode) {
            const changingValue =`${oldValue}_TO_${newValue}`;
            callConfirmModalForPromoCodeTypeChanging(this.handleOk, changingValue);
        } else {
            this.savePromoCampaign(this.state);
        }
    };

    savePromoCampaign = (promoCampaign: ISavePromoCampaignModalState) => {
        const length = size(promoCampaign.name);

        if (length < 3 || length > 62) {
            return warnNotice('Введите корректное название!');
        }
        else if (!promoCampaign.promoCodeType) {
            return warnNotice('Выберите промокод из списка!');
        }
        else if (!promoCampaign.dzoId) {
            return warnNotice('Выберите партнера из списка!');
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { dzoList, ...promoCampaignState } = this.state;
        this.props.onSave(promoCampaignState);
    };

    render() {
        const {
            open,
            title,
            onClose,
            editMode,
        } = this.props;

        const {
            name,
            webUrl,
            active,
            dzoId,
            promoCodeType,
            dzoList,
            type,
            // dates
        } = this.state;

        return (
            <Modal title={title}
                visible={open}
                onOk={this.handleSubmit}
                okText="Сохранить"
                cancelText="Отменить"
                onCancel={onClose}
            >
                <Form
                    layout="vertical"
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    onSubmit={this.handleSubmit}
                >
                    <Form.Item required label="Название">
                        <Input autoFocus
                            value={name}
                            onChange={(e) => this.setState({ name: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Ссылка на страницу промо-кампании">
                        <Input value={webUrl || undefined}
                            onChange={(e) => this.setState({ webUrl: e.target.value })}
                        />
                    </Form.Item>
                    {/*<Form.Item label="Период действия промо-кампании">*/}
                    {/*    <Space direction="vertical" size={ 12 }>*/}
                    {/*        <RangePicker disabled value={ dates } onChange={ (dates, dateStrings) => this.setState({*/}
                    {/*            dates,*/}
                    {/*            startDate: dateStrings[0],*/}
                    {/*            finishDate: dateStrings[1]*/}
                    {/*        }) } />*/}
                    {/*    </Space>*/}
                    {/*</Form.Item>*/}
                    <Form.Item label="Активная">
                        <Checkbox checked={active}
                            onChange={(e) => this.setState({ active: e.target.checked })}
                        />
                    </Form.Item>
                    <Form.Item required label="Тип промокода">
                        <Select placeholder="Выберите тип промокодов"
                            value={promoCodeType || undefined}
                            onChange={(promoCodeType) => this.setState({ promoCodeType })}
                        >
                            <Option value={NONE.value}>Нет промокодов</Option>
                            <Option value={PERSONAL.value}>Персональные (для всех)</Option>
                            <Option value={COMMON.value}>Общий (один для всех)</Option>
                            <Option value={PERSONAL_CLIENT_POOL.value} disabled>
                                Персональный (для определенного списка клиентов)
                            </Option>
                            <Option value={COMMON_CLIENT_POOL.value} disabled>
                                Общий (для определенного списка клиентов)
                            </Option>
                        </Select>
                    </Form.Item>
                    <Form.Item required label="Тип промо-кампании">
                        <Select placeholder="Выберите тип промо-кампании"
                            value={type || undefined}
                            onChange={(type) => this.setState({ type })}
                        >
                            <Option value="NORMAL">Нормальный</Option>
                            <Option value="PRESENT">Подарок</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item required label="Партнер (ДЗО)">
                        <Select
                            disabled={editMode}
                            value={dzoId || undefined}
                            placeholder="Выберите партнера из списка"
                            onChange={(dzoId) => this.setState({ dzoId })}
                        >
                            {dzoList.map(option => (
                                <Option key={option.dzoCode} value={option.dzoId}>
                                    {option.dzoName} ({option.dzoCode})
                                </Option>)
                            )}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

(SavePromoCampaignModal as any).propTypes = {
    editingObject: PropTypes.object,
    editMode: PropTypes.bool,
    dzoList: PropTypes.array,
    title: PropTypes.string
};

(SavePromoCampaignModal as any).defaultProps = {
    editingObject: emptyPromoCampaign,
    editMode: false,
    dzoList: [],
    title: ''
};

export default SavePromoCampaignModal;
