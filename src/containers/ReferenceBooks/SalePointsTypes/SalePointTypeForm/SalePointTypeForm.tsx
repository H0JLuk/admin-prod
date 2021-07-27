import React, { useState, useEffect, useRef } from 'react';
import { RouteComponentProps, useLocation, useParams } from 'react-router-dom';
import { Col, Form, Input, message, Row, Radio } from 'antd';

import Loading from '@components/Loading';
import { confirmModal } from '@utils/utils';
import { FORM_RULES, getPatternAndMessage } from '@utils/validators';
import { SalePointType, SaveSalePointTypeRequest } from '@types';
import ReferenceButtons from '@containers/ReferenceBooks/ReferenceButtons';
import { showNotify } from '@containers/ClientAppPage/ClientAppForm/utils';
import { BUTTON_TEXT, SALE_POINT_TYPE, SALE_POINT_TYPE_RU } from '@constants/common';
import {
    addSalePointType,
    deleteSalePointType,
    editSalePointType,
    getSalePointTypeById,
} from '@apiServices/salePointService';
import {
    EDIT_MODE,
    NEW_SALE_POINT_TYPE_TITLE,
    ON_DELETE_MESSAGE,
    SALE_POINT_TYPE_FIELD,
    SALE_POINT_TYPE_FORM_ID,
    SALE_POINT_TYPE_PRIORITY_ERROR,
} from './salePointTypeConstants';

import styles from './SalePointTypeForm.module.css';

type SalePointTypeFormProps = RouteComponentProps & {
    matchPath: string;
    mode: string;
};

type SalePointTypeState = {
    salePoint?: SalePointType;
} | undefined;

const SALE_POINT_KIND_OPTIONS = [
    { label: SALE_POINT_TYPE_RU.INTERNAL, value: SALE_POINT_TYPE.INTERNAL },
    { label: SALE_POINT_TYPE_RU.EXTERNAL, value: SALE_POINT_TYPE.EXTERNAL },
];

const SalePointTypeForm: React.FC<SalePointTypeFormProps> = ({ matchPath, mode, history }) => {
    const { state, pathname } = useLocation<SalePointTypeState>();
    const params = useParams<{ salePointTypeId: string; }>();
    const salePointType = useRef({} as SalePointType | undefined);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();

    const salePointTypeId = +params.salePointTypeId;
    const isEdit = mode === EDIT_MODE;

    useEffect(() => {
        (async () => {
            if (isEdit) {
                salePointType.current = state?.salePoint || {} as SalePointType;
                if (!state?.salePoint) {
                    salePointType.current = await getSalePointTypeById(salePointTypeId);
                }
                form.setFieldsValue(salePointType.current);
            }
            setLoading(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const redirectToList = () => history.push(matchPath);

    if (isEdit && !salePointType.current) {
        message.error(`Тип точки продажи с id ${salePointTypeId} отсутствует`);
        redirectToList();
        return null;
    }

    const onDeleteSalePointType = async () => {
        try {
            await deleteSalePointType(salePointTypeId);
            showNotify(<div>Тип точки продажи <b>{salePointType.current?.name}</b> успешно удален</div>);
            redirectToList();
        } catch (error) {
            if (error.message) {
                message.error(`Ошибка удаления типа точки продажи: ${ error.message }`);
            }
            console.warn(error);
        }
    };

    const handleDelete = () => {
        confirmModal({
            onOk: onDeleteSalePointType,
            title: <b>{ON_DELETE_MESSAGE} <i>{salePointType.current?.name}</i>?</b>,
            okText: BUTTON_TEXT.DELETE,
            cancelText: BUTTON_TEXT.CANCEL,
        });
    };

    const onFinish = async (formData: SaveSalePointTypeRequest) => {
        try {
            setLoading(true);
            if (!isEdit) {
                await addSalePointType(formData);
                showNotify(<div>Тип точки продажи <b>{formData.name}</b> успешно добавлен</div>);
                history.replace(pathname);
            } else {
                await editSalePointType(salePointTypeId, formData);
                showNotify(<div>Тип точки продажи <b>{formData.name}</b> успешно отредактирован</div>);
            }
            redirectToList();
        } catch (error) {
            if (error.message) {
                message.error(`Ошибка ${ isEdit ? 'изменения' : 'создания' } типа точки продажи: ${ error.message }`);
            }
            console.warn(error);
            setLoading(false);
        }
    };

    return (
        <div>
            {loading && <Loading />}
            <div className={styles.wrapper}>
                <div className={styles.pageTitle}>
                    {isEdit ? `Тип точки продажи ${salePointType.current?.name}` : NEW_SALE_POINT_TYPE_TITLE}
                </div>
                <div className={styles.formStyles}>
                    <div className={styles.formWrapper}>
                        <Form
                            form={form}
                            layout="vertical"
                            id={SALE_POINT_TYPE_FORM_ID}
                            onFinish={onFinish}
                            validateTrigger="onSubmit"
                        >
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item
                                        label={SALE_POINT_TYPE_FIELD.NAME.label}
                                        name={SALE_POINT_TYPE_FIELD.NAME.name}
                                        rules={[
                                            FORM_RULES.REQUIRED,
                                            getPatternAndMessage('salePoint', 'name'),
                                        ]}
                                    >
                                        <Input
                                            placeholder={SALE_POINT_TYPE_FIELD.NAME.placeholder}
                                            allowClear
                                            maxLength={50}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label={SALE_POINT_TYPE_FIELD.DESCRIPTION.label}
                                        name={SALE_POINT_TYPE_FIELD.DESCRIPTION.name}
                                        rules={[getPatternAndMessage('salePoint', 'description')]}
                                    >
                                        <Input.TextArea
                                            placeholder={SALE_POINT_TYPE_FIELD.DESCRIPTION.placeholder}
                                            maxLength={300}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label={SALE_POINT_TYPE_FIELD.PRIORITY.label}
                                        name={SALE_POINT_TYPE_FIELD.PRIORITY.name}
                                        rules={[
                                            FORM_RULES.REQUIRED,
                                            {
                                                ...FORM_RULES.NUMBER,
                                                min: 1,
                                                max: 999,
                                                message: SALE_POINT_TYPE_PRIORITY_ERROR,
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder={SALE_POINT_TYPE_FIELD.PRIORITY.placeholder}
                                            maxLength={3}
                                            allowClear
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label={SALE_POINT_TYPE_FIELD.KIND.label}
                                        name={SALE_POINT_TYPE_FIELD.KIND.name}
                                        initialValue={salePointType.current?.kind || SALE_POINT_TYPE.INTERNAL}
                                    >
                                        <Radio.Group options={SALE_POINT_KIND_OPTIONS} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>
                <div className={styles.buttonsContainer}>
                    <ReferenceButtons
                        mode={mode}
                        onCancel={redirectToList}
                        onDelete={handleDelete}
                        form={SALE_POINT_TYPE_FORM_ID}
                    />
                </div>
            </div>
        </div>
    );
};

export default SalePointTypeForm;
