import React from 'react';
import Form from 'antd/lib/form/Form';
import { act, render } from '@testing-library/react';
import { shallow } from 'enzyme';
import StepInfo, { DisableBannersSwitch, ReverseSwitch } from './StepInfo';

import { getAppCode } from '../../../../../../api/services/sessionService';
import { getDzoList } from '../../../../../../api/services/dzoService';
import { getActiveClientApps } from '../../../../../../api/services/clientAppService';
import { getCategoryList } from '../../../../../../api/services/categoryService';
import {
    getExactExternalIDPromoCampaignList,
    getExactFilteredPromoCampaignList,
} from '../../../../../../api/services/promoCampaignService';
import {
    dzoListTestData,
    categoryListTestData,
    promoCampaignTestData,
    clientAppListTestResponse,
} from '../../../../../../../__tests__/constants';

jest.mock('../../../../../../utils/validators', () => ({
    ...jest.requireActual('../../../../../../utils/validators'),
    getPatternAndMessage: jest.fn(),
}));

jest.mock('../../../../../../components/LabelWithTooltip/LabelWithTooltip', () => ({
    getLabel: jest.fn(),
}));

jest.mock('../../../../../../api/services/sessionService', () => ({
    getAppCode: jest.fn(),
}));

jest.mock('../../../../../../api/services/dzoService', () => ({
    getDzoList: jest.fn(),
}));

jest.mock('../../../../../../api/services/clientAppService', () => ({
    getActiveClientApps: jest.fn(),
}));

jest.mock('../../../../../../api/services/categoryService', () => ({
    getCategoryList: jest.fn(),
}));

jest.mock('../../../../../../api/services/promoCampaignService', () => ({
    getExactExternalIDPromoCampaignList: jest.fn(),
    getExactFilteredPromoCampaignList: jest.fn(),
}));


const wrappedForm = Component => shallow(
    <Form>
        { Component }
    </Form>
);

