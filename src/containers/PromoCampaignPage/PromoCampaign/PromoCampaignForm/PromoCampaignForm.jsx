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
} from './PromoCampaignFormUtils';
import { getUnissuedPromoCodeStatistics } from '../../../../api/services/promoCodeService';
import { editPromoCampaign, newPromoCampaign } from '../../../../api/services/promoCampaignService';
import { getAppCode } from '../../../../api/services/sessionService';

import { ReactComponent as LoadingSpinner } from '../../../../static/images/loading-spinner.svg';

import styles from './PromoCampaignForm.module.css';

const PromoCampaignForm = ({ mode = modes.create, matchUrl }) => {
    const history = useHistory();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [validStep, setValidStep] = useState(1);
    const [messageError, setMessageError] = useState('');
    const { state: stateFromLocation } = useLocation();
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
            const { promoCampaign } = stateFromLocation || {};
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
            setValidStep(steps.visibility);
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

    const editPromoCampaignHandler = useCallback(async () => {
        const { promoCampaign } = stateFromLocation || {};
        const dataForSend = getDataForSend(state);
        setLoading(true);

        try {
            const textEditPromises = editTextBanners(state.promoCampaignTexts, promoCampaign, state.appCode);

            await Promise.all(textEditPromises);
            await EditImgBanners(state.promoCampaignBanners, promoCampaign, changedImgs.current, state.appCode);
            await editPromoCampaign({ ...dataForSend, id: promoCampaign.id });

            history.push(matchUrl);
        } catch (error) {
            setMessageError(error.message);
            setLoading(false);
        }
    }, [state, stateFromLocation, history, matchUrl, changedImgs]);

    const handleOk = useCallback(async () => {
        const { promoCampaign : { id: promoCampaignId } } = stateFromLocation || {};

        await getUnissuedPromoCodeStatistics(promoCampaignId, state.promoCodeType);
        await editPromoCampaignHandler();
    }, [editPromoCampaignHandler, state.promoCodeType, stateFromLocation]);

    const handleEdit = useCallback(async () => {
        const { promoCampaign : { promoCodeType: oldValue } } = stateFromLocation || {};
        const newValue = state.promoCodeType;

        if (oldValue !== newValue) {
            const changingValue =`${oldValue}_TO_${newValue}`;
            callConfirmModalForPromoCodeTypeChanging(handleOk, changingValue);
        } else {
            editPromoCampaignHandler();
        }
    }, [editPromoCampaignHandler, state.promoCodeType, stateFromLocation, handleOk]);

    const handleSave = useCallback(async () => {
        const { visibilitySettings } = state;

        if (!visibilitySettings[0].salePoint) {
            const [setting] = visibilitySettings;
            const nextState = { ...state };
            nextState.visibilitySettings[0] = {
                ...setting,
                errors: { salePoint: 'Укажите точку продажи' },
            };

            return setState(nextState);
        }

        setLoading(true);

        try {
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
    }, [history, state, matchUrl]);

    const handleNextStep = useCallback((val) => {
            setState(prevState => ({ ...prevState, ...val }));
            step < allStep && setStep(step + 1);
        }, [step]);

    const handleCancel = useCallback(() => history.push(matchUrl), [history, matchUrl]);
    const handleBackClick = useCallback(() => setStep((prev) => prev - 1), []);

    const validStepChange = useCallback((step, finish = true) => {
        if (validStep !== step && !(step < validStep && finish)) {
            setValidStep(step);
        }
    }, [validStep, setValidStep]);

    const addChangedImg = useCallback((imgName) => {
        if (imgName && !changedImgs.current.includes(imgName)) {
            changedImgs.current.push(imgName);
        }
    }, [changedImgs]);

    const changeTypePromo = useCallback(() => setState((prev) => ({
        ...prev,
        promoCampaignTexts: {},
        promoCampaignBanners: {},
    })), []);

    const StepContainer = useMemo(() => {
        switch (step) {
            case 1:
                return <StepInfo
                            state={ state }
                            validStepChange={ validStepChange }
                            handlerNextStep={ handleNextStep }
                            changeTypePromo={ changeTypePromo }
                        />;
            case 2:
                return <StepTextAndImage
                            texts={ state.promoCampaignTexts }
                            banners={ state.promoCampaignBanners }
                            typePromoCampaign={ state.typePromoCampaign }
                            validStepChange={ validStepChange }
                            handlerNextStep={ handleNextStep }
                            addChangedImg = { addChangedImg }
                        />;
            case 3:
                return <StepVisibility
                            visibilitySettings={ state.visibilitySettings }
                            onChangeState={ onChangeState }
                            onDeleteState={ onDeleteState }
                            viewMode={ mode === modes.edit }
                        />;
            default:
                return null;
        }
    }, [step, state, onChangeState, handleNextStep, onDeleteState, changeTypePromo, validStepChange, mode, addChangedImg]);

    return (
        <div className={ styles.promoCreateContainer }>
            <PromoCampaignSideBar
                active={ step }
                validStep={ validStep }
                onClick={ setStep }
                newPromoCampaign={ mode === modes.create }
            />
            <div className={ styles.wrapper }>
                <Header onClickFunc={ step !== 1 && handleBackClick } />
                <div className={ styles.containerControl }>
                    <p className={ styles.headerTitle }>{ modsTitle[mode] }</p>
                    <p className={ styles.headerSteps }>{ STEP } { step } из { allStep }</p>
                    <Button
                        onClick={ handleCancel }
                        className={ cn(styles.btnMR, styles.btnCancel) }
                    >
                        { CANCEL }
                    </Button>
                    {step < allStep ? (
                        <Button
                            type="primary"
                            htmlType="submit"
                            form="info"
                        >
                            { NEXT }
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            onClick={ mode === modes.create ? handleSave : handleEdit }
                        >
                            { COMPLETE }
                        </Button>
                    )}
                    <div className={ styles.error }>{ messageError }</div>
                </div>
                { loading ? <LoadingSpinner /> : StepContainer }
            </div>
        </div>
    );
};

export default PromoCampaignForm;
