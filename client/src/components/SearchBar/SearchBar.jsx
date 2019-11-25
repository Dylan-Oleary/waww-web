import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import { throttle, debounce } from "throttle-debounce";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

import AutoCompleteResults from "./AutoCompleteResults";
import expressServer from "../../api";

const SearchBar = ({ isMobile }) => {
    const [searchTerm , setSearchTerm] = useState("");
    const [autoCompleteResults, setAutoCompleteResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        if(searchTerm.trim() !== ""){
            if(searchTerm.length < 5){
                throttleSearch(searchTerm);
            } else {
                debounceSearch(searchTerm);
            }
        }
    }, [searchTerm]);

    useEffect(() => {
        setSearchTerm("");
        setAutoCompleteResults([]);
    }, [location, history])

    const autoCompleteSearch = query => {
        setIsSearching(true);

        expressServer.get("/api/search", {
            params: {
                searchTerm: query,
                page: 1,
            }
        }).then(response => {
            setAutoCompleteResults(response.data.searchResults.slice(0, 5));
            setIsSearching(false);
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

    const clearSearch = () => {
        setSearchTerm("");
        setAutoCompleteResults([]);
    };

    return (
        <div id="SearchBar" className={`item ${isMobile ? "mobile" : "desktop"}`}>
            <form onSubmit={(e) => handleSubmit(e)} className="ui input">
                <FontAwesomeIcon icon={faSearch} />
                <input className="prompt transparent" value={searchTerm} onChange={(e) => handleInputChange(e)} placeholder="Search for a movie..."/>
                {searchTerm.length > 0 &&
                    <FontAwesomeIcon
                        icon={faTimesCircle}
                        onClick={clearSearch}
                    />
                }
            </form>
            {searchTerm !== "" && <AutoCompleteResults 
                isMobile={isMobile}
                searchTerm={searchTerm}
                isSearching={isSearching}
                results={autoCompleteResults}
                clearSearch={clearSearch}
            />}
        </div>
    );
}

export default SearchBar;