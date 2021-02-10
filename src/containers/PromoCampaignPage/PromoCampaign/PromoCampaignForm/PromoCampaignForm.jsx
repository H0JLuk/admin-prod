import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import moment from 'moment';
import { useHistory, useLocation } from 'react-router-dom';
import { Button } from 'antd';
import StepInfo from './PromoCampaignSteps/StepInfo/StepInfo';
import StepVisibility from './PromoCampaignSteps/StepVisibility/StepVisibility';
import StepTextAndImage from './PromoCampaignSteps/StepTextAndImage/StepTextAndImage';
import PromoCampaignSideBar from '../PromoCampaignSideBar/PromoCampaignSideBar';
import callConfirmModalForPromoCodeTypeChanging from './PromoCampaignSteps/ConfirmModalForPromoCodeTypeChanging/ConfirmModalForPromoCodeTypeChanging';
import Header from '../../../../components/Header/Header';
import { allStep, CANCEL, COMPLETE, modes, modsTitle, NEXT, STEP, steps } from './PromoCampaignFormConstants';
import {
    arrayToObject,
    createImgBanners,
    createTexts,
    createVisibilities,
    EditImgBanners,
    editTextBanners,
    getDataForSend,
    getPromoCampaignForCopy,
} from './PromoCampaignFormUtils';
import { getUnissuedPromoCodeStatistics } from '../../../../api/services/promoCodeService';
import { editPromoCampaign, newPromoCampaign, copyPromoCampaign } from '../../../../api/services/promoCampaignService';
import { getAppCode } from '../../../../api/services/sessionService';

import { ReactComponent as LoadingSpinner } from '../../../../static/images/loading-spinner.svg';

import styles from './PromoCampaignForm.module.css';

