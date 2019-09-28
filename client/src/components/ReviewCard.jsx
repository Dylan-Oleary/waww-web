import React, { useState, useEffect, Fragment } from 'react';
import { connect } from "react-redux";

import altProfileImage from '../public/assets/images/pink-blue-circle.svg';
import { formatDate } from ".././utils/dateFormatter";
import { deleteReviewForMovie, editReviewForMovie, addReviewToMovie } from "../redux/actions/movies";

const defaultFormData = {
    _id: "",
    title: "",
    review: ""
}

const defaultReviewAuthor = {
    _id: "",
    username: "",
    profilePicture: {
        secureURL: ""
    }
};

const ReviewCard = ({ isNew = false, openAsForm = false, reviewID, title, author, review, profilePicture, userID, createdAt, updatedAt, closeReview = () => {}, setIsLoading = () => {},  movieID, authenticatedUser, addReviewToMovie, deleteReviewForMovie, editReviewForMovie }) => {
    const token = window.localStorage.getItem("token");

    const [isForm, setIsForm] = useState(openAsForm);
    const [formData, setFormData] = useState(defaultFormData);
    const [reviewAuthor, setReviewAuthor] = useState(defaultReviewAuthor);

    useEffect(() => {
        if(isNew){
            setIsForm(true);
            setReviewAuthor(authenticatedUser);
        } else {
            setReviewAuthor(author);
        }

        return () => {
            setReviewAuthor(defaultReviewAuthor);
            setFormData(defaultFormData);
        }
    }, []);

    const clearForm = () => {
        if(isNew){
            closeReview();
        }else {
            setFormData(defaultFormData);
            setIsForm(false);
        }
    };

    const prepareFormForEdit = () => {
        setFormData({ _id: reviewID, title: title, review: review });
        setIsForm(true);
    };

    const handleInputChange = (event, property) => {
        const updatedFormData = {
            ...formData,
            [property]: event.target.value
        };

        setFormData(updatedFormData);
    };

    const handleSubmit = event => {
        event.preventDefault();

        if(isNew){
            delete formData["_id"];
            setIsLoading(true);
            addReviewToMovie(token, formData, movieID).then(() => {
                closeReview();
                setIsLoading(false);
                setReviewAuthor(defaultReviewAuthor);
                setFormData(defaultFormData);
            });
        } else {
            setIsLoading(true);
            editReviewForMovie(token, formData, movieID).then(() => {
                setIsLoading(false);
                setFormData(defaultFormData);
                setIsForm(false);
                setReviewAuthor(defaultReviewAuthor);
            })
        }
    };

    const handleDelete = () => {
        setIsLoading(true);
        deleteReviewForMovie(token, movieID, reviewID).then(() => {
            setIsLoading(false);
        });
    }

    const renderCard = () => {
        return (
            <Fragment>
                <div className="comment-card-header">
                    <img className="ui circular image tiny" src={profilePicture} />
                    <div className="flex-column">
                        <div className="flex">
                            <h2 className="review-title">{title}</h2>
                            {authenticatedUser._id === userID && <Fragment>
                                <button onClick={() => handleDelete()}>Delete Review</button>
                                <button onClick={() => prepareFormForEdit()}>Edit Comment</button>
                            </Fragment>
                            }
                        </div>
                        <p>{`Written by ${author} on ${formatDate(createdAt)}`}{createdAt !== updatedAt && <span>{`Edited on ${formatDate(updatedAt)}`}</span>}</p>
                    </div>
                </div>
                <div className="comment-card-body">
                    <p>{review}</p>
                </div>
            </Fragment>
        )
    }

    const renderForm = () => {
        return (
            <Fragment>
                <form onSubmit={event => handleSubmit(event)}>
                    <div className="comment-card-header">
                        <img className="ui circular image tiny" src={isNew ? authenticatedUser.profilePicture.secureURL : profilePicture} />
                        <div className="flex-column">
                            <div className="field input-field">
                                <label>Title</label>
                                <input type="text" className="form-control" value={formData.title} onChange={event => handleInputChange(event, "title")}/>
                            </div>
                        </div>
                    </div>
                    <div className="comment-card-body">
                        <div className="field input-field">
                            <label>Review</label>
                            <input type="text" className="form-control" value={formData.review} onChange={event => handleInputChange(event, "review")}/>
                        </div>
                    </div>
                    <div className="flex">
                        <button type="submit">Submit</button>
                        <button onClick={() => clearForm()}>Cancel</button>
                    </div>
                </form>
            </Fragment>
        )
    }

    return (
        <div id="ReviewCard">
            { isForm ? renderForm() : renderCard() }
        </div>
    );
};

const mapStateToProps = ({ user, selectedMovie }) => {
    return {
        authenticatedUser: user,
        movieID: selectedMovie._id
    }
}

export default connect(mapStateToProps, { addReviewToMovie, deleteReviewForMovie, editReviewForMovie })(ReviewCard);