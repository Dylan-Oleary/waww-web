import React , { useEffect, useState, Fragment } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import { connect } from 'react-redux';

import SearchResultCard from '../components/SearchResultCard';
import expressServer from "../api";
import Pagination from '../components/Pagination';
import { getSearchResults, clearSearchObject, setSearch } from '../redux/actions/search';
import Logo from '../public/assets/images/error-ticket.svg';
import { setBrowserTitle } from "../utils/browserTitle";

const SearchResults = () => {
    const history = useHistory();
    const location = useLocation();
    const [searchResults, setSearchResults] = useState([]);
    const [pagination, setPagination] = useState({});
    const [isSearching, setIsSearching] = useState(true);
    const queryValues = queryString.parse(location.search);

    useEffect(() => {
        if(!queryValues.title || !queryValues.page){
            history.push("/");
        } else {
            expressServer.get("/api/search", {
                params: {
                    searchTerm: queryValues.title,
                    page: queryValues.page,
                }
            }).then(response => {
                setIsSearching(false);
                setSearchResults(response.data.searchResults);
                setPagination({
                    currentPage: response.data.currentPage,
                    totalPages: response.data.totalPages,
                    totalResults: response.data.totalResults
                });
                setBrowserTitle(`WAWW | Search Results | Page ${queryValues.page}`);
            }).catch(error => {
                console.log(error);
            })
        }
    }, [location])

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
        const { currentPage, totalPages, totalResults } = pagination;
        const resultRange = `${(currentPage * 20) - 19} - ${currentPage == totalPages ? totalResults : currentPage * 20}`;

        return (
            <div className="results-header">
                <div className="results-meta">
                    <h2>{`${totalResults} results found for '${queryValues.title}'`}</h2>
                    <p>{`Showing ${resultRange} of ${totalResults}`}</p>
                </div>
                <Pagination initialPage={parseInt(currentPage)} changePage={onPageChange} totalPages={totalPages} />
            </div>
        )
    }

    const onPageChange = newPage => {
        history.push(`/search/?title=${queryValues.title}&page=${newPage}`)
    }

    const getRandomMovie = () => {
        return expressServer.get("/api/movies/random").then(response => {
            history.push(`/movies/${response.data.movie.id}`);
        });
    };

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
                                <img src={Logo} />
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
    return {
        searchResults: search.searchResults,
        totalPages: search.totalPages,
        totalResults: search.totalResults
    };
}

export default connect(mapStateToProps, { getSearchResults, clearSearchObject, setSearch })(SearchResults)