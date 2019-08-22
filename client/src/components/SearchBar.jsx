import React, { useState, useEffect } from 'react';
import { navigate, useQueryParams } from 'hookrouter';

const SearchBar = () => {
    const [ searchTerm , setSearchTerm ] = useState('');
    const [ queryParams , setQueryParams ] = useQueryParams();

    const handleInputChange = event => {
        setSearchTerm(event.target.value);
    }

    const handleSubmit = event => {
        event.preventDefault();

        //This line is needed until hookrouter fixes a bug where the navigate function doesn't change the query params if they already exist
        if(searchTerm !== ''){
            setQueryParams({title: searchTerm, page:1});
    
            navigate('/search', false, queryParams);
            setSearchTerm('');
        }
    }

    return (
        <form id="SearchBar" onSubmit={(e) => handleSubmit(e)} className="ui input">
            <i className="search icon" />
            <input className="prompt" value={searchTerm} onChange={(e) => handleInputChange(e)} placeholder="Search for a movie..."/>
        </form>
    )
}

export default SearchBar;