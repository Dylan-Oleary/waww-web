import React from 'react';
import { navigate } from 'hookrouter';

import CardModal from '../components/CardModal';
import altImage from '../public/assets/images/case-white.svg';

const SearchResultCard = (props) => {
    const { movie } = props;

    const navigateToMovieProfile = movie => {
        navigate(`/movies/${movie.id}`)
    }

    return(
        <div id="SearchResultCard">
            <div className="search-view-image-container blur">
                <img className="ui fluid image" src={movie.poster_path ? `https://image.tmdb.org/t/p/original/${movie.poster_path}` : altImage} />
                <CardModal movie={movie} navigateToMovieProfile={navigateToMovieProfile}/>
            </div>
            <div className="search-view-card-content">
                <h2 onClick={() => navigateToMovieProfile(movie)}>{`${movie.title} (${movie.release_date.substring(0,4)})`}</h2>
                <p className="synopsis">{movie.overview}</p>
            </div>
        </div>
    )
}

export default SearchResultCard;