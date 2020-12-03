import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import debounce from 'lodash/debounce';
import { Form, Input, Button, Switch, AutoComplete } from 'antd';
import { addVisibilitySetting } from '../../../../../api/services/promoCampaignService';
import {
    createSearchDataAndPassLocation,
    getStringOptionValue,
    highlightSearchingText,
    getResultsByTextAndType,
} from './visibilitySettingFormHelper';

import { ReactComponent as Cross } from '../../../../../static/images/cross.svg';
import styles from './PromoCampaignVisibilitySettingForm.module.css';

const FORM_NAME = 'createVisibilityForm';
const LOCATION_FIELD = {
    name: 'location',
    label: 'Локация',
    placeholder: 'Область, город...',
};

const SALE_POINT_FIELD = {
    name: 'salePoint',
    label: 'Точка продажи',
    placeholder: 'Отделение ВСП',
};

const VISIBILITY_FIELD = {
    name: 'visibility',
    label: 'Включить видимость',
};

const CANCEL_BUTTON_TEXT = 'Отменить';
const SUBMIT_BUTTON_TEXT = 'Добавить';

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
};

const buttonLayout = {
    wrapperCol: { offset: 4, span: 12 }
};

const errorLayout = {
    wrapperCol: { offset: 5, span: 12 }
};

