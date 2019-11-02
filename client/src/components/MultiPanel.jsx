import React from 'react';
import { Link } from "react-router-dom";

import altLogo from '../public/assets/images/ticket-logo.png';
import { shuffle } from '../utils/arrayHelpers';

const MultiPanel = ({ title, content }) => {
    const shuffledMovies = shuffle(content);

    const renderMainPanel = movie => {
        const bgImage = movie.backdrop_path === null ? altLogo : `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`;

        return (
            <div className="multi-image-main" style={{ backgroundImage: `url(${bgImage})` }}>
                <Link className="title-overlay-small" to={`/movies/${movie._id}`}>{`${movie.title} (${movie.release_date.substring(0,4)})`}</Link>
            </div>
        )
    }

    const renderStackPanel = movies => {
        return (
            <div className="multi-image-stack">
                {
                    movies.map(movie => {
                        const bgImage = movie.backdrop_path === null ? altLogo : `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`;
                        return (
                            <div style={{ backgroundImage: `url(${bgImage})` }} key={`${movie.title}-stack-image`}>
                                <Link className="title-overlay-tiny" to={`/movies/${movie._id}`}>{`${movie.title} (${movie.release_date.substring(0,4)})`}</Link>
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    const renderList = movies => {
        return (
            <div className="multi-panel-list">
                <h3>More Titles</h3>
                {
                    movies.map(movie => {
                        return <Link className="multi-list-item" to={`/movies/${movie._id}`}>{`${movie.title} (${movie.release_date.substring(0,4)})`}</Link>
                    })
                }
            </div>
        )
    }

    return (
        <div id="MultiPanel">
            <h2>{title}</h2>
            <div className="multi-content">
                <div className="multi-image-wrapper">
                    {renderMainPanel(shuffledMovies[0])}
                    {renderStackPanel(shuffledMovies.slice(1,3))}
                    {renderList(shuffledMovies.slice(3, 12))}
                </div>
            </div>
        </div>
    )
}

export default MultiPanel;