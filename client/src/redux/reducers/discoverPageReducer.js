import { GET_DISCOVER_PAGE_CONTENT, SET_FILTERS, SET_BACKDROP, CLEAR_DISCOVER_PAGE } from '../constants';
import { certificationFilters, sortOptions, releaseDateFilters } from '../../constants';

const defaultDiscoverPageProps = {
    id: null,
    name: null,
    slug: null,
    backdropPath: null,
    movies: [],
    filters: {
        releaseDates: releaseDateFilters[0],
        certification: certificationFilters[0]
    },
    sortBy: sortOptions[0],
    page: 1,
    totalPages: null,
    totalResults: null,
    isSearching: false
}

export const discoverPageReducer = (state = defaultDiscoverPageProps, action) => {
    switch(action.type){
        case GET_DISCOVER_PAGE_CONTENT :
            return {
                ...state,
                movies: action.payload.movies,
                totalPages: action.payload.totalPages,
                totalResults: action.payload.totalResults,
                isSearching: false
            };
        case SET_FILTERS : 
            return {
                ...state,
                id: action.payload.id,
                name: action.payload.name,
                slug: action.payload.slug,
                movies: [],
                filters: {
                    releaseDates: action.payload.filters.releaseDates,
                    certification: action.payload.filters.certification
                },
                sortBy: action.payload.sortBy,
                page: action.payload.page,
                isSearching: true
            }
        case SET_BACKDROP :
            return {
                ...state,
                backdropPath: action.payload
            }
        case CLEAR_DISCOVER_PAGE :
            return defaultDiscoverPageProps;
        default :
            return defaultDiscoverPageProps;
    }
}