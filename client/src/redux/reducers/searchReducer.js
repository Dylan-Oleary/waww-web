export const searchReducer = (searchObject = {currentSearch: '', searchResults: [] }, action) => {
    const emptySearch = {
        currentSearch: '',
        searchResults: []
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