const PromoCampaignVisibilitySettingForm = ({ onCancel, onSubmit, match = {} }) => {
    const [state, setState] = useState({
        location: null,
        salePoint: null,
        visibility: true,
        error: '',
        searchLocation: {
            value: '',
            results: [],
        },
        searchSalePoint: {
            value: '',
            results: [],
        },
    });

    const onFinish = useCallback(async () => {
        const { location, salePoint, visibility } = state;

        if (!location && !salePoint) {
            setState({
                ...state,
                error: 'Укажите локацию или точку продажи'
            });
            return;
        }

        try {
            const { promoCampaignId } = match.params || {};

            await addVisibilitySetting({
                locationId: location?.id || undefined,
                promoCampaignId: Number(promoCampaignId),
                salePointId: salePoint?.id || undefined,
                visible: visibility,
            });

            onSubmit({ location, salePoint, visibility });
        } catch (e) {
            // TODO: add handler for error
            console.error(e);
        }
    }, [onSubmit, state, match.params]);

    const onVisibilityChange = useCallback((visibility) => {
        setState(state => ({ ...state, visibility }));
    }, []);

    /**
     * @param {string} searchValue
     * @param {'searchLocation' | 'searchSalePoint'} typeSearch
     */
    const getSearchResults = useCallback(async (searchValue, typeSearch = 'searchLocation') => {
        try {
            const searchResult = await getResultsByTextAndType(searchValue, typeSearch, state.location?.id);
            setState(state => ({
                ...state,
                [typeSearch]: {
                    ...state[typeSearch],
                    results: searchResult,
                }
            }));
        } catch (e) {
            console.error(e);
        }
    }, [state.location]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getResultsDebounced = useCallback(debounce(getSearchResults, 500), [getSearchResults]);

    /**
     * @param {string} searchValue
     * @param {'searchLocation' | 'searchSalePoint'} typeSearch
     */
    const search = useCallback((searchValue, typeSearch = 'searchLocation') => {
        if (typeSearch !== 'searchLocation' && typeSearch !== 'searchSalePoint') {
            throw Error('Incorrect `typeSearch` param');
        }

        setState(state => ({
            ...state,
            [typeSearch]: {
                ...state[typeSearch],
                value: searchValue,
            },
        }));

        if (!searchValue || (searchValue.length < 2 && typeSearch === 'searchLocation')) {
            setState(state => ({
                ...state,
                [typeSearch]: {
                    value: searchValue,
                    results: [],
                }
            }));
            return;
        }

        getResultsDebounced(searchValue, typeSearch);
    }, [getResultsDebounced]);

    const handleSearchSalePoint = useCallback((searchValue) => {
        if (!searchValue) {
            setState(state => ({
                ...state,
                salePoint: null,
            }));
        }

        search(searchValue, 'searchSalePoint');
    }, [search]);

    const handleSearchLocation = useCallback((searchValue) => {
        if (!searchValue) {
            setState(state => ({
                ...state,
                location: null,
            }));
        }

        search(searchValue, 'searchLocation');
    }, [search]);

    const handleSelectLocationOption = useCallback((locationValue, location) => {
        const { data } = location;

        setState(state => ({
            ...state,
            location: data,
            searchLocation: { ...state.searchLocation, value: locationValue },
            error: '',
        }));
    }, []);

    const handleSelectSalePointOption = useCallback((value, { data: salePoint, data: { location } }) => setState(state => ({
        ...state,
        salePoint,
        searchSalePoint: { ...state.searchSalePoint, value },
        error: '',
        ...createSearchDataAndPassLocation(location, !!state.location),
    })), []);

    /**
     * @param {'searchLocation' | 'searchSalePoint'} type
     */
    const renderOptionLabel = (option, type) => (
        <div key={ option.id } className={ styles.autocompleteOption }>
            <div className={ styles.optionParentName }>
                { highlightSearchingText(option.parentName, state[type]?.value) }
            </div>
            <div className={ styles.optionName }>
                { highlightSearchingText(option.name, state[type]?.value) }
            </div>
        </div>
    );

    const { visibility, error, searchLocation, searchSalePoint } = state;
    const locationOptions = searchLocation.results.map((el) => ({
        label: renderOptionLabel(el, 'searchLocation'),
        value: getStringOptionValue(el),
        data: el,
    }));
    const salePointOptions = searchSalePoint.results.map((el) => ({
        label: renderOptionLabel(el, 'searchSalePoint'),
        value: el.name,
        data: el,
    }));

    return (
        <div className={ styles.formContainer }>
            <Form
                { ...layout }
                className={ cn(styles.form, { [styles.hasError]: !!error }) } // TODO: change error handler for each fields
                name={ FORM_NAME }
                onFinish={ onFinish }
                requiredMark={ false }
            >
                <div className={ styles.formRow }>
                    <div className={ cn(styles.formLeftCol, `ant-col ant-col-${layout.labelCol.span}`) }>
                        <label htmlFor="rc_select_0">
                            { LOCATION_FIELD.label }
                        </label>
                    </div>
                    <div className={ cn(`ant-col ant-col-${layout.wrapperCol.span}`) }>
                        <AutoComplete
                            className={ styles.autocompleteInput }
                            dropdownClassName={ styles.autocompleteDropdown }
                            dropdownMatchSelectWidth={ false }
                            options={ locationOptions }
                            filterOption={ false }
                            notFoundContent={ null }
                            allowClear
                            autoFocus
                            onSearch={ handleSearchLocation }
                            onSelect={ handleSelectLocationOption }
                            value={ searchLocation.value }
                            clearIcon={ <Cross /> }
                        >
                            <Input
                                placeholder={ LOCATION_FIELD.placeholder }
                                name={ LOCATION_FIELD.name }
                                size="large"
                            />
                        </AutoComplete>
                    </div>
                </div>
                <div className={ styles.formRow }>
                    <div className={ cn(styles.formLeftCol, `ant-col ant-col-${layout.labelCol.span}`) }>
                        <label htmlFor="rc_select_1">
                            { SALE_POINT_FIELD.label }
                        </label>
                    </div>
                    <div className={ cn(`ant-col ant-col-${layout.wrapperCol.span}`) }>
                        <AutoComplete
                            className={ styles.autocompleteInput }
                            dropdownClassName={ styles.autocompleteDropdown }
                            dropdownMatchSelectWidth={ false }
                            options={ salePointOptions }
                            filterOption={ false }
                            notFoundContent={ null }
                            allowClear
                            onSearch={ handleSearchSalePoint }
                            onSelect={ handleSelectSalePointOption }
                            value={ searchSalePoint.value }
                            clearIcon={ <Cross /> }
                        >
                            <Input
                                placeholder={ SALE_POINT_FIELD.placeholder }
                                name={ SALE_POINT_FIELD.name }
                                size="large"
                            />
                        </AutoComplete>
                    </div>
                </div>
                <Form.Item
                    labelAlign="left"
                    label={ VISIBILITY_FIELD.label }
                    name={ VISIBILITY_FIELD.name }
                >
                    <Switch
                        className={ cn({ [styles.switch]: visibility }) }
                        checked={ visibility }
                        onChange={ onVisibilityChange }
                    />
                </Form.Item>
                {!!error && (
                    <Form.Item { ...errorLayout }>
                        <div className={ styles.formError }>
                            { error }
                        </div>
                    </Form.Item>
                )}
                <Form.Item { ...buttonLayout }>
                    <Button
                        className={ styles.cancelButton }
                        type="primary"
                        shape="round"
                        htmlType="button"
                        size="large"
                        onClick={ onCancel }
                    >
                        { CANCEL_BUTTON_TEXT }
                    </Button>
                    <Button
                        className={ styles.submitButton }
                        type="primary"
                        shape="round"
                        htmlType="submit"
                        size="large"
                    >
                        { SUBMIT_BUTTON_TEXT }
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

PromoCampaignVisibilitySettingForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

PromoCampaignVisibilitySettingForm.defaultProps = {
    onSubmit: () => {},
    onCancel: () => {},
};

export default PromoCampaignVisibilitySettingForm;
