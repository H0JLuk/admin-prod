import React, { useEffect, useState, useRef, Suspense } from 'react';
import { RouteComponentProps, useLocation, useParams } from 'react-router-dom';
import { Col, DatePicker, Form, Row, Input, message, notification, Button } from 'antd';
import { ValidatorRule } from 'rc-field-form/lib/interface';
import localeDatePicker from 'antd/es/date-picker/locale/ru_RU';
import moment, { Moment } from 'moment';
import Header from '@components/Header';
import SelectTags from '@components/SelectTags';
import Loading from '@components/Loading';
import { getPatternAndMessage } from '@utils/validators';
import { attachConsentToClientApp, createConsent, getConsentById, updateConsent } from '@apiServices/consentsService';
import { getActiveClientApps } from '@apiServices/clientAppService';
import { ClientAppDto, ConsentDto } from '@types';

import styles from './ConsentForm.module.css';

type ConsentFormProps = RouteComponentProps & {
    matchPath: string;
    mode: ConsentFormMode;
};

export enum ConsentFormMode {
    EDIT = 'edit',
    CREATE = 'create',
}

type ConsentFormLocationState = {
    consentData?: ConsentDto;
};

type ClientAppListState = ClientAppDto & {
    disabled?: boolean;
};

type OnFinishData = Pick<ConsentDto, 'text' | 'version'> & {
    createDate: Moment;
    clientApplications: string[];
};

const RichTextEditor = React.lazy(() => import('@components/RichTextEditor'));

const BUTTON_TEXT = {
    SAVE: 'Сохранить',
    CANCEL: 'Отменить',
};

const CONSENT_DATE = 'Дата начала действия';
const DATE_PICKER_PLACEHOLDER = 'дд.мм.гг';
const NEW_CONSENT = 'Новое согласие';
const EDIT_CONSENT = 'Редактирование согласия';
const CONSENTS_TEXT = 'Текст согласия';
const VERSION = 'Версия';
const VERSION_PLACEHOLDER = 'V1';

const {
    pattern: consentTextPattern,
    message: consentTextMessage,
} = getPatternAndMessage('consent', 'consentEditorText');

const consentTextValidator: ValidatorRule['validator'] = (_, value) => {
    const div = document.createElement('div');
    div.innerHTML = value;
    const text = div.textContent ?? '';
    return consentTextPattern.test(text) ? Promise.resolve() : Promise.reject();
};


