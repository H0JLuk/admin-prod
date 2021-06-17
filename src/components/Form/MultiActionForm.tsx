import React from 'react';
import Form, { FormProps } from './Form';
import Input from '@components/Input';
import Button, { ButtonProps } from '@components/Button';
import PropTypes from 'prop-types';
import * as formHelper from './formHelper';

type CallbackData = Record<string, string>;
export type ActionCallback = (data: CallbackData) => Promise<void>;

export type ActionHandler = (callback: ActionCallback, data: CallbackData) => Promise<void>;

type MultiActionFormAction = {
    text: string;
    color?: ButtonProps['type'];
    buttonClassName: string;
    handler: ActionHandler;
    callback: ActionCallback;
};

interface MultiActionFormProps extends FormProps {
    actions: MultiActionFormAction[];
    actionsPanelClasses: string;
    loading: boolean;
}

class MultiActionForm extends Form<MultiActionFormProps> {
    state = formHelper.generateFormState(this.props.data);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    onClick = (handler: ActionHandler, callback: MultiActionFormAction['callback']): ButtonProps['onClick'] => (e) => {
        e.preventDefault();
        this.state.errorCount && this.state.errorCount <= 0 && handler(callback, formHelper.getValues(this.state));
    };

    render() {
        const state = this.state;
        const {
            data,
            formClassName,
            fieldClassName,
            activeLabelClassName,
            actions,
            formError,
            errorText,
            errorClassName,
            iconClassName,
            actionsPanelClasses,
            loading,
        } = this.props;

        const error = formError ? <p className={errorClassName}>{errorText}</p> : null;

        return (
            <form className={formClassName}>
                {Object.keys(data).map(key => {
                    const item = data[key];
                    return (
                        <Input
                            key={key}
                            type={item.type}
                            name={key}
                            label={item.label}
                            value={(state[key] as formHelper.FieldState).value}
                            valid={(state[key] as formHelper.FieldState).valid}
                            disabled={item.disabled}
                            active={state.active === key}
                            formError={formError}
                            onChange={this.updateField}
                            onClick={this.onClear}
                            onFocus={this.onFocus}
                            onBlur={this.onBlur}
                            fieldClassName={fieldClassName}
                            activeLabelClassName={activeLabelClassName}
                            iconClassName={iconClassName}
                        />
                    );
                })}
                {error}
                <div className={actionsPanelClasses}>
                    {actions.map((action, idx) => (
                        <Button
                            key={idx}
                            label={action.text}
                            className={action.buttonClassName}
                            type={action.color || 'green'}
                            font="roboto"
                            disabled={state.errorCount !== 0 || loading}
                            onClick={this.onClick(action.handler, action.callback)}
                        />))}
                </div>
            </form>
        );
    }
}

(MultiActionForm as any).propTypes = {
    data: PropTypes.object.isRequired,
    formClassName: PropTypes.string,
    fieldClassName: PropTypes.string,
    activeLabelClassName: PropTypes.string,
    actions: PropTypes.arrayOf(PropTypes.object).isRequired,
    formError: PropTypes.bool,
    errorText: PropTypes.string,
    errorClassName: PropTypes.string,
    iconClassName: PropTypes.string,
    actionsPanelClasses: PropTypes.string
};

export default MultiActionForm;
