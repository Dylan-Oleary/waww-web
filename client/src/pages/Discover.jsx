import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { navigate } from 'hookrouter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThList as withSynopsis, faTh as withoutSynopsis } from '@fortawesome/free-solid-svg-icons';

import { getDiscoverPageContent, setFilters, setBackdrop } from '../redux/actions/pages/discover';
import { getRandomMovie } from '../redux/actions/movies';
import { certificationFilters, genres, releaseDateFilters, sortOptions } from '../constants';
import ListViewCard from '../components/ListViewCard';
import SearchResultsCard from '../components/SearchResultCard';
import Pagination from '../components/Pagination';
import CustomSelect from '../components/CustomSelect';
import Logo from '../public/assets/images/error-ticket.svg';

const Discover = ({ params, backdropPath, filters, totalPages, isSearching, movies, getDiscoverPageContent, setFilters, setBackdrop, getRandomMovie }) => {
    const { id, name, releaseDates, certification, sortBy, page } = filters;
    const [resultViewWithSynopsis, setResultViewWithSynopsis] = useState(false);

    useEffect(() => {
        for(let i = 0; i < genres.length; i++){
            if(params.slug === genres[i].slug){
                setBackdrop(genres[i].backdropPath)

                params = { ...params, id: genres[i].id, genre: genres[i].name };
                break;
            }
        }

        window.scrollTo(0, 0);
        setFilters({ ...filters, id: params.id, slug: params.slug, name: params.genre });

        // return () => clearDiscoverPage()
    },[params])

    useEffect(() => {
        if(id){
            if(window.scrollY > 300){
                window.scrollTo(0, 300);
            }
            getDiscoverPageContent(filters);
        }
    }, [releaseDates, certification, sortBy, page])

    useEffect(() => {
        if(id){
            window.scrollTo(0, 0);
            getDiscoverPageContent(filters);
        }
    }, [id])

    const onFilterChange = (newFilter, currentFilter, type) => {
        if(newFilter.id !== currentFilter.id){
            type === 0 ? setFilters({ ...filters, releaseDates: releaseDateFilters[newFilter.id], page: 1}) : setFilters({ ...filters, certification: certificationFilters[newFilter.id], page: 1})
        }
    }

    const renderHeader = () => <div className="discover-header" style={{ backgroundImage: `url(${backdropPath})`, backgroundSize: 'cover'}}>{ name ? <h2>{name}</h2> : <div className="ui active loader massive"></div>}</div>

    const renderFilters = () => {
        return (
            <div className="discover-filter-wrapper">
                <div className="filters">
                    <div className="filter-category">
                        <h3>Genre</h3>
                        <CustomSelect options={genres} initial={name} onChange={onGenreChange} column={false} size={"regular"} />
                    </div>
                    <div className="filter-category">
                        <h3>Release Year</h3>
                            {releaseDateFilters.map(filter => {
                                return (
                                    <div className={releaseDates.id === filter.id ? 'active filter-field' : 'filter-field'} onClick={() => onFilterChange(filter, releaseDates, 0)} >
                                        <label>{filter.title}</label>
                                    </div>
                                )
                            })}
                    </div>
                    <div className="filter-category">
                        <h3>Certification</h3>
                            {certificationFilters.map(filter => {
                                return (
                                    <div className={certification.id === filter.id ? 'active filter-field' : 'filter-field'} onClick={() => onFilterChange(filter, certification, 1)} >
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
                <Pagination initialPage={parseInt(page)} totalPages={totalPages} changePage={onPageChange} />
                <div className="sort-options">
                    <label>Sort By: </label>
                    <CustomSelect options={sortOptions} initial={sortBy.name} onChange={onSortChange} column={true} size="small" background={true} />
                </div>
            </div>
        )
    }

    const onSortChange = option => {
        if(option.id !== sortBy.id){
            setFilters({ ...filters, sortBy: sortOptions[option.id], page: 1})
        }
    }

    const renderMovies = () => {
        return (
            <div className="discover-content-body">
                {movies.map(movie => resultViewWithSynopsis ? <SearchResultsCard movie={movie} /> : <ListViewCard movie={movie} />)}
            </div>
        )
    }

    const onPageChange = newPage => {
        setFilters({ ...filters, page: newPage})
    }

    const onGenreChange = genre => {
        navigate(`/discover/${genre.slug}`);
    }

    return (
        <div id="Discover">
            {renderHeader()}
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
                                        <img src={Logo} required />
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

const mapStateToProps = ({ discoverPage }) => {
    return {
        movies: discoverPage.movies,
        filters: {
            id: discoverPage.id,
            name: discoverPage.name,
            slug: discoverPage.slug,
            releaseDates: discoverPage.filters.releaseDates,
            certification: discoverPage.filters.certification,
            sortBy: discoverPage.sortBy,
            page: discoverPage.page
        },
        totalPages: discoverPage.totalPages,
        totalResults: discoverPage.totalResults,
        isSearching: discoverPage.isSearching,
        backdropPath: discoverPage.backdropPath
    };
}

export default connect(mapStateToProps, { getDiscoverPageContent, setFilters, getRandomMovie, setBackdrop })(Discover);