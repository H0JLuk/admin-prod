import React from 'react';
import { generatePath } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { shallow } from 'enzyme';
import { message } from 'antd';

import PromoCampaignVisibilitySetting from './PromoCampaignVisibilitySetting';
import { act } from 'react-dom/test-utils';
import { changeVisibleOfVisibilitySettings, deletePromoCampaignVisibilitySetting, editPromoCampaignVisibilitySetting, getPromoCampaignVisibilitySettings } from '../../../../api/services/promoCampaignService';
import { getSearchParamsFromUrl } from '../../../../utils/helper';
import { visibilitySettingTestData, promoCampaignTestData } from '../../../../../__tests__/constants';
import { getPathForCreatePromoCampaignVisibititySetting } from '../../../../utils/appNavigation';
import { sleep } from '../../../../setupTests';


const defaultParams = {
    pageNo: 0,
    pageSize: 10,
    sortBy: 'id',
    direction: 'ASC',
    filterText: '',
    totalElements: 0,
};

jest.mock('../../../../components/Header/Header', () => () => (<div id="#header">Header</div>));

jest.mock('../../../../utils/appNavigation', () => ({
    getPathForCreatePromoCampaignVisibititySetting: jest.fn(),
}));

jest.mock('../../../../api/services/promoCampaignService', () => ({
    getPromoCampaignVisibilitySettings: jest.fn(),
    editPromoCampaignVisibilitySetting: jest.fn(),
    changeVisibleOfVisibilitySettings: jest.fn(),
    deletePromoCampaignVisibilitySetting: jest.fn(),
}));

jest.mock('../../../../utils/helper', () => ({
    getSearchParamsFromUrl: jest.fn(),
}));

jest.mock('antd', () => ({
    ...jest.requireActual('antd'),
    message: {
        error: jest.fn(),
    }
}));

const mockHistoryPush = jest.fn();
const mockHistoryReplace = jest.fn();
const mockPromoCampaign = promoCampaignTestData;
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    generatePath: jest.fn(),
    useHistory: () => ({
        push: mockHistoryPush,
        replace: mockHistoryReplace,
        location: {
            search: '?pageNo=0&pageSize=10&sortBy=id&direction=ASC&filterText=',
        },
    }),
    useRouteMatch: () => ({
        url: '/admin/promo-campaign/24/edit',
    }),
    useParams: () => ({
        promoCampaignId: '24',
    }),
    useLocation: () => ({
        search: '?pageNo=0&pageSize=10&sortBy=id&direction=ASC&filterText=',
        state: {
            promoCampaign: mockPromoCampaign,
        },
    }),
}));

const urlSearchParams = 'pageNo=0&pageSize=10&sortBy=id&direction=ASC&filterText=';

const getSearchParamsFromUrlResult = {
    pageNo: '0',
    pageSize: '10',
    sortBy: 'id',
    direction: 'ASC',
    filterText: '',
    totalElements: 0,
};

beforeEach(() => {
    getPromoCampaignVisibilitySettings.mockResolvedValue(visibilitySettingTestData);
    getSearchParamsFromUrl.mockReturnValue(getSearchParamsFromUrlResult);
});

