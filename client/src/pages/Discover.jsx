import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThList as withSynopsis, faTh as withoutSynopsis } from '@fortawesome/free-solid-svg-icons';

import { certificationFilters, genres, releaseDateFilters, sortOptions } from '../constants';
import expressServer from "../api";
import ListViewCard from '../components/ListViewCard';
import SearchResultsCard from '../components/SearchResultCard';
import Pagination from '../components/Pagination';
import CustomSelect from '../components/CustomSelect';
import Logo from '../public/assets/images/error-ticket.svg';
import { setBrowserTitle } from "../utils/browserTitle";

const defaultQuery = {
    releaseDates: releaseDateFilters[0],
    certification: certificationFilters[0],
    sortBy: sortOptions[0],
    page: 1
};

const Discover = () => {
    const history = useHistory();
    const params = useParams();
    const [resultViewWithSynopsis, setResultViewWithSynopsis] = useState(false);
    const [backdropPath, setBackdropPath] = useState(null);
    const [query, setQuery] = useState(defaultQuery);
    const [movies, setMovies] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const currentGenre = genres.filter(genre => genre.slug === params.genre)[0];
    const [isSearching, setIsSearching] = useState(true);


    useEffect(() => {
        if(currentGenre === null || currentGenre === undefined){
            history.push("/error/404");
        } else {
            setBrowserTitle(`WAWW | ${currentGenre.name}`);
            setBackdropPath(currentGenre.backdropPath);
            setIsSearching(true);
            expressServer.get(`/api/genres/${currentGenre.id}`, {
                params: {
                    primaryReleaseDateGTE: query.releaseDates.primaryReleaseDateGTE,
                    primaryReleaseDateLTE: query.releaseDates.primaryReleaseDateLTE,
                    certification: query.certification.value,
                    sortBy: query.sortBy.option,
                    page: query.page
                }
            }).then(response => {
                setIsSearching(false);
                setMovies(response.data.movies);
                setTotalPages(response.data.totalPages);
            }).catch(error => {
                console.log(error);
            });
        }

    },[query, params.genre])

    useEffect(() => {
        if(window.scrollY > 300){
            window.scrollTo(0, 300);
        }
    }, [query]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [params.genre]);

    const onFilterChange = (newFilter, currentFilter, type) => {
        if(newFilter.id !== currentFilter.id){
            if(type === "releaseDates"){
                setQuery({
                    ...query,
                    releaseDates: releaseDateFilters[newFilter.id],
                    page: 1
                });
            }
            if(type === "certification"){
                setQuery({
                    ...query,
                    certification: certificationFilters[newFilter.id],
                    page: 1
                });
            }
        }
    }

    const renderFilters = () => {
        return (
            <div className="discover-filter-wrapper">
                <div className="filters">
                    <div className="filter-category">
                        <h3>Genre</h3>
                        <CustomSelect options={genres} initial={currentGenre.name} onChange={onGenreChange} column={false} size={"regular"} />
                    </div>
                    <div className="filter-category">
                        <h3>Release Year</h3>
                            {releaseDateFilters.map(filter => {
                                return (
                                    <div className={query.releaseDates.id === filter.id ? 'active filter-field' : 'filter-field'} onClick={() => onFilterChange(filter, query.releaseDates, "releaseDates")} >
                                        <label>{filter.title}</label>
                                    </div>
                                )
                            })}
                    </div>
                    <div className="filter-category">
                        <h3>Certification</h3>
                            {certificationFilters.map(filter => {
                                return (
                                    <div className={query.certification.id === filter.id ? 'active filter-field' : 'filter-field'} onClick={() => onFilterChange(filter, query.certification, "certification")} >
                                        <label>{filter.title}</label>
                                    </div>
                                )
                            })}
                    </div>
                </div>
            </div>
        )
    }

    const renderContentController = () => {
        return (
            <div className="discover-content-controller">
                <div className="view-options">
                    <label>View: </label>
                    <div className={resultViewWithSynopsis ? '' : 'selected-view'} >
                        <FontAwesomeIcon icon={withoutSynopsis} onClick={() => setResultViewWithSynopsis(false)}  />
                    </div>
                    <div className={resultViewWithSynopsis ? 'selected-view' : ''} >
                        <FontAwesomeIcon icon={withSynopsis} onClick={() => setResultViewWithSynopsis(true)}  />
                    </div>
                </div>
                <Pagination initialPage={parseInt(query.page)} totalPages={totalPages} changePage={onPageChange} />
                <div className="sort-options">
                    <label>Sort By: </label>
                    <CustomSelect options={sortOptions} initial={query.sortBy.name} onChange={onSortChange} column={true} size="small" background={true} />
                </div>
            </div>
        )
    }

    const onSortChange = option => {
        if(option.id !== query.sortBy.id){
            setQuery({
                ...query,
                sortBy: sortOptions[option.id],
                page: 1
            });
        }
    };

    const renderMovies = () => {
        return (
            <div className="discover-content-body">
                {movies.map(movie => resultViewWithSynopsis ? <SearchResultsCard movie={movie} /> : <ListViewCard movie={movie} />)}
            </div>
        )
    };

    const onPageChange = newPage => {
        setQuery({
            ...query,
            page: newPage
        });
    };

    const onGenreChange = genre => {
        history.push(`/discover/${genre.slug}`);
    }

    const getRandomMovie = () => {
        return expressServer.get("/api/movies/random").then(response => {
            history.push(`/movies/${response.data.movie.id}`);
        });
    };

    return (
        <div id="Discover">
            <div className="discover-header" style={{ backgroundImage: `url(${backdropPath})`, backgroundSize: 'cover'}}>
                {currentGenre.name ? <h2>{currentGenre.name}</h2> : <div className="ui active loader massive"></div>}
            </div>
            <div className="discover-body">
                {renderFilters()}
                <div className="discover-content-wrapper">
                    {!isSearching && movies && movies.length ? renderContentController() : null}
                    {
                        isSearching ? (
                            <div className="ui active loader massive"></div>
                        ) : (
                            movies && movies.length ? (
                                renderMovies()
                            ) : (
                                <div className="search-error">
                                    <div className="image-container">
                                        <img src={Logo}/>
                                    </div>
                                    <div className="search-error-message">
                                        <h2>Sorry! We couldn't find anything for you!</h2>
                                        <p>If you're feeling lucky, try letting us <span onClick={() => getRandomMovie()}>find a movie for you</span> or try again!</p>
                                    </div>
                                </div>
                            )
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Discover;