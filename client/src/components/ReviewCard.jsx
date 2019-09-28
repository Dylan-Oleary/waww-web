import React from 'react';
import { connect } from "react-redux";

import altProfileImage from '../public/assets/images/pink-blue-circle.svg';
import { formatDate } from ".././utils/dateFormatter";
import { deleteReviewForMovie } from "../redux/actions/movies";

const ReviewCard = ({ reviewContent, authenticatedUserID, deleteReviewForMovie }) => {
    const { _id, title, review, createdAt, updatedAt, user, movieID } = reviewContent;
    const token = window.localStorage.getItem("token");

    return (
        <div id="ReviewCard">
            <div className="comment-card-header">
                <img className="ui circular image tiny" src={user.profilePicture.secureURL} />
                <div className="flex-column">
                    <div className="flex">
                        <h2 className="review-title">{title}</h2>
                        {authenticatedUserID === user._id && 
                            <button onClick={() => deleteReviewForMovie(token, movieID, _id)}>Delete Review</button>
                        }
                    </div>
                    <p>{`Written by ${user.username} on ${formatDate(createdAt)}`}{createdAt !== updatedAt && <span>{`Edited on ${formatDate(updatedAt)}`}</span>}</p>
                </div>
            </div>
            <div className="comment-card-body">
                <p>{review}</p>
            </div>

        </div>
    );
};

const mapStateToProps = ({ user }) => {
    return {
        authenticatedUserID: user._id
    }
}

export default connect(mapStateToProps, { deleteReviewForMovie })(ReviewCard);