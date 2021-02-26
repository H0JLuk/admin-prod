import React, { useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Form } from 'antd';
import StepInfo from './PromoCampaignSteps/StepInfo/StepInfo';
import StepVisibility from './PromoCampaignSteps/StepVisibility/StepVisibility';
import StepTextAndImage from './PromoCampaignSteps/StepTextAndImage/StepTextAndImage';
import PromoCampaignSideBar from '../PromoCampaignSideBar/PromoCampaignSideBar';
import callConfirmModalForPromoCodeTypeChanging from './PromoCampaignSteps/ConfirmModalForPromoCodeTypeChanging/ConfirmModalForPromoCodeTypeChanging';
import Header from '../../../../components/Header/Header';
import {
    allStep,
    bannersFields,
    CANCEL,
    COMPLETE,
    modes,
    modsTitle,
    NEXT,
    SAVE,
    STEP,
    steps,
} from './PromoCampaignFormConstants';
import {
    arrayToObject,
    checkUniqVisibilitySettings,
    createImgBanners,
    createTexts,
    createVisibilities,
    EditImgBanners,
    editTextBanners,
    getDataForSend,
    getPromoCampaignForCopy,
    getVisibilitySettingsWithDoubleError,
    getVisibilitySettingsWithUpdatedErrors,
    normalizeFirstStepValue,
    normalizePromoCampaignData,
    getPromoCampaignValue,
    checkPromoCodes,
} from './PromoCampaignFormUtils';
import { filterBanner, deleteText } from './PromoCampaignFormSave.utils';
import { getUnissuedPromoCodeStatistics } from '../../../../api/services/promoCodeService';
import { editPromoCampaign, newPromoCampaign, copyPromoCampaign } from '../../../../api/services/promoCampaignService';

import { ReactComponent as LoadingSpinner } from '../../../../static/images/loading-spinner.svg';

