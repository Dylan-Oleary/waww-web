import React from 'react';
import { Link } from "react-router-dom";

import CardModal from './CardModal';
import altLogo from '../public/assets/images/case-white.svg';

const ListViewCard = ({ movie, size }) => {
    return (
        <div id="ListViewCard" className={size}>
            <div className="list-view-image-container blur">
                <img className="ui fluid image" src={movie.poster_path ? `https://image.tmdb.org/t/p/original/${movie.poster_path}` : altLogo} />
                <CardModal movie={movie} />
            </div>
            <div className="list-view-card-content">
                <Link to={`/movies/${movie._id ? movie._id : movie.id}`}>{`${movie.title} (${movie.release_date.substring(0,4)})`}</Link>
            </div>
        </div>
    );
};

export default ListViewCard;