describe('<StepInfo /> create mode tests.', () => {
    const promoCampaignState = {
        name: '',
        dzoId: null,
        webUrl: '',
        datePicker: [],
        promoCodeType: null,
        active: false,
        offerDuration: 90,
        startDate: '',
        finishDate: '',
        externalId: '',
        type: '',
        categoryIdList: [],
        appCode: null,
        standalone: false,
        settings: {
            priority_on_web_url: false,
            alternative_offer_mechanic: false,
            details_button_label: '',
            details_button_url: '',
        },
    };

    const props = {
        state: { ...promoCampaignState },
        changeTypePromo: jest.fn(),
        isCopy: false,
        oldName: '',
        mode: 'create',
        copyPromoCampaignId: null,
        oldExternalId: undefined,
    };
    const wrapper = wrappedForm(<StepInfo { ...props } />);
    const component = wrapper.find('StepInfo').dive();
    const formItems = component.find('FormItem');

    it('should match snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
    });

    describe('test for `name` field', () => {
        const field = formItems.findWhere(el => el.prop('name') === 'name');

        it('check initialValue and `normalize` function', () => {
            expect(field.prop('initialValue')).toBe('');
            const normalizeFunc = field.prop('normalize');
            expect(normalizeFunc('   ')).toBe('');
            expect(normalizeFunc('test')).toBe('test');
        });

        it('check validate function for check same name when no isCopy', async () => {
            const resolveSpy = jest.spyOn(Promise, 'resolve');
            const func = field.prop('rules')[2];
            const { validator } = func({
                getFieldValue: () => 'test-code2',
            });

            await validator('', 'test');
            expect(resolveSpy).toBeCalled();
        });

        it('check validate function for check same name on server', async () => {
            const func = field.prop('rules')[3];
            let validator;
            expect.assertions(3);
            /* should throw error if not exist appCode */
            ({ validator } = func({
                getFieldValue: () => '',
            }));
            await expect(validator('', '')).rejects.toThrow('Для проверки имени нужно выбрать витрину!');
            /* should throw error if not exist appCode */

            /* should throw error if name exist on server */
            ({ validator } = func({
                getFieldValue: () => 'test-code',
            }));
            getExactFilteredPromoCampaignList.mockReturnValue({
                promoCampaignDtoList: [promoCampaignTestData],
            });
            await expect(validator('', 'testName')).rejects.toThrow('Промо кампания с таким именем уже существует! Введите другое имя');
            expect(getExactFilteredPromoCampaignList).toBeCalledWith('testName', 'test-code');
        });
    });

    describe('test for `categoryListId` field', () => {
        const field = formItems.findWhere(el => el.prop('name') === 'categoryIdList');

        it('check initialValue and `normalize` function', () => {
            expect(field.prop('initialValue')).toEqual([]);
            const normalizeFunc = field.prop('normalize');
            expect(normalizeFunc(['1', 2, '3'])).toEqual([1, 2, 3]);
            expect(normalizeFunc([1, 2, 3])).toEqual([1, 2, 3]);
        });
    });

    it('check initialValue for `settings.priorityOnWebUrl` field', () => {
        const field = formItems.findWhere(
            el => el.prop('name')?.[0] === 'settings' && el.prop('name')[1] === 'priority_on_web_url'
        );
        expect(field.prop('initialValue')).toBe('DZO');
    });

    it('check initialValue for `settings.alternativeOfferMechanic` field', () => {
        const field = formItems.findWhere(
            el => el.prop('name')?.[0] === 'settings' && el.prop('name')[1] === 'alternative_offer_mechanic'
        );
        expect(field.prop('initialValue')).toBe(false);
    });

    it('check initialValue for `datePicker` field', () => {
        const field = formItems.findWhere(el => el.prop('name') === 'datePicker');
        expect(field.prop('initialValue')).toEqual([]);
    });

    it('check initialValue for `standalone` field', () => {
        const field = formItems.findWhere(el => el.prop('name') === 'standalone');
        expect(field.prop('initialValue')).toBe(false);
    });

    it('check initialValue for `promoCodeType` field', () => {
        const field = formItems.findWhere(el => el.prop('name') === 'promoCodeType');
        expect(field.prop('initialValue')).toBe(null);
    });

    describe('test `externalId` field', () => {
        const field = formItems.findWhere(el => el.prop('name') === 'externalId');

        it('check initialValue and `normalize` function', () => {
            expect(field.prop('initialValue')).toBe('');
            const normalizeFunc = field.prop('normalize');
            expect(normalizeFunc('   ')).toBe('');
            expect(normalizeFunc('test')).toBe('test');
            expect(normalizeFunc('test   ')).toBe('test');
            expect(normalizeFunc('   test   ')).toBe('test');
        });

        it('check validate function if isCopy = false', async () => {
            const resolveSpy = jest.spyOn(Promise, 'resolve');
            const { validator } = field.prop('rules')[0];

            await validator('', 'test');
            expect(resolveSpy).toBeCalled();
        });

        it('check validate function when exists campaign on server with same externalId', async () => {
            const { validator } = field.prop('rules')[1];

            /* should throw error if externalId exist on server */
            getExactExternalIDPromoCampaignList.mockReturnValue({
                promoCampaignDtoList: [promoCampaignTestData],
            });
            await expect(validator('', 'testId')).rejects.toThrow();
            expect(getExactExternalIDPromoCampaignList).toBeCalledWith('testId');
        });
    });

    it('should call requests to server', async () => {
        getDzoList.mockReturnValue({
            dzoDtoList: dzoListTestData,
        });
        getCategoryList.mockReturnValue({
            categoryList: categoryListTestData,
        });
        getActiveClientApps.mockReturnValue(clientAppListTestResponse.list);

        await act(async () => {
            render(
                <Form>
                    <StepInfo { ...props } />
                </Form>
            );
        });

        expect(getDzoList).toBeCalledTimes(1);
        expect(getCategoryList).toBeCalledTimes(1);
        expect(getActiveClientApps).toBeCalledTimes(1);
    });

});

