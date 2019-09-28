import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";

import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import expressServer from "../api";

const ReviewSection = ({ movieID, reviewIDs, login }) => {
    const [newReviewOpen, setNewReviewOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviewsContent = () => {
            expressServer.get(`/api/movies/${movieID}/reviews`).then(response => {
                setReviews(response.data.formattedReviews);
                setIsLoading(false);
            });
        };

        fetchReviewsContent();
    }, [reviewIDs]);

    const renderReviewCards = () => {
        return reviews.reverse().map(review => {
            return <ReviewCard reviewContent={review}/>
        });
    };

    const renderContent = () => {
        return (
            <Fragment>
                <button  onClick={() => setNewReviewOpen(true)}>Leave a Review!</button>
                {newReviewOpen && login.isLoggedIn && <ReviewForm isAuthenticated={login.isLoggedIn}/>}
                {reviews && reviews.length ? renderReviewCards() : <div>There are no reviews, be the first to leave one</div>}
            </Fragment>
        );
    };

    return (
        <div id="ReviewSection">
            {isLoading ? <div className="ui active loader massive"></div> : renderContent()}
        </div>
    )
};

const mapStateToProps = ({ login }) => {
    return {
        login
    }
};

export default connect(mapStateToProps)(ReviewSection);