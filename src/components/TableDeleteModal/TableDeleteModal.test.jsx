import { act } from '@testing-library/react';
import { mount, shallow } from 'enzyme';
import React from 'react';
import { sleep } from '../../setupTests';
import TableDeleteModal from './TableDeleteModal';

describe('<TableDeleteModal tests/>', () => {
    beforeEach(() => {
        props.deleteFunction.mockResolvedValue([{ status: 'Ok', message: 'Successful' }]);
        Promise.allSettled = jest.fn().mockResolvedValue([ { status: 'ok' } ]);
    });

    const props = {
        listNameKey: 'dzoName',
        visible: true,
        refreshTable: jest.fn(),
        deleteFunction: jest.fn(),
        modalClose: jest.fn(),
        sourceForRemove: [
            {
                dzoId: 102,
                dzoName: 'test dzoName',
                dzoPresentationUrl: 'test dzoPresentationUrl',
                screenUrl: 'test screenUrl',
                logoUrl: 'test logoUrl',
                header: null,
                description: 'test description',
                cardUrl: 'test cardUrl',
                dzoCode: 'test dzoCode',
                webUrl: null,
                applicationList: [
                    {
                        applicationId: 108,
                        applicationType: 'OTHER',
                        applicationUrl: 'https://apps.apple.com/ru/app/delivery-сlub-доставка-еды/id436145623',
                        dzoId: 102,
                        deleted: false
                    }
                ],
                dzoBannerList: [],
                deleted: false
            }
        ],
        listIdForRemove: [138, 139],
    };

    it('TableDeleteModal snapshot', () => {
        const newProps = {
            ...props,
            sourceForRemove: [],
        };

        const TableDeleteModalItem = mount(<TableDeleteModal { ...newProps } />);
        expect(TableDeleteModalItem.html()).toMatchSnapshot();
    });

    it('should call handleDelete, deleteFunction and handleClose', async () => {
        const TableDeleteModalItem = shallow(<TableDeleteModal { ...props } />);
        await TableDeleteModalItem.find('Modal').prop('onOk')();

        expect(props.deleteFunction).toBeCalledTimes(props.listIdForRemove.length);
        expect(TableDeleteModalItem.find('.success').first().text()).toEqual('Успешно удалено');

        await TableDeleteModalItem.find('Modal').prop('onOk')();

        expect(props.modalClose).toBeCalled();
        expect(props.refreshTable).toBeCalled();
    });

    it('should render error list', async () => {
        props.deleteFunction = jest.fn().mockResolvedValue([{ status: 'rejected', message: 'Error' }]);
        Promise.allSettled = jest.fn().mockResolvedValue(null);
        const TableDeleteModalItem = shallow(<TableDeleteModal { ...props } />);

        await act(async () => {
            await TableDeleteModalItem.find('Modal').prop('onOk')();
        });
        expect(TableDeleteModalItem.find('.failed').first().text()).toEqual('Ошибка удаления');
    });

    it('should render okTextDelete and okTextSuccess', async () => {
        const TableDeleteModalItem = shallow(<TableDeleteModal { ...props } />);

        expect(
            TableDeleteModalItem.find('Modal').prop('okText')
        ).toEqual('Удалить');

        await TableDeleteModalItem.find('Modal').prop('onOk')();

        expect(
            TableDeleteModalItem.find('Modal').prop('okText')
        ).toEqual('Хорошо');
    });

    it('should render modalTitle and modalSuccessTitle', async () => {
        const TableDeleteModalItem = shallow(<TableDeleteModal { ...props } />);
        expect(
            TableDeleteModalItem.find('Modal').first().prop('title')
        ).toEqual('Вы точно хотите удалить эти данные?');

        await TableDeleteModalItem.find('Modal').first().prop('onOk')();

        expect(
            TableDeleteModalItem.find('Modal').prop('title')
        ).toEqual('Результат удаления');
    });

    it('should not render Modal', () => {
        const newProps = { ...props, visible: false };
        const TableDeleteModalItem = shallow(<TableDeleteModal { ...newProps } />);
        expect(TableDeleteModalItem.find('Modal')).toHaveLength(0);
    });

    it('should run useEffect', async () => {
        jest.useFakeTimers();
        let TableDeleteModalItem;
        await act(async () => {
            TableDeleteModalItem = mount(<TableDeleteModal { ...props } />);
        });
        await sleep(528);
        await act(async () => {
            TableDeleteModalItem.setProps({ ...props, visible: false });
            jest.runAllTimers();
        });
        await act(async () => {
            expect(TableDeleteModalItem.html()).toBeNull();
        });
        jest.useRealTimers();
    });

});
