import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentSlash as noReviewIcon } from '@fortawesome/free-solid-svg-icons';

import ReviewCard from "./ReviewCard";
import expressServer from "../api";

const ReviewSection = ({ movieID, reviewIDs, login, user }) => {
    const [newReviewOpen, setNewReviewOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [userHasReview, setUserHasReview] = useState(false);

    useEffect(() => {
        const fetchReviewsContent = () => {
            setIsLoading(true);
            setUserHasReview(false);
            expressServer.get(`/api/movies/${movieID}/reviews`).then(response => {
                setReviews(response.data.formattedReviews.reverse());
                setIsLoading(false);
                for(let i = 0; i< response.data.formattedReviews.length; i++){
                    if(response.data.formattedReviews[i].user._id === user._id){
                        setUserHasReview(true);
                        break;
                    }
                }
            });
        };

        fetchReviewsContent();
    }, [reviewIDs]);

    const renderReviewCards = () => {
        if(reviews.length === 0 && !isLoading){
            if(!newReviewOpen){
                return (
                    <div className="empty-message">
                        <FontAwesomeIcon icon={noReviewIcon} size="8x" />
                        <h3>There are no reviews! Be the first to leave one</h3>
                        <button type="button" className="btn submit" onClick={() => setNewReviewOpen(true)}>Leave a Review!</button>
                    </div>
                )
            }
        } else {
            return reviews.map(review => {
                return (
                    <ReviewCard
                        reviewID={review._id}
                        title={review.title}
                        review={review.review}
                        author={review.user.username}
                        profilePicture={review.user.profilePicture.secureURL}
                        createdAt={review.createdAt}
                        updatedAt={review.updatedAt}
                        setIsLoading={setIsLoading}
                        userID={review.user._id}
                    />
                )
            });
        }
    };

    const renderContent = () => {
        return (
            <Fragment>
                {!userHasReview && reviews.length > 0 && <button className="btn submit" onClick={() => setNewReviewOpen(true)}>Leave a Review!</button>}
                {newReviewOpen && login.isLoggedIn && <ReviewCard isNew={true} openAsForm={true} closeReview={closeNewReview} setIsLoading={setIsLoading}/>}
                {reviews && renderReviewCards()}
            </Fragment>
        );
    };

    const closeNewReview = () => {
        setNewReviewOpen(false);
    }

    return (
        <div id="ReviewSection">
            {isLoading ? <div className="ui active loader massive"></div> : renderContent()}
        </div>
    )
};

const mapStateToProps = ({ login, user }) => {
    return {
        login,
        user
    }
};

export default connect(mapStateToProps)(ReviewSection);