import { mount } from 'enzyme';
import React from 'react';
import StepVisibility from './StepVisibility';

jest.mock('../../PromoCampaignVisibilitySetting/PromoCampaignVisibilitySetting', () => () => (
    <div id="PromoCampaignVisibilitySetting">
        PromoCampaignVisibilitySetting
    </div>
)
);

describe('<StepVisibility /> tests', () => {
    it('should render PromoCampaignVisibilitySetting in general', () => {
        const wrapper = mount(<StepVisibility />);
        expect(wrapper.text()).toBe('PromoCampaignVisibilitySetting');
    });
});
