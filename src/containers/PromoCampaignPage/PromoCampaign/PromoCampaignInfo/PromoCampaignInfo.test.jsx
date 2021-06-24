import React from 'react';
import { generatePath } from 'react-router-dom';
import { shallow } from 'enzyme';
import { render, fireEvent, screen } from '@testing-library/react';
import { useLocation } from 'react-router';
import PromoCampaignInfo from './PromoCampaignInfo';
import { confirmModal } from '../../../../utils/utils';
import { getDeleteTitleConfirm, onConfirmDeletePromoCampaign } from '../../PromoCampaignUtils';
import * as clientAppService from '../../../../api/services/clientAppService';
import { clientAppTestData, promoCampaignTestData } from '../../../../../__tests__/constants';
import { PROMO_CAMPAIGN_PAGES } from '../../../../constants/route';
import { sleep } from '../../../../setupTests';

const state = {
    promoCampaign: promoCampaignTestData,
};

jest.mock('../../PromoCampaignUtils', () => ({
    getDeleteTitleConfirm: jest.fn(),
    onConfirmDeletePromoCampaign: jest.fn(),
}));

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
    generatePath: jest.fn(),
}));

jest.mock('react-router', () => ({
    useLocation: jest.fn(),
}));

jest.mock('../../../../utils/utils', () => ({
    confirmModal: jest.fn(),
}));

beforeEach(() => {
    clientAppService.getClientAppInfo = jest.fn().mockResolvedValue(clientAppTestData);
    useLocation.mockImplementation(() => ({
        state,
    }));
});

describe('<PromoCampaignInfo /> tests', () => {
    const props = {
        matchPath: '/admin/promo-campaign',
        history: {
            push: jest.fn(),
        },
    };

    it('PromoCampaignInfo snapshot', () => {
        const PromoCampaignInfoItem = shallow(<PromoCampaignInfo { ...props } />);
        expect(PromoCampaignInfoItem.debug()).toMatchSnapshot();
    });

    it('should render stepInfo', () => {
        const wrapper = shallow(<PromoCampaignInfo { ...props } />);
        wrapper.find('PromoCampaignSideBar').simulate('click', 1);
        expect(wrapper.find('StepInfo')).toHaveLength(1);
    });

    it('should render TextAndImageStep', () => {
        const wrapper = shallow(<PromoCampaignInfo { ...props } />);
        wrapper.find('PromoCampaignSideBar').simulate('click', 2);
        expect(wrapper.find('StepTextAndImage')).toHaveLength(1);
    });

    it('should render StepVisibility', () => {
        const wrapper = shallow(<PromoCampaignInfo { ...props } />);
        wrapper.find('PromoCampaignSideBar').simulate('click', 3);
        expect(wrapper.find('StepVisibility')).toHaveLength(1);
    });

    it('should call confirmModal when delete btn click', () => {
        const wrapper = shallow(<PromoCampaignInfo { ...props } />);
        wrapper.find('PromoCampaignSideBar').simulate('click', 1);
        wrapper.find('Button').last().simulate('click');
        expect(confirmModal).toBeCalled();
        expect(getDeleteTitleConfirm).toBeCalled();
    });

    it('should render PromoCampaignInfo with promoCampaign data', async () => {
        render(<PromoCampaignInfo { ...props } />);
        await sleep();
        const title = screen.getByText(state.promoCampaign.name);
        expect(title.textContent).toEqual(state.promoCampaign.name);
    });

    it('should redirect to promo campaign page', async () => {
        console.error = jest.fn();
        useLocation.mockImplementation(() => ({
            state: {
                promoCampaign: undefined,
            },
        }));
        render(<PromoCampaignInfo { ...props } />);
        await sleep();
        expect(mockHistoryPush).toBeCalledWith(props.matchPath);
    });

    it('should fire onDeleteClick/confirmModal fn by click', async () => {
        const { getByText } = render(<PromoCampaignInfo { ...props } />);
        await sleep();
        fireEvent.click(getByText('Удалить'));
        expect(confirmModal).toBeCalled();
        await confirmModal.mock.calls[0][0].onOk();
        expect(onConfirmDeletePromoCampaign).toBeCalledWith(state.promoCampaign.id, state.promoCampaign.name);
        expect(mockHistoryPush).toBeCalledWith(props.matchPath);
    });

    it('should warn with error if onConfirmDeletePromoCampaign rejected', async () => {
        onConfirmDeletePromoCampaign.mockRejectedValueOnce('error');
        const spy = jest.spyOn(console, 'warn').mockImplementation(() => '');
        const { getByText } = render(<PromoCampaignInfo { ...props } />);
        await sleep();
        fireEvent.click(getByText('Удалить'));
        await confirmModal.mock.calls[0][0].onOk();
        expect(spy).toHaveBeenCalled();
    });

    it('should fire onEdit callback by click', async () => {
        generatePath.mockImplementationOnce((path, { promoCampaignId }) => `${path}/${promoCampaignId}`);
        const path = `${ props.matchPath }${ PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_EDIT }`;
        const { getByText } = render(<PromoCampaignInfo { ...props } />);
        await sleep();
        fireEvent.click(getByText('Редактировать'));

        expect(mockHistoryPush).toBeCalledWith(`${props.matchPath}${PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_EDIT}/${state.promoCampaign.id}`, { promoCampaign: state.promoCampaign });
        expect(generatePath).toBeCalledWith(path, { promoCampaignId: state.promoCampaign.id });
        expect(mockHistoryPush).toBeCalled();
    });
});
