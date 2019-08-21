import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { A, navigate } from 'hookrouter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye as hidingPassword, faEyeSlash as showingPassword  } from '@fortawesome/free-solid-svg-icons';

import { userLogin } from '../redux/actions/session';
import { validateEmail, validateEmptyField, maxCharacters25, maxCharacters50, required } from '../utils/formFieldValidators';
import Logo from '../public/assets/images/inverted-logo.svg';

const Login = props => {
    const [passwordHidden, setPasswordHidden] = useState(true);
    const token = window.localStorage.getItem("token");

    useEffect(() => {
        if(token){
            navigate('/');
        }
    }, [])

    const renderInput = ({ input, placeholder, type, meta, label  }) => {
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
        props.userLogin(formValues);
    }

    const renderContent = () => {
        if(props.login.isLoggingIn){
            return (
                <div className="ui active loader massive"></div>
            )
        } else {
            return(
                <div className="ui container">
                    <div className="form-image-container">
                        <img className="ui fluid image" src={Logo} />
                    </div>
                    <div id="LoginForm">
                        <form className="ui form" onSubmit={props.handleSubmit((formValues) => onSubmit(formValues))}>
                            <h2>Log In!</h2>
                            <div className="field">
                                <Field 
                                    name="email" 
                                    component={(formProps) => renderInput(formProps)} 
                                    placeholder="bettercallsaul@abq.com"
                                    type="email"
                                    label="E-mail"
                                    validate={[validateEmptyField, validateEmail, maxCharacters50, required]}
                                />
                            </div>
                            <div className="field">
                                <Field 
                                    name="password"
                                    component={(formProps) => renderPasswordInput(formProps)} 
                                    placeholder="Enter your password"
                                    type={passwordHidden ? "password" : "text"}
                                    label="Password"
                                    validate={[validateEmptyField, required]}
                                    props={{
                                        toggleInput: setPasswordHidden
                                    }}
                                />
                            </div>
                            <div className="actions">
                                <button className="ui button">Log In</button>
                            </div>
                        </form>
                        <div className="footnote">
                            <span>
                                Don't have an account?
                                <A href="/register">Click here to register</A>
                            </span>
                            <span>
                                or
                                <A href="/">continue without account</A>
                            </span>
                        </div>
                    </div>
                </div>
            )
        }
    }

    return (
        <div id="Login">
            {renderContent()}
        </div>
    )
}

const formWrapped = reduxForm({
    form: 'LoginForm'
})(Login);

const mapStateToProps = ({ login }) => {
    return { login };
}

export default connect(mapStateToProps, { userLogin })(formWrapped);  