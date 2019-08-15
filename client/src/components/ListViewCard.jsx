import React from 'react';
import { navigate } from 'hookrouter';

import CardModal from './CardModal';
import altLogo from '../public/assets/images/case-white.svg';

const ListViewCard = ({ movie, size }) => {
    const navigateToMovieProfile = movie => {
        const movieID = movie.tmdb_id ? movie.tmdb_id : movie.id;

        navigate(`/movies/${movieID}`);
    }

    return (
        <div id="ListViewCard" className={size}>
            <div className="list-view-image-container blur">
                <img className="ui fluid image" src={movie.poster_path ? `https://image.tmdb.org/t/p/original/${movie.poster_path}` : altLogo} />
                <CardModal movie={movie} navigateToMovieProfile={navigateToMovieProfile}/>
            </div>
            <div className="list-view-card-content">
                <h2>{`${movie.title} (${movie.release_date.substring(0,4)})`}</h2>
            </div>
        </div>
    )
}

export default ListViewCard;