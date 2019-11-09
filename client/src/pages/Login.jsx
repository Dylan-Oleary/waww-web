import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, useHistory } from "react-router-dom";
import { Field, reduxForm } from 'redux-form';
import { Container, Form, Icon, Image } from "semantic-ui-react";

import { authenticateUser } from '../redux/actions/session';
import { validateEmail, validateEmptyField, maxCharacters50, required } from '../utils/formFieldValidators';
import { setBrowserTitle } from "../utils/browserTitle";

import ShowPasswordToggle from "../components/ShowPasswordToggle";
import Logo from '../public/assets/images/inverted-logo.svg';

const Login = ({ authenticateUser, handleSubmit, isAttemptingLogin, isLoggedIn }) => {
    const [passwordHidden, setPasswordHidden] = useState(true);
    const [confirmPasswordHidden, setConfirmPasswordHidden] = useState(true);
    const history = useHistory();

    useEffect(() => {
        const token = window.localStorage.getItem("token");

        setBrowserTitle("WAWW | Login");

        if(token && isLoggedIn){
            history.push("/");
        }
    }, [isLoggedIn])

    const renderInput = ({
        input,
        placeholder,
        type,
        meta,
        label,
        onToggle,
        isHidingPassword
    }) => {
        const hasError = meta.touched && meta.error ? true : false;

        return (
            <div className="required field">
                {label.toLowerCase().includes("password") ? <ShowPasswordToggle
                    text={label}
                    onToggle={onToggle}
                    isHidingPassword={isHidingPassword}
                    className="shadow"
                /> : <label className="shadow">{label}</label>}
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
        authenticateUser(formValues);
    }

    const renderForm = () => {
        return (
            <Container className="container-max" fluid={true}>
                <Image className="logo main" src={Logo} fluid={true} onClick={() => history.push("/")}/>
                <div className="form-wrapper landing">
                    <h1 className="heading large text white shadow">Login</h1>
                    <Form onSubmit={handleSubmit(formValues => onSubmit(formValues))}>
                        <Form.Group widths="equal">
                            <Field
                                name="email"
                                component={formProps => renderInput(formProps)}
                                placeholder="bettercallsaul@abq.com"
                                type="email"
                                label="E-mail"
                                validate={[validateEmptyField, validateEmail, maxCharacters50, required]}
                            />
                            <Field
                                name="password" 
                                component={formProps => renderInput(formProps)} 
                                placeholder="Enter password" 
                                type={passwordHidden ? "password" : "text"} 
                                label="Password"
                                validate={[validateEmptyField, required]}
                                props={{
                                    onToggle: setPasswordHidden,
                                    isHidingPassword: passwordHidden
                                }}
                            />
                        </Form.Group>
                        <div className="flex center">
                            <button className="btn center main ui button medium" type="submit">Login</button>
                        </div>
                    </Form>
                </div>
                <Container>
                    <div className="flex center my small footnote">
                        <span>
                            Don't have an account?
                            <Link to="/register">Click here to register</Link>
                        </span>
                        <span>
                            or
                            <Link to="/">continue without account</Link>
                        </span>
                    </div>
                </Container>
            </Container>
        );
    };

    return (
        <div id="Login">
            {isAttemptingLogin ? <div className="ui active loader massive"></div> : renderForm()}
        </div>
    );
}

const formWrapped = reduxForm({
    form: 'LoginForm'
})(Login);

const mapStateToProps = ({ login }) => {
    return { 
        isLoggedIn: login.isLoggedIn,
        isAttemptingLogin: login.isAttemptingLogin
    };
}

export default connect(mapStateToProps, { authenticateUser })(formWrapped);  