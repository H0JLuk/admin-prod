import React from 'react';
import DzoForm from './DzoForm';
import { fireEvent, render } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { sleep } from '../../../setupTests';
import {
    addApplication,
    addDzo,
    deleteApp,
    deleteDzo,
    updateApp,
    updateDzo,
} from '../../../api/services/dzoService';
import {
    checkBackendErrors,
    errorsToForm,
    makeErrorAndSuccessObj,
    serializeBannersAndDzoData,
} from './dzoFormFunctions';

const props = {
    type: 'edit',
    matchPath: 'matchPath',
};
const mockHistoryPush = jest.fn();
const mockHistoryReplace = jest.fn();

jest.mock('./dzoFormFunctions', () => {
    const originalModule = jest.requireActual('./dzoFormFunctions');
    return {
        ...originalModule,
        serializeBannersAndDzoData: jest.fn(),
        makeErrorAndSuccessObj: jest.fn(),
        errorsToForm: jest.fn(),
        checkBackendErrors: jest.fn(),
    };
});

jest.mock('../../../api/services/dzoService', () => ({
    deleteDzo: jest.fn(),
    deleteApp: jest.fn(),
    updateApp: jest.fn(),
    addApplication: jest.fn(),
    updateDzo: jest.fn(),
    addDzo: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    useLocation: jest.fn(),
    useHistory: () => ({
        push: mockHistoryPush,
        replace: mockHistoryReplace,
    }),
}));

const dzoId = 67;

const applicationList = [
    {
        applicationId: 71,
        applicationType: 'IOS',
        applicationUrl: 'https://sberhealth.ru/',
        deleted: false,
        dzoId,
    },
];

const changeInputByPlaceholder = (getByPlaceholderText, placeholder, text) => {
    fireEvent.change(getByPlaceholderText(placeholder), {
        target: { value: text || placeholder },
    });
};

