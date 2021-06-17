import React, { ChangeEvent, FocusEvent, MouseEvent } from 'react';
import Input from '@components/Input';
import Button from '@components/Button';
import PropTypes from 'prop-types';
import * as formHelper from './formHelper';
import { FormFields } from './forms';

export type FormProps = {
    data: FormFields;
    buttonText?: string;
    buttonClassName?: string;
    formClassName: string;
    fieldClassName: string;
    activeLabelClassName: string;
    errorText: string;
    errorClassName: string;
    formError?: boolean;
    iconClassName?: string;
    onSubmit?: (data: Record<string, string>) => void;
};

class Form<T extends FormProps> extends React.PureComponent<T, formHelper.FormState> {
    state = formHelper.generateFormState(this.props.data);

    updateField = (e: ChangeEvent<HTMLInputElement>) => {
        const { data } = this.props;
        const { name, value } = e.target;
        const { validators, maxLength } = data[name];

        if (value.length > maxLength) {
            return;
        }

        const state = this.state;
        const { errorCount } = state;
        const { valid } = (state[name] as formHelper.FieldState);

        const newValid = formHelper.getValid(value, validators);
        const newErrorCount = formHelper.getErrorCounts(valid, errorCount as number, 'newValid', newValid);

        this.setState({
            [name]: { value, valid: newValid },
            errorCount: newErrorCount
        });
    };

    onClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const { errorCount } = this.state;
        const { onSubmit } = this.props;

        if (typeof errorCount === 'number' && errorCount > 0) {
            return;
        }
        onSubmit && onSubmit(formHelper.getValues(this.state));
    };

    onClear = (name: string) => () => {
        const { value, valid } = (this.state[name] as formHelper.FieldState);
        if (value === '') {
            return;
        }
        const { errorCount } = this.state;
        const { isRequired } = this.props.data[name];
        this.setState({
            [name]: { value: '', valid: isRequired === false },
            errorCount: formHelper.getErrorCounts(valid, errorCount as number, 'isRequired', isRequired)
        });
    };

    onFocus = (e: FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        this.setState({ active: name });
    };

    onBlur = () => {
        this.setState({ active: null });
    };

    render() {
        const state = this.state;
        const {
            data,
            formClassName,
            fieldClassName,
            activeLabelClassName,
            buttonText,
            buttonClassName,
            formError,
            errorText,
            errorClassName,
            iconClassName
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
                            placeholder={item.placeholder}
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
                <Button
                    label={(buttonText as string)}
                    className={buttonClassName}
                    type="green"
                    font="roboto"
                    disabled={state.errorCount !== 0}
                    onClick={this.onClick}
                />
            </form>
        );
    }
}

(Form as any).propTypes = {
    data: PropTypes.object.isRequired,
    formClassName: PropTypes.string,
    fieldClassName: PropTypes.string,
    activeLabelClassName: PropTypes.string,
    buttonText: PropTypes.string.isRequired,
    buttonClassName: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    formError: PropTypes.bool,
    errorText: PropTypes.string,
    errorClassName: PropTypes.string,
    iconClassName: PropTypes.string,
    placeholder: PropTypes.string
};

export default Form;