const PromoCampaignForm = ({ mode = modes.create, matchUrl, isCopy }) => {
    const history = useHistory();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [validStep, setValidStep] = useState(1);
    const [messageError, setMessageError] = useState('');
    const changedImgs  = useRef([]);
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
        visibilitySettings: [{
            location: null,
            salePoint: null,
            visible: false,
            errors: {},
        }],
        promoCampaignTexts: {},
        promoCampaignBanners: {},
        typePromoCampaign: '',
        categoryIdList: [],
        appCode: null,
        settings: {
            priorityOnWebUrl: false,
            alternativeOfferMechanic: false,
        },
    });
    const { state: stateFromLocation } = useLocation();
    const { promoCampaign, copyVisibilitySettings } = stateFromLocation || {};

    const stepsCount = !copyVisibilitySettings ? allStep : allStep - 1;

    const onChangeState = useCallback((type, val, index, input) => {
        setState((prevState) => {
            if (index !== undefined) {
                const newState = { ...prevState };
                const newVal = input !== undefined ? { [input]: val } || val : val;
                newState[type][index] = { ...newState[type][index], ...newVal };
                return newState;
            }
            return { ...prevState, [type]: val };
        });
    }, []);

    useEffect(() => {
        if (mode === modes.edit) {
            if (!promoCampaign) {
                return history.push(matchUrl);
            }

            // TODO: change valid step when exist not all images for promo-campaign
            // setValidStep(() => (Object.keys(promoCampaign.promoCampaignBanners).length < 4 ? 2 : 3));

            (async () => {
                const { promoCampaignBanners = [], promoCampaignTexts = [] } = promoCampaign;

                setState((prev) => ({
                    ...prev,
                    name: promoCampaign.name,
                    webUrl: promoCampaign.webUrl,
                    promoCodeType: promoCampaign.promoCodeType,
                    active: promoCampaign.active,
                    dzoId: promoCampaign.dzoId,
                    typePromoCampaign: promoCampaign.type,
                    categoryIdList: promoCampaign.categoryList.reduce((prev, curr) => (
                        [...prev, curr.categoryId]
                    ), []),
                    promoCampaignBanners: arrayToObject(promoCampaignBanners, 'type', 'url'),
                    promoCampaignTexts: arrayToObject(promoCampaignTexts, 'type', 'value'),
                    datePicker: [
                        promoCampaign.startDate ? moment(promoCampaign.startDate) : undefined,
                        promoCampaign.finishDate ? moment(promoCampaign.finishDate) : undefined,
                    ],
                    appCode: getAppCode(),
                    settings: promoCampaign.settings,
                }));
                setLoading(false);
            })();

            if (!isCopy) {
                setValidStep(steps.visibility);
            }
        } else {
            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onDeleteState = useCallback((type, index) => {
        setState(prevState => {
            if (index !== undefined) {
                const newState = { ...prevState };
                if (newState[type].indexOf(newState[type][index]) !== -1) {
                    newState[type].splice(newState[type].indexOf(newState[type][index]), 1);
                }
                return newState;
            }
            return { ...prevState };
        });
    }, []);

    const validateVisibilitySettings = useCallback(() => {
        const { visibilitySettings } = state;

        if (!visibilitySettings[0].salePoint) {
            const [setting] = visibilitySettings;
            const nextState = { ...state };
            nextState.visibilitySettings[0] = {
                ...setting,
                errors: { salePoint: 'Укажите точку продажи' },
            };

            setState(nextState);
            return false;
        }

        return true;
    }, [state]);

    const editPromoCampaignHandler = useCallback(async (newValue = {}) => {
        const currentData = { ...state, ...newValue };
        const dataForSend = getDataForSend(currentData);

        if (isCopy && !copyVisibilitySettings && !validateVisibilitySettings()) {
            return;
        }

        setLoading(true);

        try {
            let oldPromoCampaignData = promoCampaign;

            if (isCopy) {

                const dataForCopy = getPromoCampaignForCopy({ ...promoCampaign, ...currentData }, copyVisibilitySettings);
                oldPromoCampaignData = await copyPromoCampaign(promoCampaign.id, dataForCopy);

                if (!copyVisibilitySettings) {
                    const { visibilitySettings } = currentData;
                    const visibilityPromises = createVisibilities(visibilitySettings, oldPromoCampaignData.id, state.appCode);
                    await Promise.all(visibilityPromises);
                }
            }

            const textEditPromises = editTextBanners(currentData.promoCampaignTexts, oldPromoCampaignData, currentData.appCode);

            await Promise.all(textEditPromises);
            await EditImgBanners(currentData.promoCampaignBanners, oldPromoCampaignData, changedImgs.current, currentData.appCode);

            if (!isCopy) {
                await editPromoCampaign({ ...dataForSend, id: promoCampaign.id });
            }

            history.push(matchUrl);
        } catch (error) {
            setMessageError(error.message);
            setLoading(false);
        }
    }, [state, promoCampaign, history, matchUrl, changedImgs, isCopy, copyVisibilitySettings, validateVisibilitySettings]);

    const handleOk = async () => {
        await getUnissuedPromoCodeStatistics(promoCampaign.id, state.promoCodeType);
        await editPromoCampaignHandler();
    };

    const handleEdit = async () => {
        const oldValue = promoCampaign.promoCodeType;
        const newValue = state.promoCodeType;

        if (oldValue !== newValue && !isCopy) {
            const changingValue =`${oldValue}_TO_${newValue}`;
            callConfirmModalForPromoCodeTypeChanging(handleOk, changingValue);
        } else {
            editPromoCampaignHandler();
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
            const textPromises = createTexts(state.promoCampaignTexts, id, state.appCode);
            const visibilityPromises = createVisibilities(visibilitySettings, id, state.appCode);

            await Promise.all(textPromises);
            await createImgBanners(state.promoCampaignBanners, id, state.appCode);
            await Promise.all(visibilityPromises);

            history.push(matchUrl);
        } catch (error) {
            setMessageError(error.message);
            setLoading(false);
        }
    };

    const handleNextStep = useCallback((val, sendRequest) => {
        setState(prevState => ({ ...prevState, ...val }));

        if (sendRequest && copyVisibilitySettings) {
            editPromoCampaignHandler(val);
        } else {
            step < stepsCount && setStep(step + 1);
        }
    }, [step, stepsCount, editPromoCampaignHandler, copyVisibilitySettings]);

    const handleCancel = () => history.push(matchUrl);
    const handleBackClick = useCallback(() => setStep((prev) => prev - 1), []);

    const validStepChange = useCallback((step, finish = true) => {
        if (validStep !== step && !(step < validStep && finish)) {
            setValidStep(step);
        }
    }, [validStep]);

    const addChangedImg = useCallback((imgName) => {
        if (imgName && !changedImgs.current.includes(imgName)) {
            changedImgs.current.push(imgName);
        }
    }, []);

    const changeTypePromo = useCallback(() => setState((prev) => ({
        ...prev,
        promoCampaignTexts: {},
        promoCampaignBanners: {},
    })), []);

    // TODO: need refactoring for StepContainer
    const StepContainer = useMemo(() => {
        switch (step) {
            case 1:
                return <StepInfo
                            state={ state }
                            validStepChange={ validStepChange }
                            handlerNextStep={ handleNextStep }
                            changeTypePromo={ changeTypePromo }
                            isCopy={ isCopy }
                            oldName={ promoCampaign?.name }
                        />;
            case 2:
                return <StepTextAndImage
                            texts={ state.promoCampaignTexts }
                            banners={ state.promoCampaignBanners }
                            typePromoCampaign={ state.typePromoCampaign }
                            validStepChange={ validStepChange }
                            handlerNextStep={ handleNextStep }
                            addChangedImg = { addChangedImg }
                            isCopy={ isCopy }
                        />;
            case 3:
                return <StepVisibility
                            visibilitySettings={ state.visibilitySettings }
                            onChangeState={ onChangeState }
                            onDeleteState={ onDeleteState }
                            viewMode={ mode === modes.edit }
                            isCopy={ isCopy }
                            copyVisibilitySettings={ copyVisibilitySettings }
                        />;
            default:
                return null;
        }
    }, [
        step,
        state,
        onChangeState,
        handleNextStep,
        onDeleteState,
        changeTypePromo,
        validStepChange,
        mode,
        addChangedImg,
        isCopy,
        copyVisibilitySettings,
        promoCampaign?.name,
    ]);

    const nextButton = (
        <Button
            type="primary"
            htmlType="submit"
            form="info"
        >
            { NEXT }
        </Button>
    );

    const doneButton = isCopy && copyVisibilitySettings ? (
        <Button
            type="primary"
            htmlType="submit"
            form="info"
        >
            { COMPLETE }
        </Button>
    ) : (
        <Button
            type="primary"
            onClick={ mode === modes.create ? handleSave : handleEdit }
        >
            { COMPLETE }
        </Button>
    );

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
                <div className={ styles.containerControl }>
                    <p className={ styles.headerTitle }>
                        { isCopy && mode === modes.edit
                            ? `Копия: ${promoCampaign?.name}`
                            : modsTitle[mode]
                        }
                    </p>
                    <p className={ styles.headerSteps }>{ STEP } { step } из { stepsCount }</p>
                    <Button
                        onClick={ handleCancel }
                        className={ cn(styles.btnMR, styles.btnCancel) }
                    >
                        { CANCEL }
                    </Button>
                    { step < stepsCount ? nextButton : doneButton }
                    <div className={ styles.error }>{ messageError }</div>
                </div>
                { loading ? <LoadingSpinner /> : StepContainer }
            </div>
        </div>
    );
};

export default PromoCampaignForm;

