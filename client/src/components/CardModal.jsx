import React, { Fragment } from 'react';
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { connect } from 'react-redux';

import { removeFromUserList } from '../redux/actions/user';

const CardModal = ({ movie, removeFromUserList, user }) => {
    const path = useRouteMatch().url.slice(7);
    const history = useHistory();

    const navigateToMovieProfile = () => {
        history.push(`/movies/${movie._id ? movie._id : movie.id}`)
    };

    const renderButtons = () => {
        const token = window.localStorage.getItem("token");
        const buttonText = `Remove From ${path.charAt(0).toUpperCase() + path.slice(1)}`;

        if(path === "watchlist" || path === "favourites" || path === "viewed"){
            return (
                <Fragment>
                    <button className="ui button medium inverted" onClick={() => navigateToMovieProfile()}>See More</button>
                    <button className="ui button medium inverted" onClick={() => removeFromUserList(token, path, movie, user._id)}>{buttonText}</button>
                </Fragment>
            )
        } else {
            return <button className="ui button medium inverted" onClick={() => navigateToMovieProfile()}>See More</button>
        }

    }

    return (
        <div id="CardModal">
            <div className="top-layer">
                {renderButtons()}
            </div>
        </div>
    );
}

const mapStateToProps = ({ user }) => {
    return {
        user
    };
};

export default connect(mapStateToProps, { removeFromUserList })(CardModal);