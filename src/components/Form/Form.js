import React from 'react';
import Input from '../Input/Input';
import Button from '../Button/Button';
import PropTypes from 'prop-types';
import * as formHelper from './formHelper';

class Form extends React.PureComponent {
    state = formHelper.generateFormState(this.props.data);

    updateField = (e) => {
        const { data } = this.props;
        let { name, value } = e.target;
        const { validators, maxLength } = data[name];

        if (value.length > maxLength) {
            return;
        }

        const state = this.state;
        const { errorCount } = state;
        const { valid } = state[name];

        const newValid = formHelper.getValid(value, validators);
        const newErrorCount = formHelper.getErrorCounts(valid, errorCount, 'newValid', newValid);

        this.setState({
            [name]: { value, valid: newValid },
            errorCount: newErrorCount
        });
    };

    onClick = (e) => {
        e.preventDefault();
        const { errorCount } = this.state;
        const { onSubmit, sent } = this.props;

        if (errorCount > 0) {
            return;
        }
        onSubmit(formHelper.getValues(this.state));
    };

    onClear = (name) => () => {
        const { value, valid } = this.state[name];
        if (value === '') {
            return;
        }
        let { errorCount } = this.state;
        const { isRequired } = this.props.data[name];
        this.setState({
            [name]: { value: '', valid: isRequired === false, origValue: value },
            errorCount: formHelper.getErrorCounts(valid, errorCount, 'isRequired', isRequired)
        })
    };

    onFocus = (e) => {
        const { name } = e.target;
        this.setState({ active: name });
    };

    onBlur = (e) => {
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
                            value={state[key].value}
                            valid={state[key].valid}
                            active={state.active === key}
                            formError={formError}
                            multiline={item.multiline}
                            onChange={this.updateField}
                            onClick={this.onClear}
                            onFocus={this.onFocus}
                            onBlur={this.onBlur}
                            fieldClassName={fieldClassName}
                            activeLabelClassName={activeLabelClassName}
                            iconClassName={iconClassName}/>
                    );
                })}
                {error}
                <Button
                    label={buttonText}
                    className={buttonClassName}
                    type='green'
                    font='roboto'
                    disabled={state.errorCount !== 0}
                    onClick={this.onClick}/>
            </form>
        )
    }
}

Form.propTypes = {
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
    iconClassName: PropTypes.string
};

export default Form;