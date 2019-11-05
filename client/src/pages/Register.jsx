import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm} from "redux-form";
import { Link, useHistory } from "react-router-dom";
import { Container, Form, Icon, Image } from "semantic-ui-react";

import { registerUser } from '../redux/actions/session';
import ShowPasswordToggle from "../components/ShowPasswordToggle";
import Logo from '../public/assets/images/inverted-logo.svg';
import { validateEmail, validateEmptyField, maxCharacters25, maxCharacters50, required } from '../utils/formFieldValidators';

const Register = ({ isLoggedIn, isRegistering, registerUser, handleSubmit }) => {
    const [passwordHidden, setPasswordHidden] = useState(true);
    const [confirmPasswordHidden, setConfirmPasswordHidden] = useState(true);
    const history = useHistory();

    useEffect(() => {
        const token = window.localStorage.getItem("token");

        if(token && !isRegistering && isLoggedIn){
            history.push("/");
        }
    }, [isRegistering, isLoggedIn])

    const renderInput = ({ input, placeholder, type, meta, label, onToggle, isHidingPassword }) => {
        const hasError = meta.touched && meta.error ? true : false;

        return (
            <div className="required field">
                {label.toLowerCase().includes("password") ? <ShowPasswordToggle
                    text={label}
                    onToggle={onToggle}
                    isHidingPassword={isHidingPassword}
                /> : <label>{label}</label>}
                <div className={`flex no-wrap align-center ${hasError ? "border-bottom red" : "border-bottom white"}`}>
                    <input {...input} type={type} placeholder={placeholder} autoFocus={meta.active ? true : false}/>
                    {hasError && <Icon className="text red" name="times"/>}
                </div>
                <div className="input-error">
                    {hasError && meta.error}
                </div>
            </div>
        );
    }

    const onSubmit = formValues => {
        registerUser(formValues);
    }

    const renderForm = () => {
        return (
            <Container>
                <Image className="logo main" src={Logo} fluid={true} />
                <h1 className="heading large text white">Register</h1>
                <Form id="RegisterForm" onSubmit={handleSubmit((formValues) => onSubmit(formValues))}>
                    <Form.Group widths="equal">
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
                    </Form.Group>
                    <Form.Group widths="equal">
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
                    </Form.Group>
                    <Form.Group widths="equal">
                        <Field 
                            name="password" 
                            component={(formProps) => renderInput(formProps)} 
                            placeholder="Enter password" 
                            type={passwordHidden ? "password" : "text"} 
                            label="Password"
                            validate={[validateEmptyField, required]}
                            props={{
                                onToggle: setPasswordHidden,
                                isHidingPassword: passwordHidden
                            }}
                        />
                        <Field 
                            name="confirmPassword" 
                            component={(formProps) => renderInput(formProps)} 
                            placeholder="Re-Enter password" 
                            type={confirmPasswordHidden ? "password" : "text"} 
                            label="Confirm Password"
                            validate={[validateEmptyField, required]}
                            props={{
                                onToggle: setConfirmPasswordHidden,
                                isHidingPassword: confirmPasswordHidden
                            }}
                        />
                    </Form.Group>
                    <Form.Group>
                        <div className="flex center my small">
                            <button className="btn center main" type="submit">Create Account</button>
                        </div>
                    </Form.Group>
                </Form>
                <Container>
                    <div className="flex center my small footnote">
                        <span>Already have an account?</span>
                        <Link to="/login">Click here to login</Link>
                    </div>
                </Container>
            </Container>
        );
    }

    return (
        <div id="Register">
            {isRegistering ? <div className="ui active loader massive"></div> : renderForm()}
        </div>
    );
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

const mapStateToProps = ({ login, registration }) => {
    return {
        isRegistering: registration.isRegistering,
        isLoggedIn: login.isLoggedIn
    };
}

export default connect(mapStateToProps, { registerUser })(formWrapped);