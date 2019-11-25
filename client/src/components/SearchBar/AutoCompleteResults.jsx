import React from "react";
import { Link } from "react-router-dom";

import { formatGenres } from "../../utils/genreFormatter";
import altImage from '../../public/assets/images/case-white.svg';

const AutoCompleteResults = ({ isMobile, searchTerm, results, clearSearch }) => {
    const className = isMobile ? "mobile" : "desktop";

    const noResultsMessage = () => {
        if(isMobile && searchTerm.length > 0){
            return (
                <div className="shadow no-results">
                    No Results
                </div>
            );
        }
    };

    return (
        <div className={`auto-complete ${className}`}>
            {(results.length === 0 && searchTerm.length > 0) && noResultsMessage()}
            {results.map(result => {
                return (
                    <div className={`auto-row ${className}`} key={`autocomplete-${result.id}`}>
                        <img src={result.poster_path ? `https://image.tmdb.org/t/p/w92${result.poster_path}` : altImage} alt={`Poster for ${result.title}`} />
                        <div className={`auto-title ${className} shadow`}>
                            <Link to={`/movies/${result.id}`} onClick={() => clearSearch()}>{`${result.title} (${ result.release_date !== undefined ? result.release_date.substring(0,4) : ""})`}</Link>
                            <div className={`auto-summary ${className}`}>{formatGenres(result.genre_ids)}</div>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

export default AutoCompleteResults;