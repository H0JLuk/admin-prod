import React from 'react';
import { message } from 'antd';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { BUTTON_TEXT } from '@constants/common';
import { addLocationType, editLocationType, deleteLocationType, getLocationTypeById } from '@apiServices/locationService';
import { confirmModal } from '@utils/utils';
import LocationTypeForm from './LocationTypeForm';
import { testLocationType } from '../../../../../__tests__/constants';
import { useParams } from 'react-router-dom';
import { EDIT_MODE, LOCATION_TYPE_DESCRIPTION_FIELD, LOCATION_TYPE_NAME_FIELD, LOCATION_TYPE_PRIORITY_FIELD } from './locationTypeConstants';
import { sleep } from '../../../../setupTests';
import { showNotify } from '@containers/ClientAppPage/ClientAppForm/utils';

const mockHistoryPush = jest.fn();
const mockHistoryReplace = jest.fn();

const mockAddSuccessText = (name: string) => <div>Тип локации <b>{name}</b> успешно добавлен</div>;
const mockEditSuccessText = (name: string) => <div>Тип локации <b>{name}</b> успешно отредактирован</div>;
const mockDeleteSuccessText = (name: string) => <div>Тип локации <b>{name}</b> успешно удален</div>;

jest.mock('react-router-dom', () => ({
    useLocation: () => ({
        pathname: 'location-type',
    }),
    useHistory: () => ({
        push: mockHistoryPush,
        replace: mockHistoryReplace,
    }),
    useParams: jest.fn(),
}));

jest.mock('../../../../api/services/locationService', () => ({
    getLocationTypeById: jest.fn(),
    addLocationType: jest.fn(),
    editLocationType: jest.fn(),
    deleteLocationType: jest.fn(),
}));

jest.mock('../../../../utils/utils', () => ({
    confirmModal: jest.fn(),
}));

jest.mock('../../../ClientAppPage/ClientAppForm/utils', () => ({
    showNotify: jest.fn(),
}));

const props = {
    matchPath: 'location-type',
    mode: 'add',
};

