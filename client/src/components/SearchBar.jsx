import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { navigate, useQueryParams } from 'hookrouter';

import { setSearch } from '../redux/actions/search';

const SearchBar = ({ currentSearch, setSearch }) => {
    const [ searchTerm , setSearchTerm ] = useState('');
    const [ queryParams , setQueryParams ] = useQueryParams();

    const handleInputChange = event => {
        setSearchTerm(event.target.value);
    }

    const handleSubmit = async event => {
        event.preventDefault();

        //This line is needed until hookrouter fixes a bug where the navigate function doesn't change the query params if they already exist
        if(searchTerm !== ''){
            setQueryParams({ title: searchTerm, page: 1 }, true);
            setSearch(searchTerm, 1);
            
            navigate('/search', false, {title: searchTerm, page:1});
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

const mapStateToProps = ({ search }) => {
    return {
        currentSearch: search.currentSearch
    }
}
export default connect(mapStateToProps, { setSearch })(SearchBar);