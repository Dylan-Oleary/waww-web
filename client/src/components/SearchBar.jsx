import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import { throttle, debounce } from "throttle-debounce";
import { Link } from "react-router-dom";

import expressServer from "../api";
import altImage from '../public/assets/images/case-white.svg';

const SearchBar = () => {
    const [searchTerm , setSearchTerm] = useState("");
    const [autoCompleteResults, setAutoCompleteResults] = useState([]);
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        if(searchTerm !== ""){
            if(searchTerm.length < 5){
                throttleSearch(searchTerm);
            } else {
                debounceSearch(searchTerm);
            }
        } else {
            setAutoCompleteResults([]);
        }
    }, [searchTerm]);

    useEffect(() => {
        setSearchTerm("");
        setAutoCompleteResults([]);
    }, [location, history])

    const autoCompleteSearch = query => {
        expressServer.get("/api/search", {
            params: {
                searchTerm: query,
                page: 1,
            }
        }).then(response => {
            setAutoCompleteResults(response.data.searchResults.slice(0, 5));
        })
    };

    const debounceSearch = useCallback(debounce(500, query => autoCompleteSearch(query)), []);
    const throttleSearch = useCallback(throttle(250, query => autoCompleteSearch(query)), []);

    const handleInputChange = event => {
        setSearchTerm(event.target.value);
    }

    const handleSubmit = async event => {
        event.preventDefault();

        if(searchTerm !== ""){
            history.push(`/search/?title=${searchTerm}&page=1`);
            setSearchTerm("");
        }
    }

    return (
        <div id="SearchBar" className="item">
            <form onSubmit={(e) => handleSubmit(e)} className="ui input">
                <i className="search icon" />
                <input className="prompt transparent" value={searchTerm} onChange={(e) => handleInputChange(e)} placeholder="Search for a movie..."/>
            </form>
            {autoCompleteResults.length > 0 && <div className="auto-complete">
                {autoCompleteResults.map((result, index) => {
                    return (
                        <div className="auto-row" key={`autocomplete-${result.id}`}>
                            <img src={result.poster_path ? `https://image.tmdb.org/t/p/w92${result.poster_path}` : altImage} />
                            <div className="auto-title">
                                <Link to={`/movies/${result.id}`} onClick={() => setSearchTerm("")}>{`${result.title} (${result.release_date.substring(0,4)})`}</Link>
                            </div>
                        </div>
                    )
                })}
            </div>}
        </div>
    );
}

export default SearchBar;