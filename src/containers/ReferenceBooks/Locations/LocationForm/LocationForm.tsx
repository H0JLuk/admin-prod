import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Col, Form, Input, message, Row, Select } from 'antd';
import Loading from '@components/Loading';
import AutoCompleteComponent, { AutoCompleteMethods } from '@components/AutoComplete';
import AutocompleteOptionLabel from '@components/AutoComplete/AutocompleteLocationAndSalePoint/AutocompleteOptionLabel';
import { showNotify } from '@containers/ClientAppPage/ClientAppForm/utils';
import ReferenceButtons from '@containers/ReferenceBooks/ReferenceButtons';
import {
    addLocation,
    editLocation,
    deleteLocation,
    getLocationsByText,
    getLocationTypeOptions,
} from '@apiServices/locationService';
import { FORM_RULES, getPatternAndMessage } from '@utils//validators';
import { confirmModal, getStringOptionValue } from '@utils/utils';
import {
    NEW_LOCATION_TITLE,
    LOCATION_TYPE_FIELD,
    LOCATION_NAME_FIELD,
    PARENT_LOCATION_FIELD,
    LOCATION_DESCRIPTION_FIELD,
    EDIT_MODE,
} from './locationConstants';
import { BUTTON_TEXT } from '@constants/common';
import { LocationDto } from '@types';

import styles from './LocationForm.module.css';

type LocationFormProps = {
    matchPath: string;
    mode: string;
};

type UseLocationState = {
    location?: LocationDto;
};

type LocationFormDto = Pick<LocationDto, 'name'> & {
    description: string;
    parentLocation: LocationDto;
    typeId: number;
};

const LocationForm: React.FC<LocationFormProps> = ({ matchPath, mode }) => {
    const { state = {} } = useLocation<UseLocationState>();
    const { location } = state;
    const history = useHistory();
    const params = useParams<{ locationId: string; }>();
    const locationId = +params.locationId;
    const [form] = Form.useForm<LocationFormDto>();
    const [loading, setLoading] = useState(true);
    const typeOptions = useRef([] as { label: string; value: number; }[]);
    const locationMethods = useRef({} as AutoCompleteMethods<LocationDto>);
    const isEdit = mode === EDIT_MODE;

    useEffect(() => {
        const locationFromState = (isEdit && location) ? location : null;
        (async () => {
            const {
                name,
                description,
                parentId,
                parentName,
                type,
            } = locationFromState || {};
            const parentLocation = typeof parentId === 'number' ? {
                id: parentId,
                name: parentName,
            } as LocationDto : null;

            form.setFieldsValue({
                name: name ?? '',
                description: description ?? '',
                typeId: type?.id,
                parentLocation: parentLocation!,
            });

            if (locationMethods.current && parentLocation) {
                locationMethods.current.setSelectedOption(parentName ?? '', {
                    data: parentLocation,
                    value: parentName ?? '',
                });
            }

            typeOptions.current = await getLocationTypeOptions();
            setLoading(false);
        })();
    }, [form, isEdit, location]);

    const redirectToList = () => history.push(matchPath);

    if (isEdit && !location) {
        redirectToList();
        return null;
    }

    const onDeleteLocation = async () => {
        try {
            await deleteLocation(locationId);
            showNotify(<div>Локация <b>{location?.name}</b> успешно удалена</div>);
            redirectToList();
        } catch (e) {
            message.error(e.message);
            console.error(e);
        }
    };

    const onFinish = async (dataFromForm: LocationFormDto) => {
        try {
            const {
                description,
                name,
                typeId,
                parentLocation,
            } = dataFromForm;

            const requestData = {
                name,
                description,
                typeId,
                parentId: parentLocation?.id,
            };

            setLoading(true);
            if (!isEdit) {
                await addLocation(requestData);
                showNotify(<div>Локация <b>{requestData.name}</b> успешно добавлена</div>);
            } else {
                await editLocation(locationId, requestData);
                showNotify(<div>Локация <b>{requestData.name}</b> успешно отредактирована</div>);
            }

            redirectToList();
        } catch (e) {
            setLoading(false);
            console.error(e);
            message.error(e.message);
        }
    };

    const handleDelete = () => {
        confirmModal({
            onOk: onDeleteLocation,
            title: <b>У локации <i>{location?.name}</i> есть настройки видимости</b>,
            content: <div>Удалите настройки видимости перед тем как удалять локацию</div>,
            okText: BUTTON_TEXT.DELETE,
            cancelText: BUTTON_TEXT.CANCEL,
        });
    };

    return (
        <div>
            {loading && <Loading />}
            <div className={styles.wrapper}>
                <div className={styles.pageTitle}>
                    {isEdit ? `Локация ${location?.name}` : NEW_LOCATION_TITLE}
                </div>
                <Form
                    className={styles.formStyles}
                    form={form}
                    layout="vertical"
                    id="location"
                    onFinish={onFinish}
                    validateTrigger="onSubmit"
                >
                    <div className={styles.formWrapper}>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    label={LOCATION_TYPE_FIELD.label}
                                    name={LOCATION_TYPE_FIELD.name}
                                    rules={[
                                        {
                                            ...FORM_RULES.REQUIRED,
                                            message: 'Тип локации обязательный',
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder={LOCATION_TYPE_FIELD.placeholder}
                                        options={typeOptions.current}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={PARENT_LOCATION_FIELD.label}
                                    name={PARENT_LOCATION_FIELD.name}
                                    validateFirst
                                    trigger="onSelect"
                                >
                                    <AutoCompleteComponent<LocationDto>
                                        componentMethods={locationMethods}
                                        allowClear
                                        requestFunction={getLocationsByText}
                                        placeholder={PARENT_LOCATION_FIELD.placeholder}
                                        disabled={loading}
                                        searchCondition={(value) => value.length < 2}
                                        renderOptionStringValue={getStringOptionValue}
                                        renderOptionItemLabel={({ name, parentName }, value) => (
                                            <AutocompleteOptionLabel
                                                name={name}
                                                parentName={parentName}
                                                highlightValue={value}
                                                highlightClassName={styles.highlight}
                                            />
                                        )}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name={LOCATION_NAME_FIELD.name}
                                    label={LOCATION_NAME_FIELD.label}
                                    rules={[
                                        FORM_RULES.REQUIRED,
                                        {
                                            ...getPatternAndMessage('location', 'name'),
                                        },
                                    ]}
                                    validateFirst
                                >
                                    <Input
                                        placeholder={LOCATION_NAME_FIELD.placeholder}
                                        allowClear
                                        maxLength={50}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name={LOCATION_DESCRIPTION_FIELD.name}
                                    label={LOCATION_DESCRIPTION_FIELD.label}
                                    rules={[
                                        {
                                            ...getPatternAndMessage('location', 'description'),
                                        },
                                    ]}
                                    validateFirst
                                >
                                    <Input.TextArea
                                        placeholder={LOCATION_DESCRIPTION_FIELD.placeholder}
                                        maxLength={300}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                </Form>
                <div className={styles.buttonsContainer}>
                    <ReferenceButtons
                        mode={mode}
                        onCancel={redirectToList}
                        onDelete={handleDelete}
                        form="location"
                    />
                </div>
            </div>
        </div>
    );
};

export default LocationForm;
