import React , { useEffect, useState, Fragment } from 'react';
import { useQueryParams } from 'hookrouter';
import { connect } from 'react-redux';

import SearchResultCard from '../components/SearchResultCard';
import Pagination from '../components/Pagination';
import { getSearchResults, clearSearchObject } from '../redux/actions/search';
import Logo from '../public/assets/images/error-ticket.svg';
import { getRandomMovie } from '../redux/actions/movies';

const SearchResults = ({ search, getSearchResults, clearSearchObject, getRandomMovie }) => {
    const [ params ] = useQueryParams();
    const { title, page } = params;

    useEffect( () => {
        getSearchResults(title, page);

        return () => clearSearchObject();

    }, [title, page]);
    
    const renderSearchResults = () => {
        return (
            <div className="results-body">
                {
                    search.searchResults.map( result => {
                        return <SearchResultCard key={result.id} movie={result} />
                    })
                }
            </div>
        )
    }

    const renderResultsHeader = () => {
        const resultRange = `${(page * 20) - 19} - ${page == search.totalPages ? search.totalResults : page * 20}`;

        return (
            <div className="results-header">
                <div className="results-meta">
                    <h2>{`${search.totalResults} results found for '${title}'`}</h2>
                    <p>{`Showing ${resultRange} of ${search.totalResults}`}</p>
                </div>
                <Pagination initialPage={parseInt(page)} />
            </div>
        )
    }

    return (
        <div id="SearchResults">
            {
                search.currentSearch === '' && search.searchResults.length < 1 ? <div className="ui active loader massive"></div> : (
                    search.searchResults && search.searchResults.length ? (
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

export default connect(mapStateToProps, { getSearchResults, clearSearchObject, getRandomMovie })(SearchResults)