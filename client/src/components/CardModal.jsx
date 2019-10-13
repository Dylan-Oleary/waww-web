import React from 'react';
import { usePath } from 'hookrouter';
import { connect } from 'react-redux';

import { removeFromUserList } from '../redux/actions/user';

const CardModal = ({ movie, navigateToMovieProfile, removeFromUserList, user }) => {
    const path = usePath().slice(7);

    const renderActionButton = () => {
        const token = window.localStorage.getItem("token");
        let buttonText = `Remove From ${path.charAt(0).toUpperCase() + path.slice(1)}`;

        return <button className="ui button medium inverted" onClick={() => removeFromUserList(token, path, movie, user._id)}>{buttonText}</button>
    }

    return (
        <div id="CardModal">
            <div className="top-layer">
                <button className="ui button medium inverted" onClick={() => navigateToMovieProfile(movie)}>See More</button>
                {renderActionButton()}
            </div>
        </div>
    )
}

const mapStateToProps = ({ user }) => {
    return {
        user
    };
};

export default connect(mapStateToProps, { removeFromUserList })(CardModal);