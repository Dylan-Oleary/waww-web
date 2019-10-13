import React, { useState, useEffect} from 'react';
import { connect } from "react-redux";

import { formatDate } from ".././utils/dateFormatter";
import { deleteReviewForMovie, editReviewForMovie, addReviewToMovie } from "../redux/actions/movies";
import { showModal } from '../redux/actions/modal';

const defaultFormData = {
    _id: "",
    title: "",
    review: ""
}

const ReviewCard = ({ isNew = false, openAsForm = false, reviewID, title, author, review, profilePicture, userID, createdAt, updatedAt, closeReview = () => {}, setIsLoading = () => {},  movieID, authenticatedUser, addReviewToMovie, deleteReviewForMovie, editReviewForMovie }) => {
    const token = window.localStorage.getItem("token");

    const [isForm, setIsForm] = useState(openAsForm);
    const [formData, setFormData] = useState(defaultFormData);

    useEffect(() => {
        if(isNew){
            setIsForm(true);
        }

        return () => {
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
        setIsLoading(true);

        if(isNew){
            delete formData["_id"];

            addReviewToMovie(token, formData, movieID).then(() => {
                setIsLoading(false);
                closeReview();
                setFormData(defaultFormData);
            });
        } else {
            editReviewForMovie(token, formData, movieID).then(() => {
                setIsLoading(false);
                setFormData(defaultFormData);
                setIsForm(false);
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
            <div className="card-wrapper">
                <div className="image-column">
                    <img className="ui circular image tiny" src={profilePicture} alt="" />
                </div>
                <div className="comment-column">
                    <div className="comment-fields">
                        <div className="comment-field">
                            <div className="title">{title}</div>
                            <div>{`Written by `}<span style={{fontWeight: "bold"}}>{author}</span>{` on ${formatDate(createdAt)}`}{createdAt !== updatedAt && <span className="muted-text" style={{marginLeft: "5px"}}>(Edited)</span>}</div>
                        </div>
                        <hr />
                        <div className="comment-field">
                            <p>{review}</p>
                        </div>
                    </div>
                    {authenticatedUser._id === userID && <div className="user-actions">
                        <button onClick={() => prepareFormForEdit()}>Edit</button>
                        <span> / </span>
                        <button onClick={() => handleDelete()}>Delete</button>
                    </div>}
                </div>
            </div>
        )
    }

    const renderForm = () => {
        return (
            <form className="card-wrapper" onSubmit={event => handleSubmit(event)}>
                <div className="image-column">
                    <img className="ui circular image tiny" src={isNew ? authenticatedUser.profilePicture.secureURL : profilePicture} />
                </div>
                <div className="comment-column">
                    <div className="comment-fields">
                        <div className="comment-field">
                            <label>Title</label>
                            <input 
                                type="text" 
                                className="comment-input"
                                placeholder="Add a Title..."
                                value={formData.title} 
                                onChange={event => handleInputChange(event, "title")}
                            />
                        </div>
                        <div className="comment-field body">
                            <label>Review</label>
                            <textarea
                                type="text" 
                                className="comment-input"
                                placeholder="Let people know what you thought about the movie..."
                                value={formData.review} 
                                onChange={event => handleInputChange(event, "review")}
                            />
                        </div>
                    </div>
                <div className="button-row">
                    <button className="btn submit" type="submit">Submit</button>
                    <button className="btn remove" onClick={() => clearForm()}>Cancel</button>
                </div>
                </div>
            </form>
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

export default connect(mapStateToProps, { addReviewToMovie, deleteReviewForMovie, editReviewForMovie, showModal })(ReviewCard);