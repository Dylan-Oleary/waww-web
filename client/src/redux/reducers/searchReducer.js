export const searchReducer = (searchObject = {currentSearch: '', searchResults: [], currentPage: null, totalPages: null, totalResults: null }, action) => {
    const emptySearch = {
        currentSearch: '',
        searchResults: [],
        currentPage: null,
        totalPages: null,
        totalResults: null
    };

    switch(action.type){
        case 'GET_SEARCH_RESULTS':
            return action.payload;
        case 'CLEAR_SEARCH_OBJECT':
            return emptySearch;
        default:
            return searchObject;
    }
}