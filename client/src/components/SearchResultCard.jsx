import React from 'react';
import { navigate } from 'hookrouter';

import CardModal from '../components/CardModal';
import altImage from '../public/assets/images/case-white.svg';
import { genres } from '../constants';
import { formatGenres } from '../utils/genreFormatter';

const SearchResultCard = (props) => {
    const { movie } = props;
    
    const releaseDate = movie.release_date ? `(${movie.release_date.substring(0,4)})` : '';

    const navigateToMovieProfile = movie => {
        navigate(`/movies/${movie.id}`)
    }

    const getGenreNames = () => {
        const genreNames = genres.filter(genre => {
            return movie.genre_ids.includes(genre.id) ? true : false
        })

        return genreNames && genreNames.length ? formatGenres(genreNames) : "N/A";
    }

    return(
        <div id="SearchResultCard">
            <div className="search-view-image-container blur">
                <img className="search-view-image" src={movie.poster_path ? `https://image.tmdb.org/t/p/original/${movie.poster_path}` : altImage} />
                <CardModal movie={movie} navigateToMovieProfile={navigateToMovieProfile}/>
            </div>
            <div className="search-view-card-content">
                <h3 onClick={() => navigateToMovieProfile(movie)}>{`${movie.title} ${releaseDate}`}</h3>
                <p className="search-card-content-title">Synopsis</p>
                <p className="search-card-content-body">{movie.overview ? movie.overview : "N/A"}</p>
                <p className="search-card-content-title">Genres</p>
                <p className="search-card-content-body">{getGenreNames()}</p>
            </div>
        </div>
    )
}

export default SearchResultCard;