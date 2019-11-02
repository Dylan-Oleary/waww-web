import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { connect } from 'react-redux';

import { setSearch } from '../redux/actions/search';

const SearchBar = ({ currentSearch, setSearch }) => {
    const [searchTerm , setSearchTerm] = useState("");
    const history = useHistory();

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