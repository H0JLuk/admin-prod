import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BannerCreateDto, BannerCreateTextDto, BannerDto, BannerTextDto, PromoCampaignCreateDto, PromoCampaignDto } from '@types';
import cn from 'classnames';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Form, FormItemProps, FormProps } from 'antd';
import StepInfo from './PromoCampaignSteps/StepInfo';
import StepVisibility from './PromoCampaignSteps/StepVisibility';
import StepTextAndImage from './PromoCampaignSteps/StepTextAndImage';
import PromoCampaignSideBar from '../PromoCampaignSideBar';
import callConfirmModalForPromoCodeTypeChanging from './PromoCampaignSteps/ConfirmModalForPromoCodeTypeChanging';
import Header from '@components/Header';
import {
    allStep,
    bannersFields,
    COMPLETE,
    modes,
    modsTitle,
    NEXT,
    STEP,
    steps,
} from './PromoCampaignFormConstants';
import {
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
import { getUnissuedPromoCodeStatistics } from '@apiServices/promoCodeService';
import { editPromoCampaign, createPromoCampaign, copyPromoCampaign } from '@apiServices/promoCampaignService';
import { DEFAULT_OFFER_DURATION } from '@constants/promoCampaigns';
import { arrayToObject } from '@utils/helper';
import behaviorTypes from '@constants/behaviorTypes';
import { BUTTON_TEXT } from '@constants/common';
import {
    PromoCampaignDtoWithAppCode,
    PromoCampaignFormDataFormSend,
    PromoCampaignFormInitialState,
    PromoCampaignFormSavedStateRef,
    PromoCampaignFormStateFormLocation,
    PromoCampaignFormTextAndBannersRefState,
    PromoCampaignSaveDataFunc,
} from './types';
import { INFO_ROWS_KEYS } from './PromoCampaignSteps/StepTextAndImage/Templates/templateConstants';

import { ReactComponent as LoadingSpinner } from '@imgs/loading-spinner.svg';

import styles from './PromoCampaignForm.module.css';

export type PromoCampaignFormProps = {
    mode?: 'create' | 'edit';
    matchPath: string;
    isCopy?: boolean;
};

const PromoCampaignForm: React.FC<PromoCampaignFormProps> = ({ mode = modes.create, matchPath, isCopy }) => {
    const history = useHistory();
    const [form] = Form.useForm();
    const [step, setStep] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [validStep, setValidStep] = useState<number>(1);
    const [messageError, setMessageError] = useState<string>('');
    const [saveStatus, setSaveStatus] = useState<boolean>(true);
    const changedImgs = useRef<FormItemProps['name'][]>([]);
    const [state, setState] = useState<PromoCampaignFormInitialState>({
        name: '',
        dzoId: null,
        webUrl: '',
        // count: null, // ???????????????????? ????????????????????
        datePicker: [],
        promoCodeType: null,
        active: false,
        offerDuration: DEFAULT_OFFER_DURATION,
        finishDate: '',
        startDate: '',
        externalId: '',
        productOfferingId: null,
        visibilitySettings: [{
            id: Date.now(),
            location: null,
            salePoint: null,
            visible: false,
            errors: {},
        }],
        texts: {},
        banners: {},
        type: '' as INFO_ROWS_KEYS,
        categoryIdList: [],
        appCode: null,
        standalone: false,
        settings: {
            priority_on_web_url: false,
            alternative_offer_mechanic: false,
            details_button_label: '',
            details_button_url: '',
            disabled_banner_types: [],
            sale_enabled: false,
        },
        behaviorType: true,
    });
    const [copyPromoCampaignId, setCopyPromoCampaignId] = useState<null | number>(null);
    const { state: stateFromLocation } = useLocation<PromoCampaignFormStateFormLocation>();
    const { promoCampaign, copyVisibilitySettings } = stateFromLocation || {};
    const savedPromoCampaignData = useRef({} as PromoCampaignFormSavedStateRef);
    const textAndBannersRef = useRef({} as PromoCampaignFormTextAndBannersRefState);
    const isEdit = mode === modes.edit;
    const stepsCount = !copyVisibilitySettings ? allStep : allStep - 1;

    const onChangeState = useCallback((val, index, input, hasErrors) => {
        setState((prevState) => {
            const visibilitySettings = getVisibilitySettingsWithUpdatedErrors(
                prevState.visibilitySettings,
                index,
                hasErrors,
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
                return history.push(matchPath);
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
                banners: normalizeData.banners as BannerCreateDto,
                texts: normalizeData.texts as BannerCreateTextDto,
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

    const onDeleteState = useCallback((index: number, hasErrors) => {
        setState((prevState) => {
            if (index !== undefined) {
                const visibilitySettings = getVisibilitySettingsWithUpdatedErrors(
                    prevState.visibilitySettings,
                    index,
                    hasErrors,
                );
                return { ...prevState, visibilitySettings: visibilitySettings.filter((_, idx) => idx !== index) };
            }

            return prevState;
        });
    }, []);

    const validateVisibilitySettings = useCallback(() => {
        const { visibilitySettings = [] } = state;

        const isVisibilityErrors = visibilitySettings.some(({ location }) => !location);
        if (isVisibilityErrors) {
            const nextState = { ...state };
            nextState.visibilitySettings = nextState.visibilitySettings.map(({ location, ...rest }) =>
                !location ? { location, ...rest, errors: { location: '?????????????? ??????????????' } } : { location, ...rest },
            );
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

            let oldPromoCampaignData = getPromoCampaignValue(promoCampaign, savedPromoCampaignData.current) as PromoCampaignDto;

            if (isCopy) {
                if (typeof copyPromoCampaignId !== 'number') {
                    const dataForCopy = getPromoCampaignForCopy(
                        {
                            ...oldPromoCampaignData,
                            ...currentData,
                            behaviorType: currentData.behaviorType
                                ? behaviorTypes.QR
                                : behaviorTypes.WEB,
                        },
                        copyVisibilitySettings,
                    );
                    oldPromoCampaignData = await copyPromoCampaign(oldPromoCampaignData.id, dataForCopy as unknown as PromoCampaignDto, currentData.appCode as string);
                } else {
                    await editPromoCampaign({ ...dataForSend, id: oldPromoCampaignData.id } as PromoCampaignDto);
                }

                if (!copyVisibilitySettings) {
                    const { visibilitySettings } = currentData;
                    const visibilityPromises = createVisibilities(
                        visibilitySettings,
                        oldPromoCampaignData.id,
                        state.appCode as string,
                    );
                    await Promise.all(visibilityPromises);
                }
            } else {
                await editPromoCampaign({ ...dataForSend, id: oldPromoCampaignData.id } as PromoCampaignDto);
            }

            const textEditPromises = editTextBanners(
                currentData.texts as BannerCreateTextDto,
                oldPromoCampaignData,
                currentData.appCode as string,
            );

            await Promise.all(textEditPromises);
            await EditImgBanners(
                currentData.banners as BannerCreateDto,
                oldPromoCampaignData,
                changedImgs.current as string[],
                currentData.appCode as string,
            );

            if (savedPromoCampaignData.current.id && !isCopy) {
                const { visibilitySettings } = currentData;
                const visibilityPromises = createVisibilities(
                    visibilitySettings,
                    oldPromoCampaignData.id,
                    state.appCode as string,
                );
                await Promise.all(visibilityPromises);
            }

            history.push(matchPath);
        } catch ({ message }) {
            setMessageError(message);
            setLoading(false);
        }
    };

    const handleOk = async () => {
        const promoCampaignId = getPromoCampaignValue(promoCampaign, savedPromoCampaignData.current).id;
        await getUnissuedPromoCodeStatistics(promoCampaignId, state.promoCodeType as string);
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
            const dataForSend = getDataForSend<any>(state) as PromoCampaignCreateDto;
            const { id } = await createPromoCampaign(dataForSend, state.appCode as string);
            const textPromises = createTexts(state.texts as BannerCreateTextDto, id, state.appCode as string);
            const visibilityPromises = createVisibilities(visibilitySettings, id, state.appCode as string);

            await Promise.all(textPromises);
            await createImgBanners(state.banners as BannerCreateDto, id, state.appCode as string);
            await Promise.all(visibilityPromises);

            history.push(matchPath);
        } catch (error) {
            setMessageError(error.message);
            setLoading(false);
        }
    };

    const handleNextStep = (val: Partial<PromoCampaignFormInitialState>) => {
        setState((prevState) => ({ ...prevState, ...val }));

        if (step === stepsCount && isCopy && copyVisibilitySettings) {
            editPromoCampaignHandler(val);
        } else {
            step < stepsCount && setStep(step + 1);
        }

    };

    const handleCancel = () => history.push(matchPath);
    const handleBackClick = useCallback(() => setStep((prev) => prev - 1), []);

    const validStepChange = useCallback((newStep: number, finish = true) => {
        if (validStep !== newStep && !(newStep < validStep && finish)) {
            setValidStep(newStep);
        }
    }, [validStep]);

    const addChangedImg = useCallback((imgName: FormItemProps['name']) => {
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
                        isCopy={isCopy}
                        state={{ ...state, ...normalizePromoCampaignData({ promoCampaign, appCode: state.appCode as string, isCopy }) }}
                        changeTypePromo={changeTypePromo}
                        oldName={savedPromoCampaignData.current?.name || promoCampaign?.name}
                        oldExternalId={savedPromoCampaignData.current?.externalId ?? promoCampaign?.externalId}
                        copyPromoCampaignId={copyPromoCampaignId}
                        mode={typeof savedPromoCampaignData.current?.id === 'number' ? modes.edit : mode}
                    />
                );
            case steps.textAndBanners:
                return (
                    <StepTextAndImage
                        texts={state.texts as BannerCreateTextDto}
                        banners={state.banners as BannerCreateDto}
                        typePromoCampaign={state.type}
                        addChangedImg={addChangedImg}
                        setFields={form.setFields}
                        isCopy={isCopy}
                    />
                );
            case steps.visibility:
                return (
                    <StepVisibility
                        visibilitySettings={state.visibilitySettings}
                        onChangeState={onChangeState}
                        onDeleteState={onDeleteState}
                        viewMode={mode === modes.edit}
                        isCopy={isCopy}
                        copyVisibilitySettings={copyVisibilitySettings}
                    />
                );
            default:
                return null;
        }
    })();


    // edits promoCampaign when onclick on save button
    const onSavePromoCampaign = async (dataForSend: PromoCampaignFormDataFormSend, id: number) => {
        setLoading(true);

        try {
            await editPromoCampaign({ ...dataForSend, id } as PromoCampaignDto);
            savePromoCampaignData({ ...dataForSend, id });
            messageError && setMessageError('');
        } catch ({ message }) {
            setMessageError(message);
        }
    };

    // creates promoCampaign when onclick on save button
    const onCreatePromoCampaign = async (dataForSend: PromoCampaignFormDataFormSend, appCode: string) => {
        setLoading(true);
        try {
            const { id } = await createPromoCampaign(dataForSend as unknown as PromoCampaignCreateDto, appCode);
            savePromoCampaignData({ ...dataForSend, id, texts: [], banners: [] });
            messageError && setMessageError('');
        } catch ({ message }) {
            setMessageError(message);
        }
    };

    // saved data in ref on any click save
    const savePromoCampaignData: PromoCampaignSaveDataFunc = (data) =>
        (savedPromoCampaignData.current = { ...savedPromoCampaignData.current, ...data });

    // ?????????????????? ?????????????? ?? ?????????? ?? ?????????????????? ref, ?????? ???????????? ???????????????????????? ?? ??????????.
    // ?????? ???? ???? ???????? ???????????? ???????? ???????????????? ?????????????? ?? ???????????????? ?????? ????????????????.
    const saveTextAndBanners = (textsToSave: BannerTextDto[], bannersToSave: BannerDto[]) => {
        const { texts, banners } = textAndBannersRef.current;

        return textAndBannersRef.current = {
            texts: {
                ...state.texts,
                ...texts,
                ...arrayToObject(textsToSave, 'type', 'value'),
            } as BannerCreateTextDto,
            banners: {
                ...state.banners,
                ...banners,
                ...arrayToObject(bannersToSave, 'type', 'url'),
            } as BannerCreateDto,
        };
    };

    // ???????????????????? ?? ?????????????????? ????????, ?????? ?????????? ???????? ??????????-????????.
    // ?????? ?????????????? ???? ???? ???????????????? ???????????? ???? ???????????? ?????? ???????????????????? ????????????.
    const handleOkSaveMode = async () => {
        const formValues = form.getFieldsValue();
        const dataForSend = getDataForSend<PromoCampaignFormInitialState>(normalizeFirstStepValue({
            ...state,
            ...formValues,
            settings: {
                ...state.settings,
                ...(formValues.settings || {}),
            },
        }));

        const promoCampaignId = isCopy
            ? copyPromoCampaignId
            : getPromoCampaignValue(promoCampaign, savedPromoCampaignData.current).id;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        await getUnissuedPromoCodeStatistics(promoCampaignId!, dataForSend.promoCodeType!);
        await onSavePromoCampaign(dataForSend as PromoCampaignFormDataFormSend, promoCampaignId as number);
    };

    // ?????????????????? ?????????????????? ???????? ??????????-????????, ???????? ??????????????????, ???? ?????????????? ?????????????????? ????????, ?? ???????????? ???????????? ???????????????????? ???????????? ???? ???????????? ?????? ???????????????????? ????????????;
    const handleEditPromoCampaign = async (dataForSend: PromoCampaignFormDataFormSend, id: number) => {
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

    // ?????????????????? ?????????????????? ????????????, ?????????????????? ???? ?? ref ?? ?????????????????? ???????? ??????????
    const onTextDelete = (id: number, type: string) => {
        savePromoCampaignData(deleteText(savedPromoCampaignData.current as PromoCampaignDto, id));
        textAndBannersRef.current.texts[type] = '';

        form.setFieldsValue({ texts: { [type]: '' } });
    };

    // ???????????? ???????????? ???? ???????????????????????????? ???????????????? ?? ??????????????,
    // ?????????? ?????????????????? ???????????? ???????????????? ???? ?????????????? ?????????????????? ?? ?????????????? ?? ????????????????.
    const editImageAndBannersRef = async (
        val: Partial<PromoCampaignFormInitialState>,
        appCode: string,
        textDeleteCallback: (id: number, type: string) => void,
    ) => {
        setLoading(true);

        const textPromises = editTextBanners(val.texts as BannerCreateTextDto, savedPromoCampaignData.current as PromoCampaignDto, appCode, textDeleteCallback);

        const editedTexts = (await Promise.all(textPromises)).filter(Boolean);
        const { banners: editedBanners, deletedBannersId } = await EditImgBanners(
            val.banners as BannerCreateDto,
            savedPromoCampaignData.current as PromoCampaignDto,
            changedImgs.current as string[],
            appCode,
        );

        const { texts, banners } = saveTextAndBanners(editedTexts, editedBanners);
        const promoCampaignSavedData = filterBanner(savedPromoCampaignData.current as PromoCampaignDto, deletedBannersId, editedTexts);

        // ?????????????????? ???????? ?? ??????????, ?????????? ???????? ?????? ?????????????? ?? ?????????????????????????? ???????????? ???????????? ?? ref
        form.setFieldsValue({ texts, banners });

        // ?????????????????? ???????????? ?? ref, ?????? ???????? ?????????? ?????????????????? ?????????? ???????????? ?? ?????????????? ???? ??????????????????.
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
         * ?????????????????? ???????????????? ??????????-???????????????? ?? ???????????? ??????????????????????,
         * ???????? ???????????? ???????????? ?????????????????? ???? ???????????? ????????, ???? ?????????????????? ??????????, ?? ?????????? ???????????? ???????????????? ID ??????????-????????????????.
         * ???????? ?????????? ?????? ?????????????? ?? ?? ?????? ???????? ???? ID, ???? ?? ?????????? ?????????????? ?????????? ???????????????????? ???????????????????????????? ???????? ????????????????.
         */
        if (typeof copyPromoCampaignId !== 'number') {

            setLoading(true);

            let oldPromoCampaignData = getPromoCampaignValue(promoCampaign, savedPromoCampaignData.current) as PromoCampaignDto;
            const dataForCopy = getPromoCampaignForCopy(
                { ...oldPromoCampaignData, ...currentData },
                copyVisibilitySettings,
            ) as unknown as PromoCampaignDto;
            oldPromoCampaignData = await copyPromoCampaign(oldPromoCampaignData.id, dataForCopy, currentData.appCode as string);

            setCopyPromoCampaignId(oldPromoCampaignData.id);

            const normalizeData = normalizePromoCampaignData({ promoCampaign, appCode: currentData.appCode as string });

            savePromoCampaignData({
                ...state,
                ...normalizeData,
                ...oldPromoCampaignData,
                externalId: oldPromoCampaignData.externalId ?? '',
            });

            textAndBannersRef.current = {
                banners: normalizeData.banners as BannerCreateDto,
                texts: normalizeData.texts as BannerCreateTextDto,
            };
        } else {
            await handleEditPromoCampaign(dataForSend, copyPromoCampaignId);
        }
    };

    const handleSaveInfo = async () => {
        try {
            const val = await form.validateFields() ;

            switch (step) {
                case steps.main_info: {
                    const dataForSend = getDataForSend(normalizeFirstStepValue<PromoCampaignFormInitialState>({
                        ...state,
                        ...val,
                        settings: {
                            ...(promoCampaign?.settings || {}),
                            ...val.settings,
                        },
                    }));

                    // ?? ???????????? ?????????????????????? ???????????????? ?????????????? ?????? ?????????????????????? ??????????-????????????????
                    if (isCopy) {
                        await onEditCopyPromoCampaign({ ...dataForSend, appCode: val.appCode });
                        return;
                    }

                    isEdit
                        ? await handleEditPromoCampaign(dataForSend, savedPromoCampaignData.current.id)
                        : await onCreatePromoCampaign(dataForSend, val.appCode);
                    break;
                }
                case steps.textAndBanners: {
                    const { id, appCode } = savedPromoCampaignData.current as PromoCampaignDtoWithAppCode;
                    const dataForSend = getDataForSend(
                        normalizeFirstStepValue<PromoCampaignFormInitialState>(state),
                    );

                    /**
                     * ?? ???????????? ?????????????????????? ???????????????? ?????????????? ???? ???????????????????????????? ??????????-????????????????,
                     * ?????? ???????????????????? ?????????????? ?????? ?????????????????? ??????????, ???????? ?????????? ?????? ??????????????, ?????????? ?????????????? ???????????????????? ????????????????,
                     * ?? ?????????? ?????????????? ???????????????????????????? ???????????????? ?? ??????????????.
                     * ?? ???????????? ???????????? - ?????????????? ?????????? ?? ?????????????? ???????????????????????????? ???????????????? ?? ??????????????(???????? ?????? ????????????????????)
                     */
                    if (isCopy) {
                        await onEditCopyPromoCampaign();
                        await editImageAndBannersRef(val, appCode, onTextDelete);
                        return;
                    }

                    /**
                     * ?????????????????? ?????????????? ?????? ?????????????????? ??????????-????????????????.
                     * ???????? ?????? ID, ???? ?????????????? ???????????????? ?? ?????????????? ?? ????????????????.
                     */
                    if (typeof id !== 'number') {
                        await onCreatePromoCampaign(dataForSend, state.appCode as string);
                        await editImageAndBannersRef(val, appCode, onTextDelete);
                    } else {
                        /**
                         * ?????????????????? ?????? ??????????-????????, ???????? ???? ??????????????????, ???? ???????????????? ?????????????????? ????????.
                         * ?????? ?????????????? ???? ???????????? ???? - ???????????????????? ???????????? ???? ???????????? ?????? ???????????????????? ????????????.
                         */
                        const result = await handleEditPromoCampaign(dataForSend, savedPromoCampaignData.current.id);

                        /**
                         * `result` ?????????? ?????? ????????, ?????????? ???????????????????? ???????????? ???? ???????????????????? ?????????????? ?? ???????????????? ???????????? ?? ?????????????? ????????:
                         * 1. ?????????????????? ?????? ??????????-???????? ?? ???????????????????????? ???????????????????? ?????????????????? ?? ??????????????
                         * 2. ?????? ??????????-???????? ???? ??????????????????.
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
                    const normalizedData = normalizeFirstStepValue({
                        ...val,
                        settings: {
                            ...(promoCampaign?.settings || {}),
                            ...val.settings,
                        },
                    });
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

    const isChanged: FormProps<PromoCampaignFormInitialState>['onValuesChange'] = (changedFields) => {
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
        <div className={styles.promoCreateContainer}>
            <PromoCampaignSideBar
                active={step}
                validStep={validStep}
                onClick={setStep}
                newPromoCampaign={mode === modes.create}
                hideLastStep={Boolean(copyVisibilitySettings)}
            />
            <div className={styles.wrapper}>
                <Header onClickFunc={(step !== 1 && handleBackClick) || undefined} />
                <div className={cn(styles.containerControl, { [styles.noMargin]: step === steps.visibility })}>
                    <p className={styles.headerTitle}>
                        {isCopy && mode === modes.edit ? `??????????: ${promoCampaign?.name}` : modsTitle[mode as 'create' | 'edit']}
                    </p>
                    <p className={styles.headerSteps}>
                        {STEP} {step} ???? {stepsCount}
                    </p>
                    <Button
                        className={styles.btnMR}
                        onClick={handleCancel}
                    >
                        {BUTTON_TEXT.CANCEL}
                    </Button>
                    <Button
                        type="primary"
                        className={styles.btnMR}
                        onClick={onClick}
                    >
                        {buttonText}
                    </Button>
                    {step < stepsCount && (
                        <Button
                            type="primary"
                            onClick={handleSaveInfo}
                            disabled={saveStatus || loading}
                        >
                            {BUTTON_TEXT.SAVE}
                        </Button>
                    )}
                    {messageError && <div className={styles.error}>{messageError}</div>}
                </div>

                <Form
                    className={cn({ [styles.containerStep]: step !== steps.visibility })}
                    form={form}
                    layout="vertical"
                    onValuesChange={isChanged}
                >
                    {StepContainer}
                </Form>
            </div>
            {loading && (
                <div className={styles.loadingWrapper}>
                    <div className={styles.loading}>
                        <LoadingSpinner />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromoCampaignForm;
