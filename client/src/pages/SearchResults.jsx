import React , { useEffect } from 'react';
import { useQueryParams } from 'hookrouter';
import { connect } from 'react-redux';

import SearchResultCard from '../components/SearchResultCard';
import { getSearchResults, clearSearchObject } from '../redux/actions/search';

const SearchResults = ({ search, getSearchResults, clearSearchObject }) => {
    const [ params ] = useQueryParams();
    const { title } = params;

    useEffect( () => {
        getSearchResults(title);

        return () => clearSearchObject();

    }, [title]);
    
    const renderSearchResults = () => {
        if(search.currentSearch === '' && search.searchResults.length < 1){
            return (
                <div className="ui active loader massive"></div>
            )
        } else {
            if(search.searchResults && search.searchResults.length){
                return (
                    search.searchResults.map( result => {
                        return <SearchResultCard key={result.id} movie={result} />
                    })
                )
            } else {
                return <div>NO RESULTS TRY AGAIN</div>
            }
        }
    }

    return (
        <div id="SearchResults">
            {renderSearchResults()}
        </div>
    )
}

const mapStateToProps = ({ search }) => {
    return { search };
}

export default connect(mapStateToProps, { getSearchResults, clearSearchObject })(SearchResults)