describe('<PromoCampaignVisibilitySetting /> tests', () => {
    const props = {
        searchAndSortMode: false,
        hideHeader: false,
        addNewByModal: true,
    };

    it('PromoCampaignVisibilitySetting snapshot', () => {
        const wrapper = shallow(<PromoCampaignVisibilitySetting { ...props } />);
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it('should run loadData', async () => {
        await act(async () => {
            render(<PromoCampaignVisibilitySetting { ...props } />);
            await sleep();
            expect(getSearchParamsFromUrl).toBeCalledWith(`?${urlSearchParams}`, defaultParams);
            expect(getPromoCampaignVisibilitySettings).toBeCalledWith('24', urlSearchParams);
            expect(mockHistoryReplace).toBeCalled();
        });
    });

    it('should reject loadData', async () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => '');
        getPromoCampaignVisibilitySettings.mockRejectedValueOnce('error');
        await act(async () => {
            render(<PromoCampaignVisibilitySetting { ...props } />);
            await sleep();
            expect(spy).toHaveBeenCalled();
        });
    });

    it('should run enableSelection / disableSelection', async () => {
        await act(async () => {
            const { getByText } = render(<PromoCampaignVisibilitySetting { ...props } />);
            await sleep();
            fireEvent.click(getByText(/Выбрать/));
            expect(getByText(/Выбрано настроек: 0/)).toBeInTheDocument();
            fireEvent.click(getByText(/Отмена/));
            expect(getByText(/Выбрать/)).toBeInTheDocument();
        });
    });

    it('should run changeVisible on switch click', async () => {
        editPromoCampaignVisibilitySetting.mockResolvedValue('');
        await act(async () => {
            const { container } = render(<PromoCampaignVisibilitySetting { ...props } />);
            await sleep();
            const switchBtn = container.querySelector('.ant-switch');
            fireEvent.click(switchBtn);
            expect(editPromoCampaignVisibilitySetting).toBeCalledTimes(1);
        });
    });

    it('should render error message on changeVisible run', async () => {
        editPromoCampaignVisibilitySetting.mockRejectedValueOnce('error');
        const spy = jest.spyOn(console, 'error').mockImplementation(() => '');
        await act(async () => {
            const { container } = render(<PromoCampaignVisibilitySetting { ...props } />);
            await sleep();
            const switchBtn = container.querySelector('.ant-switch');
            fireEvent.click(switchBtn);
            await sleep();
            expect(message.error).toBeCalled();
            expect(spy).toHaveBeenCalled();
        });
    });

    it('should run changeVisibleAll', async () => {
        changeVisibleOfVisibilitySettings.mockResolvedValue('');
        await act(async () => {
            const { getByText } = render(<PromoCampaignVisibilitySetting { ...props } />);
            await sleep();
            fireEvent.click(getByText(/Выбрать/));
            fireEvent.click(getByText(/Выбрать все/));
            fireEvent.click(getByText(/Включить все/));
            expect(changeVisibleOfVisibilitySettings).toBeCalled();
        });
    });

    it('should render error message on changeVisibleAll run', async () => {
        changeVisibleOfVisibilitySettings.mockRejectedValueOnce('error');
        await act(async () => {
            const { getByText } = render(<PromoCampaignVisibilitySetting { ...props } />);
            await sleep();
            fireEvent.click(getByText(/Выбрать/));
            fireEvent.click(getByText(/Выбрать все/));
            fireEvent.click(getByText(/Включить все/));
            fireEvent.click(getByText(/Выключить все/));
            expect(changeVisibleOfVisibilitySettings).toBeCalledTimes(2);
        });
    });

    it('should run onDelete fns', async () => {
        deletePromoCampaignVisibilitySetting.mockResolvedValue('');
        await act(async () => {
            const { getByText } = render(<PromoCampaignVisibilitySetting { ...props } />);
            await sleep();
            fireEvent.click(getByText(/Выбрать/));
            fireEvent.click(getByText(/Выбрать все/));
            fireEvent.click(getByText(/Удалить/));
            expect(deletePromoCampaignVisibilitySetting).toBeCalledTimes(11);
            expect(getPromoCampaignVisibilitySettings).toBeCalledWith('24', urlSearchParams);
        });
    });

    it('should log error message in console after run onDelete fn', async () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => '');
        deletePromoCampaignVisibilitySetting.mockRejectedValueOnce('error');

        await act(async () => {
            const { getByText } = render(<PromoCampaignVisibilitySetting { ...props } />);
            await sleep();
            fireEvent.click(getByText(/Выбрать/));
            fireEvent.click(getByText(/Выбрать все/));
            fireEvent.click(getByText(/Удалить/));
            await sleep();
            expect(spy).toBeCalled();
        });
    });

    it('should run onCreate fn', async () => {
        const path = '/admin/promo-campaign/:promoCampaignId/visibility-setting/create';
        const generatePathResult = path.replace(':promoCampaignId', '24');
        const newProps = { ...props, addNewByModal: false };

        getPathForCreatePromoCampaignVisibititySetting.mockReturnValue(path);
        generatePath.mockReturnValue(generatePathResult);
        await act(async () => {
            const { getByText } = render(<PromoCampaignVisibilitySetting { ...newProps } />);
            await sleep();
            fireEvent.click(getByText(/Добавить/));
            expect(getPathForCreatePromoCampaignVisibititySetting).toBeCalled();
            expect(generatePath).toBeCalledWith(path, { promoCampaignId: '24' });
            expect(mockHistoryPush).toBeCalledWith(generatePathResult);
        });
    });

    it('should select item by click on the row', async () => {
        await act(async () => {
            const { getByText, container } = render(<PromoCampaignVisibilitySetting { ...props } />);
            await sleep();
            fireEvent.click(getByText(/Выбрать/));
            const tr = container.querySelector('.ant-table-row.ant-table-row-level-0');
            const checkbox = container.querySelector('.ant-checkbox-input');
            fireEvent.click(tr);
            expect(checkbox.checked).toBe(true);
            fireEvent.click(tr);
            expect(checkbox.checked).toBe(false);
        });
    });

    it('should run load data after new page rendered', async () => {
        await act(async () => {
            const { container } = render(<PromoCampaignVisibilitySetting { ...props } />);
            await sleep();
            const page2 = container.querySelectorAll('.ant-pagination-item')[1];
            fireEvent.click(page2);
            expect(getPromoCampaignVisibilitySettings).toBeCalledWith('24', urlSearchParams);
        });
    });

    it('run onChangeSort after change sort param', async () => {
        const newProps = { ...props, searchAndSortMode: true };
        await act(async () => {
            const { getByText, queryAllByText } = render(<PromoCampaignVisibilitySetting { ...newProps } />);
            await sleep();
            fireEvent.click(getByText(/Сортировать/));
            fireEvent.click(screen.getByText(/По локации/));
            expect(queryAllByText(/По локации/)[0]).toBeInTheDocument();
        });
    });

    it('should show/close modal', async () => {
        await act(async () => {
            const { getByText } = render(<PromoCampaignVisibilitySetting { ...props } />);
            await sleep();
            fireEvent.click(getByText(/Добавить/));
            await sleep();
            expect(document.querySelector('.ant-modal')).toBeInTheDocument();

            fireEvent.click(document.querySelector('.ant-modal-close-x'));
            await sleep();

            expect(document.querySelector('.ant-modal')).toBe(null);
        });
    });

    it('should run forceUpdate fn', async () => {
        await act(async () => {
            const wrapper = shallow(<PromoCampaignVisibilitySetting { ...props } />);
            wrapper.find('PromoCampaignVisibilitySettingModal').prop('forceUpdate')();
            await sleep();
            expect(getPromoCampaignVisibilitySettings).toBeCalledWith('24', urlSearchParams);
        });
    });

    it('should render header', async () => {
        await act(async () => {
            const { getByText } = render(<PromoCampaignVisibilitySetting { ...props } />);
            await sleep();
            expect(getByText('Header')).toBeInTheDocument();
        });
    });

    it('should not render header', async () => {
        const newProps = { ...props, hideHeader: true };
        await act(async () => {
            const { queryAllByText } = render(<PromoCampaignVisibilitySetting { ...newProps } />);
            await sleep();
            expect(queryAllByText('Header')).toHaveLength(0);
        });
    });
});