import styles from './PromoCampaignForm.module.css';
const PromoCampaignForm = ({ mode = modes.create, matchUrl, isCopy }) => {
    const history = useHistory();
    const [form] = Form.useForm();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [validStep, setValidStep] = useState(1);
    const [messageError, setMessageError] = useState('');
    const [saveStatus, setSaveStatus] = useState(true);
    const changedImgs = useRef([]);
    const [state, setState] = useState({
        name: '',
        dzoId: null,
        webUrl: '',
        // count: null, // количество промокодов
        datePicker: [],
        promoCodeType: null,
        active: false,
        offerDuration: 0,
        finishDate: '',
        startDate: '',
        externalId: '',
        visibilitySettings: [{
            id: Date.now(),
            location: null,
            salePoint: null,
            visible: false,
            errors: {},
        }],
        texts: {},
        banners: {},
        typePromoCampaign: '',
        categoryIdList: [],
        appCode: null,
        settings: {
            priorityOnWebUrl: false,
            alternativeOfferMechanic: false,
        },
    });
    const [copyPromoCampaignId, setCopyPromoCampaignId] = useState(null);
    const { state: stateFromLocation } = useLocation();
    const { promoCampaign, copyVisibilitySettings } = stateFromLocation || {};
    const savedPromoCampaignData = useRef({});
    const textAndBannersRef = useRef({});

    const isEdit = mode === modes.edit;
    const stepsCount = !copyVisibilitySettings ? allStep : allStep - 1;

    const onChangeState = useCallback((val, index, input, hasErrors) => {
        setState((prevState) => {
            const visibilitySettings = getVisibilitySettingsWithUpdatedErrors(
                prevState.visibilitySettings,
                index,
                hasErrors
            );

            const newState = { ...prevState, visibilitySettings };
            const newVal = input !== undefined ? { [input]: val } || val : val;
            const prevVal = newState.visibilitySettings[index];

            if (prevVal) {
                newState.visibilitySettings.splice(index, 1, { ...prevVal, ...newVal });
                return { ...newState, visibilitySettings: [...newState.visibilitySettings] };
            }

            return { ...newState, visibilitySettings: [...newState.visibilitySettings, newVal] };
        });
    }, []);

    useEffect(() => {
        if (mode === modes.edit) {
            if (!promoCampaign) {
                return history.push(matchUrl);
            }

            const normalizeData = normalizePromoCampaignData({ promoCampaign, isCopy });
            setState((prev) => ({
                ...prev,
                ...normalizeData,
            }));

            savePromoCampaignData({
                ...state,
                ...normalizeData,
                banners: promoCampaign.banners,
                texts: promoCampaign.texts,
                id: promoCampaign.id,
            });

            textAndBannersRef.current = {
                banners: normalizeData.banners,
                texts: normalizeData.texts,
            };
            setLoading(false);

            if (!isCopy) {
                setValidStep(steps.visibility);
            }
        } else {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onDeleteState = useCallback((index, hasErrors) => {
        setState((prevState) => {
            if (index !== undefined) {
                const visibilitySettings = getVisibilitySettingsWithUpdatedErrors(
                    prevState.visibilitySettings,
                    index,
                    hasErrors
                );
                return { ...prevState, visibilitySettings: visibilitySettings.filter((_, idx) => idx !== index) };
            }

            return prevState;
        });
    }, []);

    const validateVisibilitySettings = useCallback(() => {
        const { visibilitySettings } = state;

        if (!visibilitySettings[0].location) {
            const [setting] = visibilitySettings;
            const nextState = { ...state };
            nextState.visibilitySettings[0] = {
                ...setting,
                errors: { location: 'Укажите локацию' },
            };

            setState(nextState);
            return false;
        }

        const samePositions = checkUniqVisibilitySettings(visibilitySettings);

        if (samePositions.length) {
            setState((prev) => ({
                ...prev,
                visibilitySettings: getVisibilitySettingsWithDoubleError(visibilitySettings, samePositions),
            }));
            return false;
        }

        return true;
    }, [state]);

    const editPromoCampaignHandler = async (newValue = {}) => {
        const currentData = { ...state, ...newValue };
        const dataForSend = getDataForSend(currentData);

        if ((isCopy || !isEdit) && !copyVisibilitySettings && !validateVisibilitySettings()) {
            return;
        }

        try {
            setLoading(true);

            let oldPromoCampaignData = getPromoCampaignValue(promoCampaign, savedPromoCampaignData.current);

            if (isCopy) {
                if (typeof copyPromoCampaignId !== 'number') {
                    const dataForCopy = getPromoCampaignForCopy(
                        { ...oldPromoCampaignData, ...currentData },
                        copyVisibilitySettings
                    );
                    oldPromoCampaignData = await copyPromoCampaign(oldPromoCampaignData.id, dataForCopy, currentData.appCode);
                } else {
                    await editPromoCampaign({ ...dataForSend, id: oldPromoCampaignData.id });
                }

                if (!copyVisibilitySettings) {
                    const { visibilitySettings } = currentData;
                    const visibilityPromises = createVisibilities(
                        visibilitySettings,
                        oldPromoCampaignData.id,
                        state.appCode
                    );
                    await Promise.all(visibilityPromises);
                }
            } else {
                await editPromoCampaign({ ...dataForSend, id: oldPromoCampaignData.id });
            }

            const textEditPromises = editTextBanners(
                currentData.texts,
                oldPromoCampaignData,
                currentData.appCode
            );

            await Promise.all(textEditPromises);
            await EditImgBanners(
                currentData.banners,
                oldPromoCampaignData,
                changedImgs.current,
                currentData.appCode
            );

            if (savedPromoCampaignData.current.id && !isCopy) {
                const { visibilitySettings } = currentData;
                const visibilityPromises = createVisibilities(
                    visibilitySettings,
                    oldPromoCampaignData.id,
                    state.appCode
                );
                await Promise.all(visibilityPromises);
            }

            history.push(matchUrl);
        } catch ({ message }) {
            setMessageError(message);
            setLoading(false);
        }
    };

    const handleOk = async () => {
        const promoCampaignId = getPromoCampaignValue(promoCampaign, savedPromoCampaignData.current).id;
        await getUnissuedPromoCodeStatistics(promoCampaignId, state.promoCodeType);
        await editPromoCampaignHandler();
    };

    const handleEdit = async () => {
        const oldValue = checkPromoCodes(savedPromoCampaignData.current, promoCampaign);
        const newValue = state.promoCodeType;

        if (oldValue !== newValue && !isCopy) {
            const changingValue = `${oldValue}_TO_${newValue}`;
            await callConfirmModalForPromoCodeTypeChanging(handleOk, changingValue);
        } else {
            await editPromoCampaignHandler();
        }
    };

    const handleSave = async () => {
        if (!validateVisibilitySettings()) {
            return;
        }

        setLoading(true);

        try {
            const { visibilitySettings } = state;
            const dataForSend = getDataForSend(state);
            const { id } = await newPromoCampaign(dataForSend, state.appCode);
            const textPromises = createTexts(state.texts, id, state.appCode);
            const visibilityPromises = createVisibilities(visibilitySettings, id, state.appCode);

            await Promise.all(textPromises);
            await createImgBanners(state.banners, id, state.appCode);
            await Promise.all(visibilityPromises);

            history.push(matchUrl);
        } catch (error) {
            setMessageError(error.message);
            setLoading(false);
        }
    };

    const handleNextStep = (val) => {
        setState((prevState) => ({ ...prevState, ...val }));

        if (step === stepsCount && isCopy && copyVisibilitySettings) {
            editPromoCampaignHandler(val);
        } else {
            step < stepsCount && setStep(step + 1);
        }

    };

    const handleCancel = () => history.push(matchUrl);
    const handleBackClick = useCallback(() => setStep((prev) => prev - 1), []);

    const validStepChange = useCallback((step, finish = true) => {
        if (validStep !== step && !(step < validStep && finish)) {
            setValidStep(step);
        }
    }, [validStep]);

    const addChangedImg = useCallback((imgName) => {
        setSaveStatus(false);
        if (imgName && !changedImgs.current.includes(imgName)) {
            changedImgs.current.push(imgName);
        }
    }, []);

    const changeTypePromo = useCallback(() =>
        setState((prev) => ({
            ...prev,
            texts: {},
            banners: {},
        })), []);

    const StepContainer = (() => {
        switch (step) {
            case steps.main_info:
                return (
                    <StepInfo
                        isCopy={ isCopy }
                        state={ { ...state, ...normalizePromoCampaignData({ promoCampaign, appCode: state.appCode, isCopy }) } }
                        changeTypePromo={ changeTypePromo }
                        setFieldsValue={ form.setFieldsValue }
                        oldName={ savedPromoCampaignData.current?.name || promoCampaign?.name }
                        oldExternalId={ savedPromoCampaignData.current?.externalId ?? promoCampaign?.externalId }
                        copyPromoCampaignId={ copyPromoCampaignId }
                        mode={ typeof savedPromoCampaignData.current?.id === 'number' ? modes.edit : mode }
                    />
                );
            case steps.textAndBanners:
                return (
                    <StepTextAndImage
                        texts={ state.texts }
                        banners={ state.banners }
                        typePromoCampaign={ state.typePromoCampaign }
                        addChangedImg={ addChangedImg }
                        setFields={ form.setFields }
                    />
                );
            case steps.visibility:
                return (
                    <StepVisibility
                        visibilitySettings={ state.visibilitySettings }
                        onChangeState={ onChangeState }
                        onDeleteState={ onDeleteState }
                        viewMode={ mode === modes.edit }
                        isCopy={ isCopy }
                        copyVisibilitySettings={ copyVisibilitySettings }
                    />
                );
            default:
                return null;
        }
    })();


    // edits promoCampaign when onclick on save button
    const onSavePromoCampaign = async (dataForSend, id) => {
        setLoading(true);

        try {
            await editPromoCampaign({ ...dataForSend, id });
            savePromoCampaignData({ ...dataForSend, id });
        } catch ({ message }) {
            setMessageError(message);
        }
    };

    // creates promoCampaign when onclick on save button
    const onCreatePromoCampaign = async (dataForSend, appCode) => {
        setLoading(true);
        try {
            const { id } = await newPromoCampaign(dataForSend, appCode);
            savePromoCampaignData({ ...dataForSend, id, texts: [], banners: [] });
        } catch ({ message }) {
            setMessageError(message);
        }
    };

    // saved data in ref on any click save
    const savePromoCampaignData = (data) => {
        return (savedPromoCampaignData.current = { ...savedPromoCampaignData.current, ...data });
    };

    // Сохраняет баннеры и текса в отдельный ref, эти данные используются в форме.
    // Так же по этим данным идет проверка текстов и баннеров при удалении.
    const saveTextAndBanners = (textsToSave, bannersToSave) => {
        const { texts, banners } = textAndBannersRef.current;

        return textAndBannersRef.current = {
            texts: {
                ...state.texts,
                ...texts,
                ...arrayToObject(textsToSave, 'type', 'value'),
            },
            banners: {
                ...state.banners,
                ...banners,
                ...arrayToObject(bannersToSave, 'type', 'url'),
            },
        };
    };

    // вызывается в модальном окне, при смене типа промо-кода.
    // При нажатии на ОК отправит запрос на сервер для обновления данных.
    const handleOkSaveMode = async () => {

        const dataForSend = getDataForSend(normalizeFirstStepValue({ ...state, ...form.getFieldsValue() }));

        const promoCampaignId = isCopy
            ? copyPromoCampaignId
            : getPromoCampaignValue(promoCampaign, savedPromoCampaignData.current).id;

        await getUnissuedPromoCodeStatistics(promoCampaignId, dataForSend.promoCodeType);
        await onSavePromoCampaign(dataForSend, promoCampaignId);
    };

    // проверяет изменение типа промо-кода, если изменился, то вызовет модальное окно, в другом случае отправляет запрос на сервер для обновления данных;
    const handleEditPromoCampaign = async (dataForSend, id) => {

        if (!isCopy) {
            const oldValue = checkPromoCodes(savedPromoCampaignData.current, promoCampaign);
            const newValue = form.getFieldValue('promoCodeType');
            if (oldValue !== newValue) {
                const changingValue = `${oldValue}_TO_${newValue}`;
                const result = await callConfirmModalForPromoCodeTypeChanging(handleOkSaveMode, changingValue);
                return result;
            }
        }
        await onSavePromoCampaign(dataForSend, id);
        return true;
    };

    const clearImgRef = () => {
        changedImgs.current = [];
    };

    // Проверяет удаленные текста, сохраняет их в ref и обновляет поля формы
    const onTextDelete = (id, type) => {
        savePromoCampaignData(deleteText(savedPromoCampaignData.current, id));
        textAndBannersRef.current.texts[type] = '';

        form.setFieldsValue({ texts: { [type]: '' } });
    };

    // Делает запрос на редактирование баннеров и текстов,
    // Перед отправкой делает проверку на наличие изменений в текстах и баннерах.
    const editImageAndBannersRef = async (val, appCode, onTextDelete) => {
        setLoading(true);

        const textPromises = editTextBanners(
            val.texts,
            savedPromoCampaignData.current,
            appCode,
            onTextDelete
        );

        const editedTexts = (await Promise.all(textPromises)).filter(Boolean);
        const { banners: editedBanners, deletedBannersId } = await EditImgBanners(
            val.banners,
            savedPromoCampaignData.current,
            changedImgs.current,
            appCode
        );

        const { texts, banners } = saveTextAndBanners(editedTexts, editedBanners);
        const promoCampaignSavedData = filterBanner(savedPromoCampaignData.current, deletedBannersId, editedTexts);

        // обновляем поля в форме, после того как создали и отфильтровали старые данные в ref
        form.setFieldsValue({ texts, banners });

        // обновляем данные в ref, для того чтобы проверять новые текста и баннеры на изменения.
        savePromoCampaignData({
            ...promoCampaignSavedData,
            banners: [...promoCampaignSavedData.banners, ...editedBanners],
            texts: [...promoCampaignSavedData.texts, ...editedTexts],
        });

        clearImgRef();

        setState((prev) => ({ ...prev, banners, texts }));
    };

    const onEditCopyPromoCampaign = async (newValue = {}) => {
        const currentData = { ...state, ...newValue };
        const dataForSend = getDataForSend(currentData);

        /**
         * Проверяем создание промо-кампании в режиме копирования,
         * Если нажали кнопку сохранить на первом шаге, то создается копия, в таком случае появится ID промо-кампании.
         * Если копия уже создана и у нас есть ее ID, то в таких случаях будет вызываться редактирование этой компании.
         */
        if (typeof copyPromoCampaignId !== 'number') {

            setLoading(true);

            let oldPromoCampaignData = getPromoCampaignValue(promoCampaign, savedPromoCampaignData.current);
            const dataForCopy = getPromoCampaignForCopy(
                { ...oldPromoCampaignData, ...currentData },
                copyVisibilitySettings
            );
            oldPromoCampaignData = await copyPromoCampaign(oldPromoCampaignData.id, dataForCopy, currentData.appCode);

            setCopyPromoCampaignId(oldPromoCampaignData.id);

            const normalizeData = normalizePromoCampaignData({ promoCampaign, appCode: currentData.appCode });

            savePromoCampaignData({
                ...state,
                ...normalizeData,
                ...oldPromoCampaignData,
                externalId: oldPromoCampaignData.externalId ?? '',
            });

            textAndBannersRef.current = {
                banners: normalizeData.banners,
                texts: normalizeData.texts,
            };
        } else {
            await handleEditPromoCampaign(dataForSend, copyPromoCampaignId);
        }
    };

    const handleSaveInfo = async () => {
        try {
            const val = await form.validateFields();

            switch (step) {
                case steps.main_info: {
                    const dataForSend = getDataForSend(normalizeFirstStepValue(val));

                    // В режиме копирования вызываем функцию для копирования промо-кампании
                    if (isCopy) {
                        await onEditCopyPromoCampaign({ ...dataForSend, appCode: val.appCode });
                        return;
                    }

                    // Если ID промо-кампании уже есть, то будет вызывается редактирование кампании, в ином случае создание.
                    savedPromoCampaignData.current?.id
                        ? await handleEditPromoCampaign(dataForSend, savedPromoCampaignData.current.id)
                        : await onCreatePromoCampaign(dataForSend, val.appCode);
                    break;
                }
                case steps.textAndBanners: {
                    const { id, appCode } = savedPromoCampaignData.current;
                    const dataForSend = getDataForSend(normalizeFirstStepValue(state));

                    /**
                     * В режиме копирования вызываем функцию на редактирование промо-кампании,
                     * там проверится наличие уже созданной копии, если копию уже создали, тогда вызовет обновление кампании,
                     * и потом вызовет редактирование баннеров и текстов.
                     * В другом случае - создаст копию и вызовет редактирование баннеров и текстов(если они поменялись)
                     */
                    if (isCopy) {
                        await onEditCopyPromoCampaign();
                        await editImageAndBannersRef(val, appCode, onTextDelete);
                        return;
                    }

                    /**
                     * Проверяем наличие уже созданной промо-кампании.
                     * Если нет ID, то создает кампанию и баннеры с текстами.
                     */
                    if (typeof id !== 'number') {
                        await onCreatePromoCampaign(dataForSend, state.appCode);
                        await editImageAndBannersRef(val, appCode, onTextDelete);
                    } else {
                        /**
                         * Проверяем тип промо-кода, если он изменился, то появится модальное окно.
                         * При нажатии на кнопку ОК - отправится запрос на сервер для обновления данных.
                         */
                        const result = await handleEditPromoCampaign(dataForSend, savedPromoCampaignData.current.id);

                        /**
                         * `result` нужен для того, чтобы отправлять запрос на обновление текстов и баннеров только в случаях если:
                         * 1. Изменился тип промо-кода и пользователь подтвердил изменение в модалке
                         * 2. Тип промо-кода не изменился.
                         */
                        if (result) {
                            await editImageAndBannersRef(val, appCode, onTextDelete);
                        }
                    }
                    break;
                }
                default:
                    break;
            }
        } catch ({ message }) {
            setMessageError(message);
        } finally {
            setSaveStatus(true);
            setLoading(false);
        }
    };

    const nextStep = async () => {
        try {
            const val = await form.validateFields();

            setValidStep(step + 1);
            switch (step) {
                case steps.main_info: {
                    const normalizedData = normalizeFirstStepValue(val);
                    handleNextStep(normalizedData);
                    break;
                }
                case steps.textAndBanners:
                case steps.visibility:
                default: {
                    handleNextStep(val);
                }
            }
        } catch ({ message }) {
            setMessageError(message);
        }
    };

    const isChanged = (changedFields) => {
        setSaveStatus(false);

        changedFields && validStepChange(step, false);

        if (Object.keys(changedFields).includes(bannersFields)) {
            const value = changedFields[bannersFields];
            const [fieldKey] = Object.keys(value);
            addChangedImg(fieldKey);
        }
    };

    let onClick = nextStep;
    let buttonText = NEXT;

    if (step === stepsCount) {
        buttonText = COMPLETE;

        if (isCopy && copyVisibilitySettings) {
            onClick = nextStep;
        } else {
            onClick = mode === modes.create && !savedPromoCampaignData.current?.id ? handleSave : handleEdit;
        }
    }

    return (
        <div className={ styles.promoCreateContainer }>
            <PromoCampaignSideBar
                active={ step }
                validStep={ validStep }
                onClick={ setStep }
                newPromoCampaign={ mode === modes.create }
                hideLastStep={ copyVisibilitySettings }
            />
            <div className={ styles.wrapper }>
                <Header onClickFunc={ step !== 1 && handleBackClick } />
                <div className={ cn(styles.containerControl, { [styles.noMargin]: step === steps.visibility }) }>
                    <p className={ styles.headerTitle }>
                        { isCopy && mode === modes.edit ? `Копия: ${promoCampaign?.name}` : modsTitle[mode] }
                    </p>
                    <p className={ styles.headerSteps }>
                        { STEP } { step } из { stepsCount }
                    </p>
                    <Button
                        className={ cn(styles.btnMR, styles.btnCancel) }
                        onClick={ handleCancel }
                    >
                        { CANCEL }
                    </Button>
                    <Button
                        type='primary'
                        className={ cn(styles.btnMR) }
                        onClick={ onClick }
                    >
                        { buttonText }
                    </Button>
                    { step < stepsCount && (
                        <Button
                            type='primary'
                            onClick={ handleSaveInfo }
                            disabled={ saveStatus || loading }
                        >
                            { SAVE }
                        </Button>
                    ) }
                    { messageError && <div className={ styles.error }>{ messageError }</div> }
                </div>

                <Form
                    className={ cn({ [styles.containerStep]: step !== steps.visibility }) }
                    form={ form }
                    layout='vertical'
                    onValuesChange={ isChanged }
                >
                    { StepContainer }
                </Form>
            </div>
            { loading && (
                <div className={ styles.loadingWrapper }>
                    <div className={ styles.loading }>
                        <LoadingSpinner />
                    </div>
                </div>
            ) }
        </div>
    );
};

export default PromoCampaignForm;
