import React from 'react';
import { usePath } from 'hookrouter';
import { connect } from 'react-redux';

import { updateWatchList, updateFavourites } from '../redux/actions/user';


const CardModal = ({movie, navigateToMovieProfile, updateWatchList, updateFavourites}) => {
    const path = usePath();

    const token = window.localStorage.getItem("token");

    const renderActionButton = () => {
        switch(path){
            case "/users/watchlist" :
                return <button className="ui button medium inverted" onClick={() => updateWatchList(token, {_id: movie._id, release_date: movie.release_date, poster_path: movie.poster_path, title: movie.title})} >Remove From WatchList</button>
            case "/users/favourites" :
                return <button className="ui button medium inverted" onClick={() => updateFavourites(token, {_id: movie._id, release_date: movie.release_date, poster_path: movie.poster_path, title: movie.title})} >Remove from favourites</button>
            default :
                return null;
        }
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

export default connect(null, { updateWatchList, updateFavourites })(CardModal);