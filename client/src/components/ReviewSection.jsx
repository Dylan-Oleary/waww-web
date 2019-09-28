import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";

import ReviewCard from "./ReviewCard";
import expressServer from "../api";

const ReviewSection = ({ movieID, reviewIDs, login, user }) => {
    const [newReviewOpen, setNewReviewOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [userHasReview, setUserHasReview] = useState(false);

    useEffect(() => {
        const fetchReviewsContent = () => {
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
    };

    const renderContent = () => {
        return (
            <Fragment>
                {!userHasReview && <button onClick={() => setNewReviewOpen(true)}>Leave a Review!</button>}
                {newReviewOpen && login.isLoggedIn && <ReviewCard isNew={true} openAsForm={true} closeReview={closeNewReview} setIsLoading={setIsLoading}/>}
                {reviews && reviews.length ? renderReviewCards() : <div>There are no reviews, be the first to leave one</div>}
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