describe('<DzoFrom /> test', () => {
    beforeEach(() => {
        useLocation.mockImplementation(() => ({
            state: {
                dzoCodes: ['docdoc_old_4', 'deliveryclub_old_3', 'sberbox'],
                dzoData: {
                    applicationList,
                    cardUrl: '',
                    deleted: false,
                    description: 'description',
                    dzoBannerList: [],
                    dzoCode: 'sberhealth',
                    dzoId,
                    dzoName: 'СберЗдоровье',
                    dzoPresentationUrl: '',
                    header: null,
                    logoUrl: '',
                    screenUrl: '',
                    webUrl: 'https://sberhealth.ru/',
                },
            },
        }));
    });

    it('should match snapshot', () => {
        const Component = render(<DzoForm { ...props } />);

        expect(Component).toMatchSnapshot();
    });

    it('should do history push when no data and edit mode', () => {
        useLocation.mockImplementation(() => ({
            state: { dzoCodes: [], dzoData: undefined },
        }));

        render(<DzoForm { ...props } />);

        expect(mockHistoryPush).toBeCalledWith(props.matchPath);
    });

    it('should delete dzo', async () => {
        deleteDzo.mockResolvedValue();
        const { getByText } = render(<DzoForm { ...props } />);

        const deleteButton = getByText('Удалить');
        fireEvent.click(deleteButton);
        await sleep();

        fireEvent.click(
            document.querySelector('.ant-modal-confirm-btns .ant-btn-primary')
        );
        await sleep();

        expect(deleteDzo).toBeCalled();
        expect(deleteDzo).toBeCalledWith(67);
        expect(mockHistoryPush).toBeCalledWith(props.matchPath);

        fireEvent.click(deleteButton);
        await sleep();

        const error = 'rejectedError';
        deleteDzo.mockRejectedValue({ message: error });

        fireEvent.click(
            document.querySelector('.ant-modal-confirm-btns .ant-btn-primary')
        );
        await sleep();
        expect(document.querySelector('.error')).toBeInTheDocument();
    });

    it('should push to matchPath on cancel', () => {
        const { getByText } = render(<DzoForm { ...props } />);

        fireEvent.click(getByText('Отменить'));

        expect(mockHistoryPush).toBeCalledWith(props.matchPath);
    });

    it('should send changed main info data', async () => {
        serializeBannersAndDzoData.mockImplementation(() => 'testFormData');
        const { getByPlaceholderText } = render(<DzoForm { ...props } />);

        changeInputByPlaceholder(getByPlaceholderText, 'Название');

        changeInputByPlaceholder(getByPlaceholderText, 'Описание ДЗО');

        fireEvent.submit(document.querySelector('.ant-form'));
        await sleep();

        expect(serializeBannersAndDzoData).toBeCalled();
        expect(serializeBannersAndDzoData).toBeCalledWith(
            { LOGO_ICON: [], LOGO_MAIN: [], LOGO_SECONDARY: [] },
            {
                description: 'Описание ДЗО',
                dzoCode: 'sberhealth',
                dzoName: 'Название',
            }
        );
        expect(updateDzo).toBeCalled();
        expect(updateDzo).toBeCalledWith(67, 'testFormData');
    });

    it('should create new Dzo and add application', async () => {
        useLocation.mockImplementation(() => ({
            state: {
                dzoData: {},
                dzoCodes: ['docdoc_old_4', 'deliveryclub_old_3', 'sberbox'],
            },
        }));
        jest.spyOn(console, 'error').mockImplementation(() => {});
        addApplication.mockImplementation((data) => data);
        addDzo.mockImplementation(() => ({ id: dzoId }));
        makeErrorAndSuccessObj.mockReturnValue({
            applicationList,
            errorApps: 1,
        });
        Promise.allSettled = jest
            .fn()
            .mockResolvedValueOnce([{ status: 'rejected' }])
            .mockResolvedValue([{ status: 'fulfilled', value: { id: 1 } }]);

        const newProps = { ...props, type: 'CREATE' };
        const { getByPlaceholderText, getAllByPlaceholderText } = render(
            <DzoForm { ...newProps } />
        );

        changeInputByPlaceholder(getByPlaceholderText, 'Название');

        changeInputByPlaceholder(getByPlaceholderText, 'Описание ДЗО');

        changeInputByPlaceholder(getByPlaceholderText, 'Код', 'test_code');

        fireEvent.submit(document.querySelector('.ant-form'));
        await sleep(500);

        expect(mockHistoryReplace).toBeCalledWith(
            `${newProps.matchPath}/${dzoId}/edit`
        );
        expect(errorsToForm).toBeCalled();
        expect(console.error).toBeCalled();

        fireEvent.change(getAllByPlaceholderText('Введите ссылку')[0], {
            target: { value: 'https://sberhealth.ru/' },
        });
        fireEvent.mouseDown(document.querySelector('.ant-select-selector'));
        fireEvent.click(document.querySelector('.ant-select-item'));
        fireEvent.submit(document.querySelector('.ant-form'));
        await sleep();

        expect(Promise.allSettled.mock.calls[1]).toEqual([
            [
                {
                    applicationType: 'OTHER',
                    applicationUrl: 'https://sberhealth.ru/',
                    dzoId: 67,
                },
            ],
        ]);

        expect(mockHistoryPush).toBeCalledWith(newProps.matchPath);
    });

    it('should update application', async () => {
        const updateDzo = [
            {
                applicationId: 71,
                applicationType: 'IOS',
                applicationUrl: 'https://Notsberhealth.ru/',
                deleted: false,
            },
        ];

        Promise.allSettled = jest
            .fn()
            .mockResolvedValueOnce([{ status: 'rejected' }])
            .mockResolvedValue([{ status: 'fulfilled' }]);

        updateApp.mockImplementation((data) => data);

        const { getAllByPlaceholderText } = render(<DzoForm { ...props } />);

        fireEvent.change(getAllByPlaceholderText('Введите ссылку')[0], {
            target: { value: 'https://Notsberhealth.ru/' },
        });

        fireEvent.submit(document.querySelector('.ant-form'));
        await sleep();

        expect(Promise.allSettled).toBeCalledWith(updateDzo);
        expect(checkBackendErrors).toBeCalled();

        fireEvent.submit(document.querySelector('.ant-form'));
        await sleep();

        expect(Promise.allSettled).toHaveBeenLastCalledWith(updateDzo);
    });

    it('should create new application and delete prev app', async () => {
        const newApp = [
            {
                applicationId: 71,
                applicationType: 'OTHER',
                applicationUrl: 'https://newApp.ru/',
                deleted: false,
                dzoId,
            },
        ];
        Promise.allSettled = jest
            .fn()
            .mockResolvedValue([{ status: 'fulfilled', value: { id: 5 } }]);

        addApplication.mockImplementation((data) => data);
        deleteApp.mockImplementation((data) => Promise.resolve(data));

        const { getAllByPlaceholderText } = render(<DzoForm { ...props } />);

        fireEvent.change(getAllByPlaceholderText('Введите ссылку')[0], {
            target: { value: 'https://newApp.ru/' },
        });
        fireEvent.mouseDown(document.querySelector('.ant-select-selector'));
        fireEvent.click(document.querySelector('.ant-select-item'));
        fireEvent.submit(document.querySelector('.ant-form'));

        fireEvent.submit(document.querySelector('.ant-form'));
        await sleep();

        expect(Promise.allSettled).toBeCalledWith(newApp);
        expect(deleteApp).toHaveBeenCalled();
    });
});
