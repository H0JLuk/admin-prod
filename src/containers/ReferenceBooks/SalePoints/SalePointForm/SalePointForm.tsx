import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Col, Form, Input, message, Row, Select } from 'antd';
import AutocompleteOptionLabel from '@components/AutoComplete/AutocompleteLocationAndSalePoint/AutocompleteOptionLabel';
import Loading from '@components/Loading';
import AutoCompleteComponent, { AutoCompleteMethods } from '@components/AutoComplete';
import { showNotify } from '@containers/ClientAppPage/ClientAppForm/utils';
import ReferenceButtons from '@containers/ReferenceBooks/ReferenceButtons';
import {
    addSalePoint,
    deleteSalePoint,
    editSalePoint,
    getSalePointsByText,
    getSalePointByText,
    getSalePointTypesList,
} from '@apiServices/salePointService';
import { confirmModal, getStringOptionValueByDescription, getStringOptionValue } from '@utils/utils';
import { FORM_RULES, getPatternAndMessage } from '@utils/validators';
import {
    EDIT_MODE,
    LOCATION_FIELD,
    NEW_SALE_POINT_TITLE,
    PARENT_SALE_POINT_FIELD,
    SALE_POINT_DESCRIPTION_FIELD,
    SALE_POINT_NAME_FIELD,
    SALE_POINT_TYPE_FIELD,
} from './salePointsConstants';
import { getLocationsByText } from '@apiServices/locationService';
import { LocationDto, SalePointDto, SalePointType } from '@types';
import { BUTTON_TEXT } from '@constants/common';
import { handleSalePointKindMismatch, getSalePointKindById } from './salePointForm.utils';

import styles from './SalePointForm.module.css';

export type SalePointFormProps = {
    matchPath: string;
    mode: string;
};

export type SalePointUseLocationState = {
    salePoint?: SalePointDto;
};

export type SalePointFormDto = Pick<SalePointDto, 'name' | 'description' | 'location'> & {
    typeId: number;
    parentSalePoint: SalePointDto;
};

