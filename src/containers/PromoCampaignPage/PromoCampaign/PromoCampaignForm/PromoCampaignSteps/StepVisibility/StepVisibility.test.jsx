import { shallow } from 'enzyme';
import React from 'react';
import StepVisibility from './StepVisibility';

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
    useHistory: () => ({
        push: mockHistoryPush,
        location: jest.fn()
    }),
    useRouteMatch: () => ({ path: 'test' }),
    useParams: () => ({ promoCampaignId: 1064 }),
    useLocation: () => ({
        search: {},
        state: 'test state'
    })
}));

jest.mock(
    '../../../PromoCampaignVisibilitySetting/PromoCampaignVisibilitySetting',
    () => () => <div>PromoCampaignVisibilitySetting</div>
);

jest.mock('', () => ({
    getPromoCampaignVisibilitySettings: () => ({
        visibilitySettings: [],
        pageNo: 0,
        totalElements: 0
    })
}));

describe('<StepVisibility /> tests', () => {
    const props = {
        visibilitySettings: [
            {
                errors: {},
                id: 1619691826728,
                location: null,
                salePoint: null,
                visible: false
            },
        ],
        onChangeState: jest.fn(),
        onDeleteState: jest.fn(),
        viewMode: true,
        isCopy: undefined,
        copyVisibilitySettings: undefined,
    };

    it('StepVisibility snapshot', () => {
        const StepVisibilityItem = shallow(<StepVisibility { ...props } />);
        expect(StepVisibilityItem.html()).toMatchSnapshot();
    });

    it('should click switch, button call onChangeState func', () => {
        const newProps = { ...props, copyVisibilitySettings: true };
        const wrapper = shallow(<StepVisibility { ...newProps } />);
        wrapper.find('PromoCampaignVisibilitySettingInput').simulate('visibilityChange');
        expect(props.onChangeState).toBeCalled();
        wrapper.find('Button').simulate('click');
        expect(props.onChangeState).toBeCalled();
    });

    it('should call onLocationChange and onSalePointChange funcs', () => {
        const newProps = { ...props, copyVisibilitySettings: true };
        const wrapper = shallow(<StepVisibility { ...newProps } />);
        wrapper.find('PromoCampaignVisibilitySettingInput').simulate('locationChange');
        expect(props.onChangeState).toBeCalled();
        wrapper.find('PromoCampaignVisibilitySettingInput').simulate('salePointChange');
        expect(props.onChangeState).toBeCalled();
    });

    it('should call onDelete prop func', () => {
        const newProps = {
            ...props,
            copyVisibilitySettings: true,
            visibilitySettings: [
                ...props.visibilitySettings,
                {
                    errors: {},
                    id: 1619691826728,
                    location: null,
                    salePoint: null,
                    visible: false,
                },
            ],
        };

        const wrapper = shallow(<StepVisibility { ...newProps } />);
        wrapper.find('.deleteBlock').simulate('click');
        expect(props.onDeleteState).toBeCalled();
    });
});
