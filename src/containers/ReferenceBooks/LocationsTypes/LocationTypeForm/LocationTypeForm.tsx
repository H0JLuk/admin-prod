import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Col, Form, Input, message, Row } from 'antd';

import Loading from '@components/Loading';
import { showNotify } from '@containers/ClientAppPage/ClientAppForm/utils';
import ReferenceButtons from '@containers/ReferenceBooks/ReferenceButtons';
import {
    addLocationType,
    editLocationType,
    deleteLocationType,
    getLocationTypeById,
} from '@apiServices/locationService';
import { FORM_RULES, getPatternAndMessage } from '@utils/validators';
import { confirmModal } from '@utils/utils';
import {
    NEW_LOCATION_TITLE,
    EDIT_MODE,
    LOCATION_TYPE_NAME_FIELD,
    LOCATION_TYPE_DESCRIPTION_FIELD,
    LOCATION_TYPE_PRIORITY_FIELD,
} from './locationTypeConstants';
import { BUTTON_TEXT } from '@constants/common';
import { LocationTypeDto, SaveLocationTypeRequest } from '@types';

import styles from './LocationTypeForm.module.css';

const getDeleteTitleConfirm = (locationTypeName: string) => (
    <span>
        Вы уверены, что хотите удалить тип локации <b>{locationTypeName}</b>?
    </span>
);

type LocationFormProps = {
    matchPath: string;
    mode: string;
};

type UseLocationState = {
    locationType?: LocationTypeDto;
} | undefined;

type LocationTypeFormType = Omit<LocationTypeDto, 'id' | 'deleted'>;

const formId = 'location-type';

const LocationTypeForm: React.FC<LocationFormProps> = ({ matchPath, mode }) => {
    const { state = {}, pathname } = useLocation<UseLocationState>();
    const { locationType } = state;
    const history = useHistory();
    const locationTypeData = useRef<LocationTypeFormType>(locationType as LocationTypeFormType);
    const params = useParams<{ locationId: string; }>();
    const locationTypeId = +params.locationId;
    const [form] = Form.useForm<SaveLocationTypeRequest>();
    const [loading, setLoading] = useState(true);
    const isEdit = mode === EDIT_MODE;

    const redirectToList = () => history.push(matchPath);

    useEffect(() => {
        (async () => {
            if (isEdit) {
                locationTypeData.current = locationType || {} as LocationTypeFormType;
                if (!locationType) {
                    locationTypeData.current = await getLocationTypeById(locationTypeId);
                    if (!locationTypeData.current) {
                        message.error(`Тип локации с id ${locationTypeId} отсутствует`);
                        redirectToList();
                        return;
                    }
                }
                form.setFieldsValue(locationTypeData.current);
            }
            setLoading(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onDeleteLocation = async () => {
        try {
            await deleteLocationType(locationTypeId);
            showNotify(<div>Тип локации <b>{locationTypeData.current?.name}</b> успешно удален</div>);
            redirectToList();
        } catch (e) {
            message.error(e.message);
            console.error(e);
        }
    };

    const onFinish = async (dataFromForm: SaveLocationTypeRequest) => {
        try {
            setLoading(true);
            if (!isEdit) {
                await addLocationType(dataFromForm);
                showNotify(<div>Тип локации <b>{dataFromForm.name}</b> успешно добавлен</div>);
            } else {
                await editLocationType(locationTypeId, dataFromForm);
                showNotify(<div>Тип локации <b>{dataFromForm.name}</b> успешно отредактирован</div>);
            }

            history.replace(pathname);
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
            title: getDeleteTitleConfirm(locationTypeData.current?.name || ''),
            okText: BUTTON_TEXT.DELETE,
            cancelText: BUTTON_TEXT.CANCEL,
        });
    };

    return (
        <div>
            {loading && <Loading />}
            <div className={styles.wrapper}>
                <div className={styles.pageTitle}>
                    {isEdit ? `Тип локации ${locationTypeData.current?.name || ''}` : NEW_LOCATION_TITLE}
                </div>
                <Form
                    className={styles.formStyles}
                    form={form}
                    layout="vertical"
                    id={formId}
                    onFinish={onFinish}
                    validateTrigger="onSubmit"
                >
                    <div className={styles.formWrapper}>
                        <Row gutter={[24, 5]}>
                            <Col span={12}>
                                <Form.Item
                                    label={LOCATION_TYPE_NAME_FIELD.label}
                                    name={LOCATION_TYPE_NAME_FIELD.name}
                                    rules={[
                                        FORM_RULES.REQUIRED,
                                        {
                                            ...getPatternAndMessage('locationType', 'name'),
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={LOCATION_TYPE_NAME_FIELD.placeholder}
                                        maxLength={50}
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={LOCATION_TYPE_PRIORITY_FIELD.label}
                                    name={LOCATION_TYPE_PRIORITY_FIELD.name}
                                    rules={[
                                        FORM_RULES.REQUIRED,
                                        {
                                            ...FORM_RULES.NUMBER,
                                            min: 1,
                                            max: 999,
                                            message: 'Приоритет локации должен быть числом от 1 до 999',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={LOCATION_TYPE_PRIORITY_FIELD.placeholder}
                                        maxLength={3}
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={LOCATION_TYPE_DESCRIPTION_FIELD.label}
                                    name={LOCATION_TYPE_DESCRIPTION_FIELD.name}
                                    rules={[
                                        {
                                            ...getPatternAndMessage('locationType', 'description'),
                                        },
                                    ]}
                                >
                                    <Input.TextArea
                                        placeholder={LOCATION_TYPE_DESCRIPTION_FIELD.placeholder}
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
                        form={formId}
                    />
                </div>
            </div>
        </div>
    );
};

export default LocationTypeForm;
