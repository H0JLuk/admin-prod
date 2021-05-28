import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Col, DatePicker, Form, Row, Input, message, notification, Button } from 'antd';
import localeDatePicker from 'antd/es/date-picker/locale/ru_RU';
import moment from 'moment';
import Header from '../../../components/Header/Header';
import SelectTags from '../../../components/SelectTags/SelectTags';
import Loading from '../../../components/Loading/Loading';
import { getPatternAndMessage } from '../../../utils/validators';
import { attachConsentToClientApp, createConsent, getConsentById, updateConsent } from '../../../api/services/consentsService';
import { getClientAppList } from '../../../api/services/clientAppService';

import styles from './ConsentForm.module.css';

const RichTextEditor = React.lazy(() => import('../../../components/RichTextEditor'));

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

const consentTextValidator = (_, value) => {
    const div = document.createElement('div');
    div.innerHTML = value;
    const text = div.textContent;
    return consentTextPattern.test(text) ? Promise.resolve() : Promise.reject();
};


const ConsentForm = ({ history, matchPath, mode }) => {
    const [appList, setAppList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingTextEditor, setLoadingTextEditor] = useState(true);
    const { state, pathname } = useLocation();
    const { consentId } = useParams();
    const [form] = Form.useForm();
    const consent = useRef({});
    const consentData = consent.current;
    const isEditMode = mode === 'edit';
    const { signed = false } = consentData;
    const editorDisabled = isEditMode && signed;

    useEffect(() => {
        (async () => {
            const { clientApplicationDtoList: appListRes = [] } = await getClientAppList();
            let activeAppList = appListRes.filter(app => !app.isDeleted);

            if (isEditMode) {
                consent.current = state?.consentData;
                if (!state?.consentData) {
                    consent.current = await getConsentById(consentId);
                }
                const { createDate, version, text, clientApplications } = consent.current;
                const clientAppCodes = clientApplications.map(app => app.code);
                form.setFieldsValue({
                    createDate: moment(createDate),
                    version,
                    text,
                    clientApplications: clientAppCodes,
                });
                const selectedAppCodes = clientApplications.map(app => app.code);
                activeAppList = activeAppList.map(app => ({
                    ...app,
                    disabled: selectedAppCodes.includes(app.code)
                }));
            }

            setAppList(activeAppList);
            setLoading(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) {
        return (
            <div>
                <Header />
                <Loading className={ styles.loadingContainer } />
            </div>
        );
    }

    const onReadyRichText = () => {
        setLoadingTextEditor(false);
    };

    const redirectToList = () => history.push(matchPath);

    const handleFormFinish = async (data) => {
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
                await updateConsent({ ...body, id });
            } else {
                ({ id } = await createConsent(body));
            }
            notification.success({ message: `Согласие успешно ${isEditMode ? 'изменено' : 'создано'}` });

            const requestSequence = newAppSelection.map(app => attachConsentToClientApp(id, app));

            await Promise.all(requestSequence);
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
            <div className={ styles.headerWrapper }>
                <div className={ styles.title }>
                    { mode === 'create' ? NEW_CONSENT : `${EDIT_CONSENT}, ${consentData.version}` }
                </div>
                <div className={ styles.buttons }>
                    <Button
                        type="primary"
                        onClick={ form.submit }
                        disabled={ loadingTextEditor }
                    >
                        { BUTTON_TEXT.SAVE }
                    </Button>
                    <Button onClick={ redirectToList }>
                        { BUTTON_TEXT.CANCEL }
                    </Button>
                </div>
            </div>
            <div className={ styles.consentFormContainer }>
                <div className={ styles.container }>
                    <Form
                        className={ styles.form }
                        onFinish={ handleFormFinish }
                        form={ form }
                        layout="vertical"
                    >
                        <Row>
                            <Col span={ 7 }>
                                <Form.Item
                                    label={ CONSENT_DATE }
                                    name="createDate"
                                    rules={ [{ required: true, message: 'Поле обязательно' }] }
                                >
                                    <DatePicker
                                        className={ styles.createDate }
                                        placeholder={ DATE_PICKER_PLACEHOLDER }
                                        locale={ localeDatePicker }
                                        disabled={ isEditMode }
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 7 }>
                                <Form.Item
                                    label={ VERSION }
                                    name="version"
                                    rules={ [
                                        { required: true, message: 'Поле обязательно' },
                                    ] }
                                >
                                    <Input
                                        className={ styles.version }
                                        placeholder={ VERSION_PLACEHOLDER }
                                        disabled={ isEditMode }
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <div className={ styles.editorWrapper }>
                            <Suspense fallback={ <div></div> }>
                                <Form.Item
                                    label={ CONSENTS_TEXT }
                                    name="text"
                                    rules={ [
                                        { required: true, message: 'Поле обязательно' },
                                        {
                                            message: consentTextMessage,
                                            validator: consentTextValidator,
                                            validateTrigger: 'onSubmit',
                                        },
                                    ] }
                                    initialValue={ consentData?.text }
                                    getValueFromEvent={ (_, editor) => editor.getData() }
                                >
                                    <RichTextEditor
                                        disabled={ editorDisabled }
                                        onReady={ onReadyRichText }
                                    />
                                </Form.Item>
                            </Suspense>
                            <div className={ styles.select }>
                                <Form.Item
                                    name="clientApplications"
                                    label="Приложения в которых показывается согласие"
                                    rules={ [{ required: true, message: 'Поле обязательно' }] }
                                >
                                    <SelectTags
                                        placeholder="Приложения в которых показывается согласие"
                                        data={ appList }
                                        idKey="code"
                                        nameKey="name"
                                        showClearIcon={ false }
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
            { loadingTextEditor && (
                <Loading className={ styles.loadingContainer } />
            ) }
        </div>
    );
};

export default ConsentForm;
