import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";

import { validateEmptyField, maxCharacters50, required } from '../utils/formFieldValidators';
import { addReviewToMovie } from "../redux/actions/movies";

const ReviewForm = ({ handleSubmit, initialValues, isAuthenticated, user, movieID, addReviewToMovie }) => {
    const renderInput = ({ input, placeholder, type, meta, label }) => {
        return (
            <div className="field input-field">
                <label>{label}</label>
                <input {...input} type={type} className="form-control" placeholder={placeholder} />
                {renderError(meta)}
            </div>

        )
    };

    const renderSelect = ({ input, label }) => {
        let score = [];

        for(let i = 0; i <= 100; i++){
            score.push(i);        
        }

        return (
            <div className="field input-field">
                <label>{label}</label>
                <select {...input}>
                    {score.map(score => <option value={score}>{score}</option>)}
                </select>
            </div>
        )
    };

    const onSubmit = formValues => {
        if(isAuthenticated && user && movieID){
            const token = window.localStorage.getItem("token");

            addReviewToMovie(token, formValues, user, movieID);
        }
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

    return (
        <div id="ReviewForm">
            <form className="ui form" onSubmit={handleSubmit(formValues => onSubmit(formValues))}>
                <div className="field">
                    <Field 
                        name="title"
                        component={formProps => renderInput(formProps)}
                        placeholder="A nice review title..."
                        type="text"
                        label="Title"
                        validate={[validateEmptyField, maxCharacters50]}
                    />
                </div>
                <div className="field">
                    <Field 
                        name="rating"
                        component={formProps => renderSelect(formProps)}
                        type="select"
                        label="Rating"
                    />
                </div>
                <div className="field">
                    <Field
                        name="review"
                        component={formProps => renderInput(formProps)}
                        placeholder="A Review body"
                        type="text"
                        label="Review"
                        validate={[validateEmptyField]}
                    />
                </div>
                <button className="ui button">Submit Review</button>
            </form>
        </div>
    )
};

const formWrapped = reduxForm({
    form: "ReviewForm",
})(ReviewForm);

const mapStateToProps = ({ user, selectedMovie }) => {
    return {
        initialValues: {
            title: "",
            rating: 0,
            review: ""
        },
        user: user,
        movieID: selectedMovie._id
    }
}

export default connect(mapStateToProps, { addReviewToMovie })(formWrapped);