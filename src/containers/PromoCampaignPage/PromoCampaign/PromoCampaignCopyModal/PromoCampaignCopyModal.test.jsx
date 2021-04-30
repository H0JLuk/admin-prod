import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, fireEvent } from '@testing-library/react';
import { shallow } from 'enzyme';
import PromoCampaignCopyModal from './PromoCampaignCopyModal';
import { getPathForCopyPromoCampaign } from '../../../../utils/appNavigation';

const promoCampaignTestData = {
    testData: 'testData',
};
const testPathCopyPromoCampaign = '/test/path/to-copy/promoCampaign';
jest.mock('../../../../utils/appNavigation', () => ({
    getPathForCopyPromoCampaign: jest.fn(),
}));


describe('<PromoCampaignCopyModal /> tests.', () => {

    it('should render only children', () => {
        console.error = jest.fn();
        const wrapper = shallow(
            <PromoCampaignCopyModal>
                <div id="test">test</div>
            </PromoCampaignCopyModal>
        );

        expect(wrapper.find('Modal')).toHaveLength(0);
        expect(wrapper.html()).toMatchSnapshot();
    });

    it('should return null', () => {
        const wrapper = shallow(
            <PromoCampaignCopyModal promoCampaignData={ promoCampaignTestData }>
                <div id="test">test</div>
                <div id="test">test</div>
            </PromoCampaignCopyModal>
        );

        expect(wrapper.html()).toBeNull();
    });

    describe('render with modal.', () => {
        const wrapper = shallow(
            <PromoCampaignCopyModal promoCampaignData={ promoCampaignTestData }>
                <div id="test">test</div>
            </PromoCampaignCopyModal>
        );

        it('should render modal and children', () => {
            expect(wrapper.find('Modal')).toHaveLength(1);
            expect(wrapper.html()).toMatchSnapshot();
        });

        it('should open modal and close', () => {
            expect(wrapper.find('Modal').prop('visible')).toBe(false);
            wrapper.find('div#test').simulate('click');
            expect(wrapper.find('Modal').prop('visible')).toBe(true);
            wrapper.find('Modal').prop('onCancel')();
            expect(wrapper.find('Modal').prop('visible')).toBe(false);
        });

        it('should open modal and history.push to copy promoCampaign page with copy visibility settings', () => {
            const history = createMemoryHistory();
            const spyOnHistory = jest.spyOn(history, 'push');
            getPathForCopyPromoCampaign.mockReturnValueOnce('/test/path/to-copy/promoCampaign');

            const { getByTestId } = render(
                <Router history={ history }>
                    <PromoCampaignCopyModal promoCampaignData={ promoCampaignTestData }>
                        <div data-testid="test">test</div>
                    </PromoCampaignCopyModal>
                </Router>
            );

            fireEvent.click(getByTestId('test'));
            expect(document.body.querySelector('.ant-modal-root')).toBeInTheDocument();

            fireEvent.click(document.body.querySelector('button.ant-btn-primary'));
            expect(spyOnHistory).toHaveBeenCalledWith(
                testPathCopyPromoCampaign,
                {
                    promoCampaign: promoCampaignTestData,
                    copyVisibilitySettings: true,
                }
            );
        });

        it('should open modal and history.push to copy promoCampaign page without copy visibility settings', () => {
            const history = createMemoryHistory();
            const spyOnHistory = jest.spyOn(history, 'push');
            getPathForCopyPromoCampaign.mockReturnValueOnce('/test/path/to-copy/promoCampaign');

            const { getByTestId } = render(
                <Router history={ history }>
                    <PromoCampaignCopyModal promoCampaignData={ promoCampaignTestData }>
                        <div data-testid="test">test</div>
                    </PromoCampaignCopyModal>
                </Router>
            );

            fireEvent.click(getByTestId('test'));
            expect(document.body.querySelector('.ant-modal-root')).toBeInTheDocument();

            fireEvent.click(document.body.querySelector('button.ant-btn:not(.ant-btn-primary)'));
            expect(spyOnHistory).toHaveBeenCalledWith(
                testPathCopyPromoCampaign,
                {
                    promoCampaign: promoCampaignTestData,
                    copyVisibilitySettings: false,
                }
            );
        });
    });

});