describe('<StepInfo /> copy mode tests', () => {
    const promoCampaignState = {
        name: 'test name',
        dzoId: 0,
        webUrl: '',
        datePicker: [],
        promoCodeType: null,
        active: true,
        offerDuration: 90,
        startDate: '',
        finishDate: '',
        externalId: 'testID',
        type: 'NORMAL',
        categoryIdList: [],
        appCode: 'test-code',
        standalone: false,
        settings: {
            priorityOnWebUrl: false,
            alternativeOfferMechanic: false,
        },
    };

    const props = {
        state: { ...promoCampaignState },
        changeTypePromo: jest.fn(),
        isCopy: true,
        oldName: 'test name',
        mode: 'edit',
        copyPromoCampaignId: null,
        oldExternalId: 'testID',
    };
    const wrapper = wrappedForm(<StepInfo { ...props } />);
    const component = wrapper.find('StepInfo').dive();
    const formItems = component.find('FormItem');

    describe('tests for `name` field', () => {
        const field = formItems.findWhere(el => el.prop('name') === 'name');

        it('check initialValue', () => {
            expect(field.prop('initialValue')).toBe('Копия: test name');
        });

        it('check validate function for check same name when isCopy = true', async () => {
            const resolveSpy = jest.spyOn(Promise, 'resolve');
            const rejectSpy = jest.spyOn(Promise, 'reject');
            const func = field.prop('rules')[2];
            const { validator } = func({
                getFieldValue: () => 'test-code2',
            });
            getAppCode
                .mockReturnValue('test')
                .mockReturnValueOnce('test-code2');
            expect.assertions(4);

            /* should throw error */
            try {
                await validator('', 'test name');
            } catch (e) {
                // eslint-disable-next-line jest/no-try-expect
                expect(rejectSpy).toBeCalled();
                // eslint-disable-next-line jest/no-try-expect
                expect(getAppCode).toBeCalledTimes(1);
            }
            /* should throw error */

            /* should resolve */
            await validator('', 'test name');
            expect(resolveSpy).toBeCalled();
            expect(getAppCode).toBeCalledTimes(2);
            /* should resolve */
        });
    });

    describe('test `externalId` field', () => {
        const field = formItems.findWhere(el => el.prop('name') === 'externalId');

        it('check initialValue function', () => {
            expect(field.prop('initialValue')).toBe(props.state.externalId);
        });

        it('check validate function if isCopy = true', async () => {
            const resolveSpy = jest.spyOn(Promise, 'resolve');
            const rejectSpy = jest.spyOn(Promise, 'reject');
            const { validator } = field.prop('rules')[0];
            expect.assertions(2);

            try {
                await validator('', 'testID');
            } catch (e) {
                // eslint-disable-next-line jest/no-try-expect
                expect(rejectSpy).toBeCalledTimes(1);
            }

            await validator('', 'newTestId');
            expect(resolveSpy).toBeCalledTimes(1);
        });

    });
});


describe('<ReverseSwitch /> test.', () => {
    const onChange = jest.fn();

    it('Switch checked prop should be inverse from incoming checked prop', () => {
        const wrapper = shallow(<ReverseSwitch checked={ false } onChange={ onChange } />);
        const switchComp = wrapper.find('Switch');
        expect(switchComp.prop('checked')).toBe(true);
        switchComp.simulate('change', false);
        expect(onChange).toBeCalledWith(true);
    });

});

describe('<DisableBannersSwitch /> test', () => {
    const defaultProps = {
        onChange: jest.fn(),
        controlledValue: 'TEST_VALUE',
        value: ['someValue'],
    };

    it('should add value to array', () => {
        const wrapper = shallow(<DisableBannersSwitch { ...defaultProps } />);
        const switchComp = wrapper.find('Switch');

        expect(switchComp.prop('checked')).toBe(true);
        switchComp.simulate('change', false);
        expect(defaultProps.onChange).toBeCalledTimes(1);
        expect(defaultProps.onChange).toBeCalledWith([...defaultProps.value, defaultProps.controlledValue]);
    });

    it('should remove value from array', () => {
        const wrapper = shallow(
            <DisableBannersSwitch
                { ...defaultProps }
                value={ [...defaultProps.value, defaultProps.controlledValue] }
            />
        );
        const switchComp = wrapper.find('Switch');

        expect(switchComp.prop('checked')).toBe(false);
        switchComp.simulate('change', true);
        expect(defaultProps.onChange).toBeCalledTimes(1);
        expect(defaultProps.onChange).toBeCalledWith(defaultProps.value);
    });
});