const ConsentForm: React.FC<ConsentFormProps> = ({ history, matchPath, mode }) => {
    const [appList, setAppList] = useState<ClientAppListState[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingTextEditor, setLoadingTextEditor] = useState(true);
    const { state, pathname } = useLocation<ConsentFormLocationState>();
    const { consentId } = useParams<{ consentId: string; }>();
    const [form] = Form.useForm();
    const consent = useRef({} as ConsentDto);
    const consentData = consent.current;
    const isEditMode = mode === ConsentFormMode.EDIT;
    const { signed = false } = consentData;
    const editorDisabled = isEditMode && signed;

    useEffect(() => {
        (async () => {
            let clientAppList = await getActiveClientApps();

            if (isEditMode) {
                consent.current = state?.consentData || {} as ConsentDto;

                if (!state?.consentData) {
                    consent.current = await getConsentById(+consentId) || {} as ConsentDto;
                }

                const { createDate, version, text, clientApplications } = consent.current;
                const selectedAppCodes = clientApplications.map(app => app.code);
                form.setFieldsValue({
                    createDate: moment(createDate),
                    version,
                    text,
                    clientApplications: selectedAppCodes,
                });
                clientAppList = clientAppList.map(app => ({
                    ...app,
                    disabled: selectedAppCodes.includes(app.code),
                }));
            }

            setAppList(clientAppList);
            setLoading(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) {
        return (
            <div>
                <Header />
                <Loading className={styles.loadingContainer} />
            </div>
        );
    }

    const onReadyRichText = () => {
        setLoadingTextEditor(false);
    };

    const redirectToList = () => history.push(matchPath);

    const handleFormFinish = async (data: OnFinishData) => {
        const { createDate, version, text, clientApplications } = data;
        const body = {
            version,
            text,
            createDate: createDate.toISOString(),
        };
        const currentAppSelection = consentData.clientApplications?.map(app => app.code) || [];
        const newAppSelection = clientApplications.filter(app => !currentAppSelection.includes(app));
        let id = consentData?.id;

        try {
            setLoadingTextEditor(true);

            if (typeof id === 'number') {
                !signed && await updateConsent({ ...body, id });
            } else {
                ({ id } = await createConsent(body));
            }

            const requestSequence = newAppSelection.map(app => attachConsentToClientApp(id, app));

            await Promise.all(requestSequence);
            notification.success({ message: `Согласие успешно ${isEditMode ? 'изменено' : 'создано'}` });
            setLoading(true);
            history.replace(pathname);
            redirectToList();
        } catch (error) {
            if (error.message) {
                message.error(`Ошибка ${ isEditMode ? 'изменения' : 'создания' } согласия: ${ error.message }`);
            }
            console.warn(error);
            setLoadingTextEditor(false);
        }
    };

    return (
        <div>
            <Header />
            <div className={styles.headerWrapper}>
                <div className={styles.title}>
                    {mode === ConsentFormMode.CREATE ? NEW_CONSENT : `${EDIT_CONSENT}, ${consentData.version}`}
                </div>
                <div className={styles.buttons}>
                    <Button
                        type="primary"
                        onClick={form.submit}
                        disabled={loadingTextEditor}
                    >
                        {BUTTON_TEXT.SAVE}
                    </Button>
                    <Button onClick={redirectToList}>
                        {BUTTON_TEXT.CANCEL}
                    </Button>
                </div>
            </div>
            <div className={styles.consentFormContainer}>
                <div className={styles.container}>
                    <Form
                        className={styles.form}
                        onFinish={handleFormFinish}
                        form={form}
                        layout="vertical"
                    >
                        <Row>
                            <Col span={7}>
                                <Form.Item
                                    label={CONSENT_DATE}
                                    name="createDate"
                                    rules={[{ required: true, message: 'Поле обязательно' }]}
                                >
                                    <DatePicker
                                        className={styles.createDate}
                                        placeholder={DATE_PICKER_PLACEHOLDER}
                                        locale={localeDatePicker}
                                        disabled={isEditMode}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>
                                <Form.Item
                                    label={VERSION}
                                    name="version"
                                    rules={[
                                        { required: true, message: 'Поле обязательно' },
                                    ]}
                                >
                                    <Input
                                        className={styles.version}
                                        placeholder={VERSION_PLACEHOLDER}
                                        disabled={isEditMode}
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <div className={styles.editorWrapper}>
                            <Suspense fallback={<div></div>}>
                                <Form.Item
                                    label={CONSENTS_TEXT}
                                    name="text"
                                    rules={[
                                        { required: true, message: 'Поле обязательно' },
                                        {
                                            message: consentTextMessage,
                                            validator: consentTextValidator,
                                            validateTrigger: 'onSubmit',
                                        },
                                    ]}
                                    initialValue={consentData?.text}
                                    getValueFromEvent={(_, editor) => editor.getData()}
                                >
                                    <RichTextEditor
                                        disabled={editorDisabled}
                                        onReady={onReadyRichText}
                                    />
                                </Form.Item>
                            </Suspense>
                            <div className={styles.select}>
                                <Form.Item
                                    name="clientApplications"
                                    label="Приложения в которых показывается согласие"
                                    rules={[{ required: true, message: 'Поле обязательно' }]}
                                >
                                    <SelectTags
                                        placeholder="Приложения в которых показывается согласие"
                                        data={appList}
                                        nameKey="displayName"
                                        showClearIcon={false}
                                        canRemoveSelected={false}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
            {loadingTextEditor && (
                <Loading className={styles.loadingContainer} />
            )}
        </div>
    );
};

export default ConsentForm;
