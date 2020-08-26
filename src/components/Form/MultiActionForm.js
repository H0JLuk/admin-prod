import React from 'react';
import Form from "./Form";
import Input from '../Input/Input';
import Button from '../Button/Button';
import PropTypes from 'prop-types';
import * as formHelper from './formHelper';

class MultiActionForm extends Form {
    state = formHelper.generateFormState(this.props.data);


    onClick = (e) => {
        e.preventDefault();
        const { errorCount } = this.state;
        const { onSubmit } = this.props;
        const { buttonText } = this.props;
        if (errorCount > 0) {
            return;
        }
        onSubmit[buttonText.indexOf(e.target.textContent)](formHelper.getValues(this.state));
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

        const error = formError ? <p className={ errorClassName }>{ errorText }</p> : null;

        return (
            <form className={ formClassName }>
                { Object.keys(data).map(key => {
                    const item = data[key];
                    return (
                        <Input
                            key={ key }
                            type={ item.type }
                            name={ key }
                            label={ item.label }
                            value={ state[key].value }
                            valid={ state[key].valid }
                            disabled={ item.disabled }
                            active={ state.active === key }
                            formError={ formError }
                            multiline={ item.multiline }
                            onChange={ this.updateField }
                            onClick={ this.onClear }
                            onFocus={ this.onFocus }
                            onBlur={ this.onBlur }
                            fieldClassName={ fieldClassName }
                            activeLabelClassName={ activeLabelClassName }
                            iconClassName={ iconClassName } />
                    );
                })}
                { error }
                <div>
                    {buttonText.map((txt, idx) => {
                        return (<Button key = { idx }
                                        label={ txt }
                                        className={ buttonClassName }
                                        type='green'
                                        font='roboto'
                                        disabled={ state.errorCount !== 0 }
                                        onClick={ this.onClick } />);
                    })}
                </div>
            </form>
        );
    }
}

MultiActionForm.propTypes = {
    data: PropTypes.object.isRequired,
    formClassName: PropTypes.string,
    fieldClassName: PropTypes.string,
    activeLabelClassName: PropTypes.string,
    buttonText: PropTypes.arrayOf(PropTypes.string).isRequired,
    buttonClassName: PropTypes.string,
    onSubmit: PropTypes.arrayOf(PropTypes.func).isRequired,
    formError: PropTypes.bool,
    errorText: PropTypes.string,
    errorClassName: PropTypes.string,
    iconClassName: PropTypes.string
};

export default MultiActionForm;