describe('<LocationTypeForm test />', () => {
    beforeEach(() => {
        (getLocationTypeById as jest.Mock).mockResolvedValue(testLocationType);
        (useParams as jest.Mock).mockReturnValue({});
    });

    describe('Add mode', () => {
        it('should match the snapshot at add mode', () => {
            const { asFragment } = render(<LocationTypeForm {...props} />);

            expect(screen.getByText('Новый тип локации')).toBeInTheDocument();
            expect(asFragment()).toMatchSnapshot('add mode');
        });

        it('should render empty location type', () => {
            render(<LocationTypeForm {...props} />);
            const defaultValues = {
                name: '',
                priority: '',
                description: '',
            };

            expect(
                screen.getByLabelText(LOCATION_TYPE_NAME_FIELD.label).closest('input')?.value,
            ).toEqual(defaultValues.name);

            expect(
                screen.getByLabelText(LOCATION_TYPE_PRIORITY_FIELD.label).closest('input')?.value,
            ).toEqual(defaultValues.priority);

            expect(
                screen.getByLabelText(LOCATION_TYPE_DESCRIPTION_FIELD.label).closest('textarea')?.value,
            ).toEqual(defaultValues.description);
        });

        it('should create valid location type', async () => {
            render(<LocationTypeForm {...props} />);

            const { name, priority, description } = testLocationType;
            const formData = { name, priority: String(priority), description };

            fireEvent.change(
                screen.getByLabelText(LOCATION_TYPE_NAME_FIELD.label),
                { target: { value: formData.name } },
            );
            fireEvent.change(
                screen.getByLabelText(LOCATION_TYPE_PRIORITY_FIELD.label),
                { target: { value: formData.priority } },
            );
            fireEvent.change(
                screen.getByLabelText(LOCATION_TYPE_DESCRIPTION_FIELD.label),
                { target: { value: formData.description || '' } },
            );

            userEvent.click(
                screen.getByRole('button', { name: BUTTON_TEXT.ADD }),
            );

            await sleep();

            expect(addLocationType).toBeCalledTimes(1);
            expect(addLocationType).toBeCalledWith(formData);

            expect(showNotify).toBeCalledTimes(1);
            expect(showNotify).toBeCalledWith(mockAddSuccessText(formData.name));

            expect(mockHistoryReplace).toBeCalledTimes(1);
            expect(mockHistoryReplace).toBeCalledWith('location-type');

            expect(mockHistoryPush).toBeCalledTimes(1);
            expect(mockHistoryPush).toBeCalledWith(props.matchPath);
        });
    });

    // ---------------------------- Edit Mode ---------------------
    describe('Edit mode', () => {
        beforeEach(() => {
            (useParams as jest.Mock).mockReturnValue({ locationId: String(testLocationType.id) });
            props.mode = EDIT_MODE;
        });

        it('should match the snapshot at edit mode', async () => {
            const { asFragment } = render(<LocationTypeForm {...props} />);
            await screen.findByText(`Тип локации ${testLocationType.name}`);
            expect(asFragment()).toMatchSnapshot('edit mode');
        });

        it('should redirect if locationFromState is empty and location type id is not valid', async () => {
            (getLocationTypeById as jest.Mock).mockResolvedValue(undefined);
            render(<LocationTypeForm {...props} />);

            await sleep();

            expect(mockHistoryPush).toBeCalledTimes(1);
            expect(mockHistoryPush).toBeCalledWith(props.matchPath);
        });

        it('should render valid location type', async () => {
            render(<LocationTypeForm {...props} />);

            await screen.findByDisplayValue(testLocationType.name);
            await screen.findByDisplayValue(testLocationType.priority);
            await screen.findByDisplayValue(testLocationType.description || '');

            expect(
                screen.getByDisplayValue(testLocationType.name),
            ).toBeInTheDocument();

            expect(
                screen.getByDisplayValue(testLocationType.priority),
            ).toBeInTheDocument();

            expect(
                screen.getByDisplayValue(testLocationType.description || ''),
            ).toBeInTheDocument();
        });

        it('should save location type and redirect after click on save button', async () => {
            (editLocationType as jest.Mock).mockResolvedValue(true);
            render(<LocationTypeForm {...props} />);
            await screen.findByText(`Тип локации ${testLocationType.name}`);

            const formData = { name: 'имя', priority: '5', description: 'описание' };

            fireEvent.change(
                screen.getByLabelText(LOCATION_TYPE_NAME_FIELD.label),
                { target: { value: formData.name } },
            );
            fireEvent.change(
                screen.getByLabelText(LOCATION_TYPE_PRIORITY_FIELD.label),
                { target: { value: formData.priority } },
            );
            fireEvent.change(
                screen.getByLabelText(LOCATION_TYPE_DESCRIPTION_FIELD.label),
                { target: { value: formData.description || '' } },
            );

            userEvent.click(
                screen.getByRole('button', { name: BUTTON_TEXT.SAVE }),
            );

            await sleep();

            expect(editLocationType).toBeCalledTimes(1);
            expect(editLocationType).toBeCalledWith(testLocationType.id, formData);

            expect(showNotify).toBeCalledTimes(1);
            expect(showNotify).toBeCalledWith(mockEditSuccessText(formData.name));

            expect(mockHistoryReplace).toBeCalledTimes(1);
            expect(mockHistoryReplace).toBeCalledWith('location-type');

            expect(mockHistoryPush).toBeCalledTimes(1);
            expect(mockHistoryPush).toBeCalledWith(props.matchPath);
        });

        it('should handle error at editing location type', async () => {
            const deletingError = new Error('delete error');
            const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => '');
            (editLocationType as jest.Mock).mockRejectedValue(deletingError);
            message.error = jest.fn();

            render(<LocationTypeForm {...props} />);
            await screen.findByText(`Тип локации ${testLocationType.name}`);

            const formData = { name: 'имя', priority: '5', description: 'описание' };

            fireEvent.change(
                screen.getByLabelText(LOCATION_TYPE_NAME_FIELD.label),
                { target: { value: formData.name } },
            );
            fireEvent.change(
                screen.getByLabelText(LOCATION_TYPE_PRIORITY_FIELD.label),
                { target: { value: formData.priority } },
            );
            fireEvent.change(
                screen.getByLabelText(LOCATION_TYPE_DESCRIPTION_FIELD.label),
                { target: { value: formData.description || '' } },
            );

            userEvent.click(
                screen.getByRole('button', { name: BUTTON_TEXT.SAVE }),
            );

            await sleep();

            expect(editLocationType).toBeCalledTimes(1);
            expect(editLocationType).toBeCalledWith(testLocationType.id, formData);

            expect(showNotify).not.toBeCalled();
            expect(message.error).toBeCalledTimes(1);
            expect(errorSpy).toBeCalledTimes(1);
            expect(errorSpy).toBeCalledWith(deletingError);
        });

        it('should delete location type after click', async () => {
            (deleteLocationType as jest.Mock).mockResolvedValue(null);
            render(<LocationTypeForm {...props} />);

            await screen.findByText(`Тип локации ${testLocationType.name}`);

            userEvent.click(
                screen.getByRole('button', { name: BUTTON_TEXT.DELETE }),
            );

            await (confirmModal as jest.Mock).mock.calls[0][0].onOk();

            expect(deleteLocationType).toBeCalledTimes(1);
            expect(deleteLocationType).toBeCalledWith(testLocationType.id);

            expect(showNotify).toBeCalledTimes(1);
            expect(showNotify).toBeCalledWith(mockDeleteSuccessText(testLocationType.name));

            expect(mockHistoryPush).toBeCalledTimes(1);
            expect(mockHistoryPush).toBeCalledWith(props.matchPath);
        });

        it('should handle error at deleting location type', async () => {
            const deletingError = new Error('delete error');
            const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => '');
            (deleteLocationType as jest.Mock).mockRejectedValue(deletingError);
            message.error = jest.fn();

            render(<LocationTypeForm {...props} />);

            await screen.findByText(`Тип локации ${testLocationType.name}`);

            userEvent.click(
                screen.getByRole('button', { name: BUTTON_TEXT.DELETE }),
            );

            await (confirmModal as jest.Mock).mock.calls[0][0].onOk();

            expect(deleteLocationType).toBeCalledTimes(1);
            expect(deleteLocationType).toBeCalledWith(testLocationType.id);

            expect(showNotify).not.toBeCalled();
            expect(message.error).toBeCalledTimes(1);
            expect(errorSpy).toBeCalledTimes(1);
            expect(errorSpy).toBeCalledWith(deletingError);
        });
    });
});
