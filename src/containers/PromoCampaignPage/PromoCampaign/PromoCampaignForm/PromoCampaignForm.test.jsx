import React from 'react';
import { shallow, mount } from 'enzyme';
import PromoCampaignForm from './PromoCampaignForm';
import callConfirmModalForPromoCodeTypeChanging from './PromoCampaignSteps/ConfirmModalForPromoCodeTypeChanging/ConfirmModalForPromoCodeTypeChanging';
import { editPromoCampaign, newPromoCampaign, copyPromoCampaign } from '../../../../api/services/promoCampaignService';
import { getUnissuedPromoCodeStatistics } from '../../../../api/services/promoCodeService';
import { filterBanner, deleteText } from './PromoCampaignFormSave.utils';
import {
    createImgBanners,
    createTexts,
    createVisibilities,
    EditImgBanners,
    editTextBanners,
    getDataForSend,
    normalizePromoCampaignData,
    getPromoCampaignValue,
    checkPromoCodes,
} from './PromoCampaignFormUtils';
import {
    promoCampaignTestData,
    visibilitySettingLocation,
} from '../../../../../__tests__/constants';
import { sleep } from '../../../../setupTests';


let mockEmptyStateLocation = false;
let mockCopyVisibilitySettings = false;
const mockState = promoCampaignTestData;
const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
    useLocation: () => ({
        state: !mockEmptyStateLocation ? {
            promoCampaign: mockState,
            copyVisibilitySettings: mockCopyVisibilitySettings,
        } : undefined,
    }),
}));

jest.mock(
    './PromoCampaignSteps/ConfirmModalForPromoCodeTypeChanging/ConfirmModalForPromoCodeTypeChanging',
    () => jest.fn()
);

jest.mock('../../../../api/services/promoCampaignService', () => ({
    editPromoCampaign: jest.fn(),
    newPromoCampaign: jest.fn(),
    copyPromoCampaign: jest.fn(),
}));

jest.mock('../../../../api/services/promoCodeService', () => ({
    getUnissuedPromoCodeStatistics: jest.fn(),
}));

jest.mock('./PromoCampaignFormSave.utils', () => ({
    filterBanner: jest.fn(),
    deleteText: jest.fn(),
}));

jest.mock('./PromoCampaignFormUtils', () => ({
    ...jest.requireActual('./PromoCampaignFormUtils'),
    checkPromoCodes: jest.fn(),
    createImgBanners: jest.fn(),
    createTexts: jest.fn(),
    createVisibilities: jest.fn(),
    EditImgBanners: jest.fn(),
    editTextBanners: jest.fn(),
    getDataForSend: jest.fn(),
    getPromoCampaignForCopy: jest.fn(),
    normalizeFirstStepValue: jest.fn(),
    normalizePromoCampaignData: jest.fn(),
    getPromoCampaignValue: jest.fn(),
}));

jest.mock('./PromoCampaignSteps/StepInfo/StepInfo', () =>
    /* Сделано именно так, потому что нам нужно чтобы в редеринге enzyme отображалось имя компонента */
    function StepInfo() {
        return <div>StepInfo</div>;
    }
);

const testProps = {
    matchPath: '/test/path',
};

