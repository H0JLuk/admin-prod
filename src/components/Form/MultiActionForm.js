import React from 'react';
import Form from './Form';
import Input from '../Input/Input';
import Button from '../Button/Button';
import PropTypes from 'prop-types';
import * as formHelper from './formHelper';

class MultiActionForm extends Form {
    state = formHelper.generateFormState(this.props.data);

    onClick = (handler, callback) => e => {
        e.preventDefault();
        this.state.errorCount <= 0 && handler(callback, formHelper.getValues(this.state));
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
            loading
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
                            iconClassName={ iconClassName }
                        />
                    );
                })}
                { error }
                <div className={ actionsPanelClasses }>
                    {actions.map((action, idx) => {
                        return (
                            <Button
                                key = { idx }
                                label={ action.text }
                                className={ action.buttonClassName }
                                type={ action.color || 'green' }
                                font='roboto'
                                disabled={ state.errorCount !== 0 || loading }
                                onClick={ this.onClick(action.handler, action.callback) }
                            />);
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
    actions: PropTypes.arrayOf(PropTypes.object).isRequired,
    formError: PropTypes.bool,
    errorText: PropTypes.string,
    errorClassName: PropTypes.string,
    iconClassName: PropTypes.string,
    actionsPanelClasses: PropTypes.string
};

export default MultiActionForm;