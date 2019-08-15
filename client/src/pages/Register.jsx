import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { A } from 'hookrouter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye as hidingPassword, faEyeSlash as showingPassword  } from '@fortawesome/free-solid-svg-icons';

import { registerUser } from '../redux/actions/session';
import { validateEmail, validateEmptyField, maxCharacters25, maxCharacters50, required } from '../utils/formFieldValidators';
import Logo from '../public/assets/images/inverted-logo.svg';


const Register = props => {
    const [passwordHidden, setPasswordHidden] = useState(true);
    const [confirmPasswordHidden, setConfirmPasswordHidden] = useState(true);

    const renderInput = ({ input, placeholder, type, meta, label }) => { 
        return (
            <div className="field input-field">
                <label>{label}</label>
                <input {...input} type={type} className="form-control" placeholder={placeholder} autoFocus={meta.active ? true : false}/>
                {renderError(meta)}
            </div>
        ) 
    }

    const renderPasswordInput = ({ input, placeholder, type, meta, label, toggleInput }) => {
        return (
            <div className="field input-field">
                <label>{label}</label>
                <div className="flex">
                    <input {...input} type={type} className="form-control" placeholder={placeholder} autoFocus={meta.active ? true : false}/>
                    <FontAwesomeIcon className="pointer" icon={type === "password" ? hidingPassword : showingPassword} onClick={() => toggleInput(type === "password" ? false : true)} size="1x"/>
                </div>
                {renderError(meta)}
            </div>
        ) 
    }

    const renderError = ({ touched, error }) => {
        if(touched && error){
            return (
                <div>
                    {error}
                </div>
            )
        }
    }

    const onSubmit = formValues => {
        props.registerUser(formValues);
    }

    const renderContent = () => {
        if(props.registration.isRegistering){
            return (
                <div className="ui active loader massive"></div>
            )
        }else {
            return (
                <div className="ui container">
                    <div className="form-image-container">
                        <img className="ui fluid image" src={Logo} required />
                    </div>
                    <div id="RegisterForm">
                        <form className="ui form" onSubmit={props.handleSubmit((formValues) => onSubmit(formValues))}>
                            <div className="field">
                                <div className="two fields">
                                    <Field 
                                        name="firstName" 
                                        component={(formProps) => renderInput(formProps)} 
                                        placeholder="Jesse" 
                                        type="text" 
                                        label="First Name"
                                        validate={[validateEmptyField, maxCharacters25, required]}
                                    />
                                    <Field 
                                        name="lastName" 
                                        component={(formProps) => renderInput(formProps)} 
                                        placeholder="Pinkman" 
                                        type="text" 
                                        label="Last Name"
                                        validate={[validateEmptyField, maxCharacters25, required]}
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <div className="two fields">
                                    <Field 
                                        name="email" 
                                        component={(formProps) => renderInput(formProps)} 
                                        placeholder="cpncook@abq.com" 
                                        type="email" 
                                        label="E-mail"
                                        validate={[validateEmptyField, validateEmail, maxCharacters50, required]}
                                    />
                                    <Field 
                                        name="username" 
                                        component={(formProps) => renderInput(formProps)} 
                                        placeholder="cpncook" 
                                        type="text" 
                                        label="Username"
                                        validate={[validateEmptyField, maxCharacters50, required]}
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <div className="two fields">
                                    <Field 
                                        name="password" 
                                        component={(formProps) => renderPasswordInput(formProps)} 
                                        placeholder="Enter password" 
                                        type={passwordHidden ? "password" : "text"} 
                                        label="Password"
                                        validate={[validateEmptyField, required]}
                                        props={{
                                            toggleInput: setPasswordHidden
                                        }}
                                    />
                                    <Field 
                                        name="confirmPassword" 
                                        component={(formProps) => renderPasswordInput(formProps)} 
                                        placeholder="Re-Enter password" 
                                        type={confirmPasswordHidden ? "password" : "text"} 
                                        label="Confirm Password"
                                        validate={[validateEmptyField, required]}
                                        props={{
                                            toggleInput: setConfirmPasswordHidden
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="actions">
                                <button className="ui button">Create Account</button>
                            </div>
                        </form>
                    </div>
                    <div className="footnote">
                        <span>
                            Already have an account?
                            <A href="/login">Click here to login</A>
                        </span>
                    </div>
                </div>
            )
        }
    }

    return (
        <div id="Register">
            {renderContent()}
        </div>
    )
}

const validate = formValues => {
    const errors = {};

    if(!formValues.confirmPassword || formValues.confirmPassword !== formValues.password){
        errors.confirmPassword = "Passwords do not match";
    }

    return errors;
}

const formWrapped = reduxForm({
    form: 'RegisterForm',
    validate
})(Register);

const mapStateToProps = ({ registration }) => {
    return {registration};
}

export default connect(mapStateToProps, { registerUser })(formWrapped);