describe('<PromoCampaignForm.test.jsx', () => {
    const wrapper = shallow(<PromoCampaignForm { ...testProps } />);

    beforeEach(() => {
        wrapper.find('PromoCampaignSideBar').simulate('click', 1);
    });

    it('should render', () => {
        expect(wrapper.find('.headerTitle').text()).toBe('Новая промо-кампания');
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it('should render <StepInfo />', () => {
        expect(wrapper.find('StepInfo')).toHaveLength(1);
        expect(wrapper.find('StepTextAndImage')).toHaveLength(0);
        expect(wrapper.find('StepVisibility')).toHaveLength(0);
        expect(wrapper.find('.headerSteps').text()).toBe('Шаг 1 из 3');
        expect(wrapper.find('Button')).toHaveLength(3);
    });

    it('should render <StepTextAndImage />', () => {
        wrapper.find('PromoCampaignSideBar').simulate('click', 2);
        expect(wrapper.find('StepInfo')).toHaveLength(0);
        expect(wrapper.find('StepTextAndImage')).toHaveLength(1);
        expect(wrapper.find('StepVisibility')).toHaveLength(0);
        expect(wrapper.find('.headerSteps').text()).toBe('Шаг 2 из 3');
        expect(wrapper.find('Button')).toHaveLength(3);
    });

    it('should render <StepVisibility />', () => {
        wrapper.find('PromoCampaignSideBar').simulate('click', 3);
        expect(wrapper.find('StepInfo')).toHaveLength(0);
        expect(wrapper.find('StepTextAndImage')).toHaveLength(0);
        expect(wrapper.find('StepVisibility')).toHaveLength(1);
        expect(wrapper.find('.headerSteps').text()).toBe('Шаг 3 из 3');
        expect(wrapper.find('Button')).toHaveLength(2);
    });

    it('should render null inside <Form />', () => {
        wrapper.find('PromoCampaignSideBar').simulate('click', 0);
        const formWrapper = wrapper.find('ForwardRef(InternalForm)');
        expect(formWrapper.children()).toHaveLength(0);
    });

    it('should return to previous step', () => {
        wrapper.find('PromoCampaignSideBar').simulate('click', 2);
        expect(wrapper.find('PromoCampaignSideBar').prop('active')).toBe(2);

        wrapper.find('Header').simulate('clickFunc');
        expect(wrapper.find('PromoCampaignSideBar').prop('active')).toBe(1);
    });

    it('should call history.push() when click cancel button', () => {
        wrapper.find('Button').first().simulate('click');
        expect(mockHistoryPush).toBeCalledWith(testProps.matchPath);
    });

    it('should change validStep', async () => {
        console.error = jest.fn();
        expect(wrapper.find('PromoCampaignSideBar').prop('validStep')).toBe(1);
        expect(wrapper.find('PromoCampaignSideBar').prop('active')).toBe(1);
        wrapper.find('Button').at(1).simulate('click');
        await sleep();

        expect(wrapper.find('PromoCampaignSideBar').prop('validStep')).toBe(2);
        expect(wrapper.find('PromoCampaignSideBar').prop('active')).toBe(2);
    });

    it('should change validStep and step', async () => {
        wrapper.find('PromoCampaignSideBar').simulate('click', 2);
        expect(wrapper.find('PromoCampaignSideBar').prop('validStep')).toBe(2);
        expect(wrapper.find('PromoCampaignSideBar').prop('active')).toBe(2);

        wrapper.find('Button').at(1).simulate('click');
        await sleep();

        expect(wrapper.find('PromoCampaignSideBar').prop('validStep')).toBe(3);
        expect(wrapper.find('PromoCampaignSideBar').prop('active')).toBe(3);
    });

    it('check visibilitySettings empty error', () => {
        wrapper.find('PromoCampaignSideBar').simulate('click', 3);
        expect(wrapper.find('StepVisibility').prop('visibilitySettings')[0].errors).toEqual({});

        wrapper.find('Button').at(1).simulate('click');
        expect(wrapper.find('StepVisibility').prop('visibilitySettings')[0].errors).toEqual({ location: 'Укажите локацию' });
    });

    it('check visibilitySettings same settings error', () => {
        wrapper.find('PromoCampaignSideBar').simulate('click', 3);
        const StepVisibility = wrapper.find('StepVisibility');
        expect(StepVisibility.prop('visibilitySettings')[0].errors).toEqual({ location: 'Укажите локацию' });

        StepVisibility.simulate('changeState', visibilitySettingLocation, 0, 'location', {});

        expect(
            wrapper.find('StepVisibility').prop('visibilitySettings')[0].location
        ).toEqual(visibilitySettingLocation);

        wrapper.find('StepVisibility').simulate(
            'changeState',
            { location: null, salePoint: null, visible: false, errors: {}, id: Date.now() },
            1
        );

        expect(wrapper.find('StepVisibility').prop('visibilitySettings')).toHaveLength(2);

        wrapper.find('StepVisibility').simulate('changeState', visibilitySettingLocation, 1, 'location', {});

        wrapper.find('Button').at(1).simulate('click');
        const [firstSetting, secondSetting] = wrapper.find('StepVisibility').prop('visibilitySettings');
        expect(firstSetting.errors).toEqual({
            server: 'Нельзя добавить одинаковые настройки видимости с локацией \'Ростов\' ',
        });
        expect(secondSetting.errors).toEqual({
            server: 'Нельзя добавить одинаковые настройки видимости с локацией \'Ростов\' ',
        });
    });

    it('should delete second visibilitySetting', () => {
        wrapper.find('PromoCampaignSideBar').simulate('click', 3);

        wrapper.find('StepVisibility').simulate('deleteState', undefined);
        expect(wrapper.find('StepVisibility').prop('visibilitySettings')).toHaveLength(2);

        wrapper.find('StepVisibility').simulate('deleteState', 1, true);
        const visSettings = wrapper.find('StepVisibility').prop('visibilitySettings');
        expect(visSettings).toHaveLength(1);
        expect(visSettings[0].errors).toEqual({});
    });

    it('should call `newPromoCampaign` function and history.push', async () => {
        newPromoCampaign.mockReturnValue({ id: 99 });
        createTexts.mockReturnValue([]);
        createVisibilities.mockReturnValue([]);
        createImgBanners.mockResolvedValue();
        wrapper.find('PromoCampaignSideBar').simulate('click', 3);
        wrapper.find('Button').at(1).simulate('click');
        await sleep();

        expect(newPromoCampaign).toBeCalledTimes(1);
        expect(mockHistoryPush).toBeCalledTimes(1);
        expect(mockHistoryPush).toBeCalledWith(testProps.matchPath);
    });

    it('save promoCampaign should rejected and render error', async () => {
        newPromoCampaign.mockRejectedValue(new Error('test Error when create'));
        wrapper.find('PromoCampaignSideBar').simulate('click', 3);
        wrapper.find('Button').at(1).simulate('click');
        await sleep();

        expect(newPromoCampaign).toBeCalledTimes(1);
        expect(mockHistoryPush).toBeCalledTimes(0);
        expect(wrapper.find('.error').text()).toBe('test Error when create');
    });

    it('should change valid step when form value was changed', async () => {
        wrapper.find('Button').at(1).simulate('click');
        await sleep();
        wrapper.find('PromoCampaignSideBar').simulate('click', 1);

        expect(wrapper.find('PromoCampaignSideBar').prop('active')).toBe(1);
        expect(wrapper.find('PromoCampaignSideBar').prop('validStep')).toBe(2);

        wrapper.find('ForwardRef(InternalForm)').simulate('valuesChange', {
            banners: {
                ICON_MAIN: 'test_value',
            },
        });
        expect(wrapper.find('PromoCampaignSideBar').prop('active')).toBe(1);
        expect(wrapper.find('PromoCampaignSideBar').prop('validStep')).toBe(1);
    });

    it('should reject `newPromoCampaign` function when click on Save btn', async () => {
        newPromoCampaign.mockRejectedValue(new Error('new test Error when create'));
        getDataForSend.mockReturnValue({ test: 'test data for send' });
        wrapper.find('ForwardRef(InternalForm)').simulate('valuesChange', {
            test: 'test_change',
        });
        wrapper.find('Button').last().simulate('click');
        await sleep();

        expect(newPromoCampaign).toBeCalledTimes(1);
        expect(wrapper.find('.error').text()).toBe('new test Error when create');
    });

    it('should call `newPromoCampaign` function when click on Save btn', async () => {
        newPromoCampaign.mockReturnValue({ id: 99 });
        getDataForSend.mockReturnValue({ test: 'test data for send' });
        wrapper.find('Button').last().simulate('click');
        await sleep();

        expect(newPromoCampaign).toBeCalledTimes(1);
    });

    it('should reject call `editPromoCampaign` function', async () => {
        editPromoCampaign.mockRejectedValue(new Error('test reject edit'));
        wrapper.find('ForwardRef(InternalForm)').simulate('valuesChange', {
            test: 'test_change',
        });
        wrapper.find('Button').last().simulate('click');

        await sleep();

        expect(editPromoCampaign).toBeCalledTimes(1);
        expect(wrapper.find('.error').text()).toBe('test reject edit');
    });

    it('should call `editPromoCampaign` function', async () => {
        getDataForSend.mockReturnValue({ test: 'test data for send' });
        wrapper.find('Button').last().simulate('click');

        await sleep();
        expect(editPromoCampaign).toBeCalledTimes(1);
    });

    it('should call `callConfirmModalForPromoCodeTypeChanging` function', async () => {
        checkPromoCodes.mockReturnValue('newCodeType');
        getDataForSend.mockReturnValue({ test: 'test data for send', promoCodeType: 'testType' });
        callConfirmModalForPromoCodeTypeChanging.mockReturnValue(true);
        wrapper.find('ForwardRef(InternalForm)').simulate('valuesChange', {
            test: 'test_change',
        });
        wrapper.find('Button').last().simulate('click');

        await sleep();

        getPromoCampaignValue.mockReturnValue({ id: 99 });
        expect(callConfirmModalForPromoCodeTypeChanging).toBeCalledTimes(1);
        const [callback] = callConfirmModalForPromoCodeTypeChanging.mock.calls[0];
        await callback();

        expect(editPromoCampaign).toBeCalledTimes(1);
        expect(getUnissuedPromoCodeStatistics).toBeCalledTimes(1);
        expect(getUnissuedPromoCodeStatistics).toBeCalledWith(99, 'testType');
    });

    it('should call `editTextBanners` and `EditImgBanners`', async () => {
        getDataForSend.mockReturnValue({ test: 'test data for send' });
        editTextBanners.mockReturnValue([]);
        filterBanner.mockReturnValue({
            banners: [],
            texts: [],
        });
        EditImgBanners.mockResolvedValue({
            banners: [],
            deletedBannersId: [],
        });
        wrapper.find('PromoCampaignSideBar').simulate('click', 2);
        wrapper.find('ForwardRef(InternalForm)').simulate('valuesChange', {
            test: 'test_change',
        });
        wrapper.find('Button').last().simulate('click');

        await sleep();

        expect(editTextBanners).toBeCalledTimes(1);
        expect(EditImgBanners).toBeCalledTimes(1);
        expect(filterBanner).toBeCalledTimes(1);

        const callback = editTextBanners.mock.calls[0][3];
        deleteText.mockReturnValue({ texts: [] });
        callback(1, 'HEADER');
        expect(deleteText).toBeCalledTimes(1);
    });

    it('should call `editTextBanners`, `EditImgBanners` and newPromoCampaign functions', async () => {
        const wrapper = shallow(<PromoCampaignForm { ...testProps } />);
        newPromoCampaign.mockReturnValue({ id: 98 });
        getDataForSend.mockReturnValue({ test: 'test data for send' });
        editTextBanners.mockReturnValue([]);
        filterBanner.mockReturnValue({
            banners: [],
            texts: [],
        });
        EditImgBanners.mockResolvedValue({
            banners: [],
            deletedBannersId: [],
        });
        wrapper.find('PromoCampaignSideBar').simulate('click', 2);
        wrapper.find('ForwardRef(InternalForm)').simulate('valuesChange', {
            test: 'test_change',
        });
        wrapper.find('Button').last().simulate('click');

        await sleep();

        expect(editTextBanners).toBeCalledTimes(1);
        expect(EditImgBanners).toBeCalledTimes(1);
        expect(filterBanner).toBeCalledTimes(1);
        expect(newPromoCampaign).toBeCalledTimes(1);
    });

    it('should call `callConfirmModalForPromoCodeTypeChanging` function when edit', async () => {
        checkPromoCodes.mockReturnValue('newTestType');
        getPromoCampaignValue.mockReturnValue({ id: 92 });
        getDataForSend.mockReturnValue({ banners: [], texts: [] });
        editTextBanners.mockReturnValue([]);
        createVisibilities.mockReturnValue([]);
        EditImgBanners.mockResolvedValue({
            banners: [],
            deletedBannersId: [],
        });
        wrapper.find('PromoCampaignSideBar').simulate('click', 3);
        wrapper.find('Button').last().simulate('click');
        await sleep();

        expect(callConfirmModalForPromoCodeTypeChanging).toBeCalledTimes(1);
        const [callback] = callConfirmModalForPromoCodeTypeChanging.mock.calls[0];
        await callback();

        expect(getUnissuedPromoCodeStatistics).toBeCalledTimes(1);
        expect(editPromoCampaign).toBeCalledTimes(1);
        expect(editTextBanners).toBeCalledTimes(1);
        expect(EditImgBanners).toBeCalledTimes(1);
        expect(createVisibilities).toBeCalledTimes(1);
        expect(mockHistoryPush).toBeCalledTimes(1);
    });

    it('should call edit functions. First time - reject, second - resolve', async () => {
        checkPromoCodes.mockReturnValue(null);
        getPromoCampaignValue.mockReturnValue({ id: 92 });
        getDataForSend.mockReturnValue({ banners: [], texts: [] });
        editTextBanners.mockReturnValue([]);
        createVisibilities.mockReturnValue([]);
        EditImgBanners.mockResolvedValue({
            banners: [],
            deletedBannersId: [],
        });
        editPromoCampaign
            .mockRejectedValueOnce(new Error('error while edit'))
            .mockResolvedValueOnce('success edit');

        wrapper.find('PromoCampaignSideBar').simulate('click', 3);
        wrapper.find('Button').last().simulate('click');
        await sleep();

        // expect calls of functions when reject
        expect(callConfirmModalForPromoCodeTypeChanging).toBeCalledTimes(0);
        expect(getUnissuedPromoCodeStatistics).toBeCalledTimes(0);
        expect(editPromoCampaign).toBeCalledTimes(1);
        expect(editTextBanners).toBeCalledTimes(0);
        expect(EditImgBanners).toBeCalledTimes(0);
        expect(createVisibilities).toBeCalledTimes(0);
        expect(mockHistoryPush).toBeCalledTimes(0);
        expect(wrapper.find('.error').text()).toBe('error while edit');

        wrapper.find('PromoCampaignSideBar').simulate('click', 3);
        wrapper.find('Button').last().simulate('click');
        await sleep();

        // expect calls of functions when resolve
        expect(callConfirmModalForPromoCodeTypeChanging).toBeCalledTimes(0);
        expect(getUnissuedPromoCodeStatistics).toBeCalledTimes(0);
        expect(editPromoCampaign).toBeCalledTimes(2);
        expect(editTextBanners).toBeCalledTimes(1);
        expect(EditImgBanners).toBeCalledTimes(1);
        expect(createVisibilities).toBeCalledTimes(1);
        expect(mockHistoryPush).toBeCalledTimes(1);
    });

    it('should don`t call functions with empty visibilitySettings', async () => {
        checkPromoCodes.mockReturnValue(null);
        wrapper.find('PromoCampaignSideBar').simulate('click', 3);
        wrapper.find('StepVisibility').simulate('changeState', null, 0, 'location');
        wrapper.find('Button').last().simulate('click');
        await sleep();

        expect(callConfirmModalForPromoCodeTypeChanging).toBeCalledTimes(0);
        expect(getUnissuedPromoCodeStatistics).toBeCalledTimes(0);
        expect(editPromoCampaign).toBeCalledTimes(0);
        expect(editTextBanners).toBeCalledTimes(0);
        expect(EditImgBanners).toBeCalledTimes(0);
        expect(createVisibilities).toBeCalledTimes(0);
        expect(mockHistoryPush).toBeCalledTimes(0);
        expect(
            wrapper.find('StepVisibility').prop('visibilitySettings')[0].errors
        ).toEqual({ location: 'Укажите локацию' });
    });

    it('should clear texts and banners in state', () => {
        wrapper.find('StepInfo').prop('changeTypePromo')();
        wrapper.find('PromoCampaignSideBar').simulate('click', 2);
        expect(wrapper.find('StepTextAndImage').prop('texts')).toEqual({});
        expect(wrapper.find('StepTextAndImage').prop('banners')).toEqual({});
    });

    describe('<PromoCampaignForm /> tests with `isCopy = true` prop', () => {
        const wrapper = shallow(
            <PromoCampaignForm
                { ...testProps }
                mode="edit"
                isCopy
            />
        );

        beforeEach(() => {
            wrapper.find('PromoCampaignSideBar').simulate('click', 1);
            getDataForSend.mockReturnValue({ banners: [], texts: [] });
            editTextBanners.mockReturnValue([]);
            createVisibilities.mockReturnValue([]);
            EditImgBanners.mockResolvedValue({
                banners: [],
                deletedBannersId: [],
            });
        });

        it('check function `handleNextStep` and `copyVisibilitySettings = true`', async () => {
            mockCopyVisibilitySettings = true;
            wrapper.update();
            copyPromoCampaign.mockReturnValue(promoCampaignTestData);
            getPromoCampaignValue.mockReturnValue({ id: 11 });

            wrapper.find('PromoCampaignSideBar').simulate('click', 2);
            wrapper.find('Button').at(1).simulate('click');
            await sleep();

            expect(copyPromoCampaign).toBeCalledTimes(1);
            expect(editPromoCampaign).toBeCalledTimes(0);
            expect(editTextBanners).toBeCalledTimes(1);
            expect(EditImgBanners).toBeCalledTimes(1);
            expect(createVisibilities).toBeCalledTimes(0);
            expect(mockHistoryPush).toBeCalledTimes(1);

            mockCopyVisibilitySettings = false;
            wrapper.update();
        });

        it('check function `handleNextStep` and `copyVisibilitySettings = false`. should not call without visibilitySettings', async () => {
            wrapper.find('PromoCampaignSideBar').simulate('click', 3);
            expect(
                wrapper.find('StepVisibility').prop('visibilitySettings')[0].errors
            ).toEqual({});
            wrapper.find('Button').at(1).simulate('click');
            await sleep();

            expect(copyPromoCampaign).toBeCalledTimes(0);
            expect(editPromoCampaign).toBeCalledTimes(0);
            expect(editTextBanners).toBeCalledTimes(0);
            expect(EditImgBanners).toBeCalledTimes(0);
            expect(createVisibilities).toBeCalledTimes(0);
            expect(mockHistoryPush).toBeCalledTimes(0);
            expect(
                wrapper.find('StepVisibility').prop('visibilitySettings')[0].errors
            ).toEqual({ location: 'Укажите локацию' });
        });

        it('check function `handleNextStep` and `copyVisibilitySettings = false`', async () => {
            copyPromoCampaign.mockReturnValue(promoCampaignTestData);
            getPromoCampaignValue.mockReturnValue({ id: 11 });

            wrapper.find('PromoCampaignSideBar').simulate('click', 3);
            wrapper.find('StepVisibility').simulate('changeState', visibilitySettingLocation, 0, 'location', {});
            wrapper.find('Button').at(1).simulate('click');
            await sleep();

            expect(copyPromoCampaign).toBeCalledTimes(1);
            expect(editPromoCampaign).toBeCalledTimes(0);
            expect(editTextBanners).toBeCalledTimes(1);
            expect(EditImgBanners).toBeCalledTimes(1);
            expect(createVisibilities).toBeCalledTimes(1);
            expect(mockHistoryPush).toBeCalledTimes(1);
        });

        it('should call `copyPromoCampaign` when click saveBtn', async () => {
            copyPromoCampaign.mockReturnValue(promoCampaignTestData);
            getPromoCampaignValue.mockReturnValue({ id: 11 });
            normalizePromoCampaignData.mockReturnValue({
                ...promoCampaignTestData,
                banners: {},
                texts: {},
            });

            wrapper.find('Button').last().simulate('click');
            await sleep();

            expect(copyPromoCampaign).toBeCalledTimes(1);
            expect(editPromoCampaign).toBeCalledTimes(0);

            wrapper.find('ForwardRef(InternalForm)').simulate('valuesChange', {
                test: 'test_change',
            });
            wrapper.find('Button').last().simulate('click');
            await sleep();

            expect(editPromoCampaign).toBeCalledTimes(1);
            expect(copyPromoCampaign).toBeCalledTimes(1);
        });

        it('should call `editPromoCampaign` after success copy and next click Done Btn', async () => {
            getPromoCampaignValue.mockReturnValue(promoCampaignTestData);
            checkPromoCodes.mockReturnValue(null);
            createVisibilities.mockReturnValue([]);
            wrapper.find('PromoCampaignSideBar').simulate('click', 3);
            wrapper.find('Button').last().simulate('click');
            await sleep();

            expect(copyPromoCampaign).toBeCalledTimes(0);
            expect(editPromoCampaign).toBeCalledTimes(1);
        });

        it('should call `editPromoCampaign` after success copy and next click Done Btn on second step', async () => {
            getPromoCampaignValue.mockReturnValue(promoCampaignTestData);
            checkPromoCodes.mockReturnValue(null);
            createVisibilities.mockReturnValue([]);
            filterBanner.mockReturnValue({
                banners: [],
                texts: [],
            });
            wrapper.find('PromoCampaignSideBar').simulate('click', 2);
            wrapper.find('Button').last().simulate('click');
            await sleep();

            expect(copyPromoCampaign).toBeCalledTimes(0);
            expect(editPromoCampaign).toBeCalledTimes(1);
            expect(editTextBanners).toBeCalledTimes(1);
            expect(EditImgBanners).toBeCalledTimes(1);
        });
    });

    describe('<PromoCampaignForm /> tests useEffect', () => {

        it('should call history.push', async () => {
            mockEmptyStateLocation = true;
            mount(<PromoCampaignForm { ...testProps } mode="edit" />);

            expect(mockHistoryPush).toBeCalledTimes(1);
            expect(mockHistoryPush).toBeCalledWith(testProps.matchPath);
            mockEmptyStateLocation = false;
        });

        it('should don`t render loading block and validStep = 1', () => {
            const wrapper = mount(<PromoCampaignForm { ...testProps } />);
            expect(wrapper.find('.loadingWrapper')).toHaveLength(0);
            expect(wrapper.find('PromoCampaignSideBar').prop('validStep')).toBe(1);
        });

        it('should don`t render loading block and validStep = 3', () => {
            normalizePromoCampaignData.mockReturnValue(promoCampaignTestData);
            const wrapper = mount(<PromoCampaignForm { ...testProps } mode="edit" />);
            expect(wrapper.find('.loadingWrapper')).toHaveLength(0);
            expect(wrapper.find('PromoCampaignSideBar').prop('validStep')).toBe(3);
        });

    });
});
