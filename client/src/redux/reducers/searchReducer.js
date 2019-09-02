import { SET_SEARCH, GET_SEARCH_RESULTS, SET_IS_SEARCHING, CLEAR_SEARCH_OBJECT } from '../constants';

const defaultSearchObject = {
    currentSearch: null, 
    searchResults: [],
    isSearching: true,
    currentPage: null, 
    totalPages: null, 
    totalResults: null
}

export const searchReducer = (state = defaultSearchObject, action) => {
    switch(action.type){
        case SET_SEARCH :
            return {
                ...state,
                currentSearch: action.payload.searchTerm,
                currentPage: action.payload.page,
                isSearching: true
            }
        case GET_SEARCH_RESULTS :
            return {
                ...state,
                searchResults: action.payload.searchResults,
                totalPages: action.payload.totalPages, 
                totalResults: action.payload.totalResults,
                isSearching: false
            };
        case SET_IS_SEARCHING :
            return {
                ...state,
                isSearching: action.payload
            }
        case CLEAR_SEARCH_OBJECT :
            return defaultSearchObject;
        default:
            return defaultSearchObject;
    }
}