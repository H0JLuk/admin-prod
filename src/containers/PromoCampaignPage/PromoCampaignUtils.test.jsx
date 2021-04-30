import { shallow } from 'enzyme';
import { deletePromoCampaign } from '../../api/services/promoCampaignService';
import { customNotifications } from '../../utils/notifications';
import {
    getDeleteTitleConfirm,
    getSuccessDeleteMessage,
    onConfirmDeletePromoCampaign,
} from './PromoCampaignUtils';

jest.mock('../../api/services/promoCampaignService', () => ({
    deletePromoCampaign: jest.fn(),
}));
jest.mock('../../utils/notifications', () => ({
    customNotifications: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));


describe('PromoCampaignUtils tests.', () => {

    it('test `getDeleteTitleConfirm` function', () => {
        const name = 'testName';
        const wrapper = shallow(getDeleteTitleConfirm(name));
        expect(wrapper.find('b').text()).toEqual(name);
    });

    it('test `getSuccessDeleteMessage` function', () => {
        const name = 'testName';
        const wrapper = shallow(getSuccessDeleteMessage(name));
        expect(wrapper.find('b').text()).toEqual(name);
    });

    it('test success result `onConfirmDeletePromoCampaign` function', async () => {
        const id = 0, name = 'TestName';
        await onConfirmDeletePromoCampaign(id, name);

        expect(deletePromoCampaign).toHaveBeenCalledWith(id);
        expect(customNotifications.success).toHaveBeenCalledWith({
            duration: 10,
            message: getSuccessDeleteMessage(name),
        });
    });

    it('test error result `onConfirmDeletePromoCampaign` function', async () => {
        const id = 0, name = 'TestName';
        expect.assertions(2);
        deletePromoCampaign.mockImplementationOnce(() => Promise.reject(new Error ('test error')));
        await expect(onConfirmDeletePromoCampaign(id, name)).rejects.toThrow('test error');
        expect(customNotifications.error).toHaveBeenCalledWith({
            message: 'test error',
        });

    });

});
