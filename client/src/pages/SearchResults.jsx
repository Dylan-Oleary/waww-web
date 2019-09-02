import React , { useEffect, useState, Fragment } from 'react';
import { useQueryParams, navigate} from 'hookrouter';
import { connect } from 'react-redux';

import SearchResultCard from '../components/SearchResultCard';
import Pagination from '../components/Pagination';
import { getSearchResults, clearSearchObject, setSearch } from '../redux/actions/search';
import Logo from '../public/assets/images/error-ticket.svg';
import { getRandomMovie } from '../redux/actions/movies';

const SearchResults = ({ search, getSearchResults, clearSearchObject, getRandomMovie, setSearch }) => {
    const [ params, setQueryParams ] = useQueryParams();
    const { title, page } = params;
    const { currentSearch, currentPage, searchResults, totalPages, totalResults, isSearching } = search;
    
    useEffect(() => {
        //If fresh load of page
        if(!currentSearch || !currentPage){
            setSearch(title, page);
        } else {
            getSearchResults(currentSearch, currentPage);
        }

    }, [currentSearch, currentPage])

    const renderSearchResults = () => {
        return (
            <div className="results-body">
                {
                    searchResults.map( result => {
                        return <SearchResultCard key={result.id} movie={result} />
                    })
                }
            </div>
        )
    }

    const renderResultsHeader = () => {
        const resultRange = `${(currentPage * 20) - 19} - ${currentPage == totalPages ? totalResults : currentPage * 20}`;

        return (
            <div className="results-header">
                <div className="results-meta">
                    <h2>{`${totalResults} results found for '${currentSearch}'`}</h2>
                    <p>{`Showing ${resultRange} of ${totalResults}`}</p>
                </div>
                <Pagination initialPage={parseInt(currentPage)} changePage={onPageChange} totalPages={totalPages} />
            </div>
        )
    }

    const onPageChange = newPage => {
        setQueryParams({ title: currentSearch, page: newPage}, true);
        setSearch(currentSearch, newPage);
    }

    return (
        <div id="SearchResults">
            {
                isSearching ? <div className="ui active loader massive"></div> : (
                    searchResults && searchResults.length ? (
                        <Fragment>
                            {renderResultsHeader()}
                            {renderSearchResults()}
                        </Fragment>
                    ) : (
                        <div className="search-error">
                            <div className="image-container">
                                <img src={Logo} required />
                            </div>
                            <div className="search-error-message">
                                <h2>Sorry! We couldn't find anything for you!</h2>
                                <p>If you're feeling lucky, try letting us <span onClick={() => getRandomMovie()}>find a movie for you</span> or search again!</p>
                            </div>
                        </div>
                    )
                )
            }
        </div>
    )
}

const mapStateToProps = ({ search }) => {
    return { search };
}

export default connect(mapStateToProps, { getSearchResults, clearSearchObject, getRandomMovie, setSearch })(SearchResults)