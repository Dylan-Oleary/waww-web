import React from 'react';

import altProfileImage from '../public/assets/images/pink-blue-circle.svg';
import { formatDate } from ".././utils/dateFormatter";

const ReviewCard = ({ reviewContent }) => {
    const { title, rating, review, createdAt, updatedAt } = reviewContent;
    const userDetails = reviewContent.userDetails[0];

    return (
        <div id="ReviewCard">
            <div className="comment-card-header">
                <img className="ui circular image tiny" src={userDetails.profilePicture.secureURL} />
                <div className="flex-column">
                    <div className="flex">
                        <h2 className="review-title">{title}</h2>
                        <div>{`Rating - ${rating}`}</div>
                    </div>
                    <p>{`Written by ${userDetails.username} on ${formatDate(createdAt)}`}{createdAt !== updatedAt && <span>{`Edited on ${formatDate(updatedAt)}`}</span>}</p>
                </div>
            </div>
            <div className="comment-card-body">
                <p>{review}</p>
            </div>

        </div>
    );
};

export default ReviewCard;