const SalePointForm: React.FC<SalePointFormProps> = ({ mode, matchPath }) => {
    const history = useHistory();
    const [form] = Form.useForm();
    const locationState = useLocation<SalePointUseLocationState>();
    const params = useParams<{ salePointId: string; }>();
    const [loading, setLoading] = useState(true);
    const typeOptions = useRef<{ label: string; value: number; }[]>([]);
    const salePointTypes = useRef<SalePointType[]>([]);

    const salePointMethods = useRef({} as AutoCompleteMethods<SalePointDto>);
    const locationMethods = useRef({} as AutoCompleteMethods<LocationDto>);

    const { salePoint } = locationState.state || {};
    const salePointId = +params.salePointId;
    const isEdit = mode === EDIT_MODE;

    useEffect(() => {
        (async () => {
            const salePointCopy = (isEdit && salePoint) ? salePoint : null;
            const {
                description,
                parentName,
                parentId,
                location,
                type,
            } = salePointCopy || {};
            let parentSalePoint: SalePointDto | null = null;

            if (typeof parentId === 'number') {
                parentSalePoint = (await getSalePointByText(parentName!, parentId)) || null;
            }

            const locationField = typeof location?.id === 'number' ? {
                id: location.id,
                name: location.name,
            } as LocationDto : null;

            form.setFieldsValue({
                name: salePoint?.name ?? '',
                description: description ?? '',
                location: locationField,
                parentSalePoint,
                typeId: type?.id ?? null,
            });

            if (parentSalePoint && salePointMethods.current) {
                salePointMethods.current.setSelectedOption(
                    parentName ?? '',
                    { data: parentSalePoint, value: parentName ?? '' },
                );
            }

            if (locationField && locationMethods.current) {
                locationMethods.current.setSelectedOption(
                    location?.name ?? '', { data: locationField, value: location?.name ?? '' },
                );
            }
            const { list: salePointsTypesList } = await getSalePointTypesList();
            salePointTypes.current = salePointsTypesList;
            typeOptions.current = salePointsTypesList.map(({ name, id }) => ({ label: name, value: id }));
            setLoading(false);
        })();
    }, [form, isEdit, salePoint]);

    const redirectToList = () => history.push(matchPath);

    if (isEdit && !salePoint) {
        redirectToList();
        return null;
    }

    const removeSalePoint = async () => {
        try {
            await deleteSalePoint(salePointId);
            salePoint && showNotify(<div>?????????? ?????????????? <b>{salePoint.name}</b> ?????????????? ??????????????</div>);
            redirectToList();
        } catch (e) {
            message.error(e.message);
            console.error(e.message);
        }
    };

    const handleDelete = () => {
        confirmModal({
            onOk: removeSalePoint,
            title: <b>?? ?????????? ?????????????? <i>{salePoint?.name}</i> ???????? ?????????????????? ??????????????????</b>,
            content: <div>?????????????? ?????????????????? ?????????????????? ?????????? ?????? ?????? ?????????????? ?????????? ??????????????</div>,
            okText: BUTTON_TEXT.DELETE,
            cancelText: BUTTON_TEXT.CANCEL,
        });
    };

    const onFinish = async (dataFromForm: SalePointFormDto) => {
        const {
            description = '',
            name,
            typeId,
            location,
            parentSalePoint,
        } = dataFromForm;

        try {
            const requestData = {
                description,
                name,
                locationId: location.id,
                parentId: parentSalePoint?.id,
                typeId,
            };
            setLoading(true);

            if (!isEdit) {
                await addSalePoint(requestData);
                showNotify(<div>?????????? ?????????????? <b>{requestData.name}</b> ?????????????? ??????????????????</div>);
            } else if (salePoint) {
                await editSalePoint(salePointId, requestData);
                showNotify(<div>?????????? ?????????????? <b>{requestData.name}</b> ?????????????? ??????????????????????????????</div>);
            }

            redirectToList();
        } catch (e) {
            setLoading(false);
            message.error(e.message);
            console.error(e.message);
        }
    };

    return (
        <div>
            {loading && <Loading className={styles.loading} />}
            <div className={styles.wrapper}>
                <div className={styles.pageTitle}>
                    {isEdit ? `?????????? ?????????????? ${salePoint?.name}` : NEW_SALE_POINT_TITLE}
                </div>
                <Form
                    className={styles.formStyles}
                    form={form}
                    layout="vertical"
                    id="salePoint"
                    onFinish={onFinish}
                    validateTrigger="onSubmit"
                >
                    <div className={styles.formWrapper}>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    label={SALE_POINT_TYPE_FIELD.label}
                                    name={SALE_POINT_TYPE_FIELD.name}
                                    rules={[
                                        FORM_RULES.REQUIRED,
                                        {
                                            validator: (_, value) => {
                                                const parentSalePointField: SalePointDto = form.getFieldValue('parentSalePoint');
                                                const salePointKind = getSalePointKindById(salePointTypes.current, value);

                                                if (salePointKind && parentSalePointField) {
                                                    return salePointKind === parentSalePointField.type.kind
                                                        ? Promise.resolve()
                                                        : Promise.reject(handleSalePointKindMismatch(isEdit, salePointKind, parentSalePointField.type.kind));
                                                }
                                                return Promise.resolve();
                                            },
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder={SALE_POINT_TYPE_FIELD.placeholder}
                                        options={typeOptions.current}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name={SALE_POINT_NAME_FIELD.name}
                                    label={SALE_POINT_NAME_FIELD.label}
                                    rules={[
                                        FORM_RULES.REQUIRED,
                                        {
                                            ...getPatternAndMessage('salePoint', 'name'),
                                        },
                                    ]}
                                    validateFirst
                                >
                                    <Input
                                        placeholder={SALE_POINT_NAME_FIELD.placeholder}
                                        allowClear
                                        maxLength={50}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    label={PARENT_SALE_POINT_FIELD.label}
                                    name={PARENT_SALE_POINT_FIELD.name}
                                    validateFirst
                                    trigger="onSelect"
                                >
                                    <AutoCompleteComponent<SalePointDto>
                                        placeholder={PARENT_SALE_POINT_FIELD.placeholder}
                                        requestFunction={getSalePointsByText}
                                        componentMethods={salePointMethods}
                                        renderOptionStringValue={getStringOptionValueByDescription}
                                        renderOptionItemLabel={
                                            ({ name, parentName }, value) => (
                                                <AutocompleteOptionLabel
                                                    name={name}
                                                    parentName={parentName}
                                                    highlightValue={value}
                                                    highlightClassName={styles.highlight}
                                                />
                                            )
                                        }
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    name={SALE_POINT_DESCRIPTION_FIELD.name}
                                    label={SALE_POINT_DESCRIPTION_FIELD.label}
                                    rules={[
                                        {
                                            ...getPatternAndMessage('salePoint', 'description'),
                                        },
                                    ]}
                                    validateFirst
                                >
                                    <Input.TextArea
                                        placeholder={SALE_POINT_DESCRIPTION_FIELD.placeholder}
                                        maxLength={300}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    label={LOCATION_FIELD.label}
                                    name={LOCATION_FIELD.name}
                                    trigger="onSelect"
                                    validateFirst
                                    rules={[
                                        {
                                            ...FORM_RULES.REQUIRED_OBJECT,
                                            message: '?????????????? ??????????????????????',
                                        },
                                    ]}
                                >
                                    <AutoCompleteComponent<LocationDto>
                                        placeholder={LOCATION_FIELD.placeholder}
                                        requestFunction={getLocationsByText}
                                        componentMethods={locationMethods}
                                        searchCondition={(value) => value.length < 2}
                                        renderOptionStringValue={getStringOptionValue}
                                        renderOptionItemLabel={
                                            ({ name, parentName }, value) => (
                                                <AutocompleteOptionLabel
                                                    name={name}
                                                    parentName={parentName}
                                                    highlightValue={value}
                                                    highlightClassName={styles.highlight}
                                                />
                                            )
                                        }
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
                        form="salePoint"
                    />
                </div>
            </div>
        </div>
    );
};

export default SalePointForm;
