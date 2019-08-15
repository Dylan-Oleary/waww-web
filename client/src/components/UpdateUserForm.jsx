import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit as editIcon, faCheckCircle as successIcon, faTimesCircle as closeIcon } from '@fortawesome/free-solid-svg-icons';

import CheckboxGroup from '../components/CheckboxGroup';
import { updateUserProfile } from '../redux/actions/user';
import { clientAlertError } from '../redux/actions/alerts';
import { showModal } from '../redux/actions/modal';
import { equalArrays } from '../utils/arrayHelpers';
import { validateEmail, validateEmptyField, maxCharacters25, maxCharacters50 } from '../utils/formFieldValidators';

const UpdateUserForm = ({ updateUserProfile, clientAlertError, initialValues, handleSubmit, currentValues, showModal }) => {
    const token = window.localStorage.getItem("token");
    const [readyToSubmit, setReadyToSubmit] = useState(false);
    
    //State for fields
    const [firstNameDisabled, setFirstNameDisabled] = useState(true);
    const [lastNameDisabled, setLastNameDisabled] = useState(true);
    const [emailDisabled, setEmailDisabled] = useState(true);
    const [genresDisabled, setGenresDisabled] = useState(true);

    useEffect(() => {
        if(Object.keys(currentValues).length !== 0 && currentValues.constructor === Object){
            if(currentValues.firstName !== initialValues.firstName){
                setReadyToSubmit(true);
            } else if(currentValues.lastName !== initialValues.lastName){
                setReadyToSubmit(true);
            } else if(currentValues.email !== initialValues.email){
                setReadyToSubmit(true);
            } else if(!equalArrays(currentValues.genres, initialValues.genres)){
                setReadyToSubmit(true);
            } else {
                setReadyToSubmit(false)
            }
        }
    }, [currentValues])

    useEffect(() => {
        if(!firstNameDisabled){
            setLastNameDisabled(true);
            setEmailDisabled(true);
            setGenresDisabled(true);
        }
    }, [firstNameDisabled]);

    useEffect(() => {
        if(!lastNameDisabled){
            setFirstNameDisabled(true);
            setEmailDisabled(true);
            setGenresDisabled(true);
        }
    }, [lastNameDisabled]);

    useEffect(() => {
        if(!emailDisabled){
            setFirstNameDisabled(true);
            setLastNameDisabled(true);
            setGenresDisabled(true);
        }
    }, [emailDisabled])

    useEffect(() => {
        if(!genresDisabled){
            setFirstNameDisabled(true);
            setLastNameDisabled(true);
            setEmailDisabled(true);
        }
    }, [genresDisabled])

    const renderInput = ({ input, type, meta, disabled, toggleFunc, labelText }) => {
        return (
            <Fragment>
                <label>
                    {labelText}
                    <FontAwesomeIcon id="EditIcon" icon={editIcon} size="2x" onClick={() => toggleFunc(disabled ? false : true)}/>
                </label>
                <div className={`update-input-wrapper`}>
                    <div className="update-input">
                        <input {...input} type={type} className="form-control" disabled={disabled} autoFocus={disabled ? false : true} />
                        { meta.error ? <FontAwesomeIcon id={'CloseCircleIcon'} icon={closeIcon} size="1x" /> : (
                            !disabled && !meta.error ? <FontAwesomeIcon id={'SuccessCircleIcon'} icon={successIcon} size="1x" /> : null
                        )}
                    </div>
                    {meta.error ? <hr className="error"></hr> : <hr className={disabled === true ? "" : "enabled"}></hr> }
                </div>
                {renderError(meta)}
            </Fragment>
        ) 
    }

    const renderError = ({ visited, error }) => {
        if(visited && error){
            return (
                <div>
                    {error}
                </div>
            )
        }
    }

    const onSubmit = formValues => {
        const updatedFields = {};

        if(formValues.firstName !== initialValues.firstName){
            updatedFields.firstName = formValues.firstName;
        }
        if(formValues.lastName !== initialValues.lastName){
            updatedFields.lastName = formValues.lastName;
        }
        if(formValues.email !== initialValues.email){
            updatedFields.email = formValues.email;
        }

        const equalGenres = equalArrays(initialValues.genres, formValues.genres);

        if(!equalGenres){
            updatedFields.genres = formValues.genres;
        }
        
        if(Object.keys(updatedFields).length !== 0 && updatedFields.constructor === Object){
            setFirstNameDisabled(true);
            setEmailDisabled(true);
            setLastNameDisabled(true);
            setGenresDisabled(true);
            updateUserProfile(token, updatedFields);
        } else {
            const alert = {
                alertMessages: ["You haven't updated anything!"],
                alertFor: "updateUserProfile"
            };
            clientAlertError(alert);
        }
    }

    const renderContent = () => {
        return (
            <form className="ui form" onSubmit={handleSubmit(formValues => onSubmit(formValues))} encType="multipart/form-data">
                <div className="field input-field">
                    <Field 
                        name="firstName" 
                        component={formProps => renderInput(formProps)} 
                        type="text" 
                        validate={[validateEmptyField, maxCharacters25]}
                        props={{ 
                            disabled: firstNameDisabled,
                            toggleFunc: setFirstNameDisabled,
                            labelText: "First Name",
                        }}
                    />
                </div>
                <div className="field input-field">
                    <Field 
                        name="lastName" 
                        component={formProps => renderInput(formProps)} 
                        type="text" 
                        validate={[validateEmptyField, maxCharacters25]}
                        props={{ 
                            disabled: lastNameDisabled,
                            toggleFunc: setLastNameDisabled,
                            labelText: "Last Name"
                        }}
                    />
                </div>
                <div className="field input-field">
                    <Field 
                        name="email" 
                        component={formProps => renderInput(formProps)} 
                        type="text" 
                        validate={[validateEmptyField, validateEmail, maxCharacters50]}
                        props={{ 
                            disabled: emailDisabled,
                            toggleFunc: setEmailDisabled,
                            labelText: "Email"
                        }}
                    />
                </div>
                <div className="field group-checkbox">
                    <label>
                        Favourite Genres
                        <FontAwesomeIcon id="EditIcon" icon={editIcon} size="1x" onClick={() => setGenresDisabled(genresDisabled === true ? false : true)}/>
                    </label>
                    <Field 
                        name="genres" 
                        component={CheckboxGroup} 
                        type="checkbox" 
                        props={{
                            disabled: genresDisabled,
                            labelText: "Favourite Genres"
                        }}
                    />
                </div>
                <div className="actions">
                    <button className="ui button submit" type="submit" disabled={readyToSubmit ? false : true}>Update Profile</button>
                    <button className="ui button delete" type="button" onClick={() => showModal("Are you sure?", null, "deleteAccount")}>Delete Account</button>
                </div>
            </form>
        )
    }

    return (
        <div id="UpdateUserForm">
            {renderContent()}
        </div>
    )
}

const formWrapped = reduxForm({
    form: 'UpdateUserForm',
    enableReinitialize: true
})(UpdateUserForm);

const selector = formValueSelector('UpdateUserForm')

const mapStateToProps = (state) => {
    return { 
        initialValues: {
            firstName: state.user.firstName,
            lastName: state.user.lastName,
            email: state.user.email,
            genres: state.user.genres
        },
        currentValues: selector(state, 'firstName', 'lastName', 'email', 'genres')
    };
}

export default connect(mapStateToProps, { updateUserProfile, clientAlertError, showModal })(formWrapped);



