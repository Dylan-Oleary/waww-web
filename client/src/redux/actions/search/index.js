import expressServer from '../../../api';

export const getSearchResults = searchTerm => {
    return async dispatch => {
        const response = await expressServer.get("/api/movies/search", {
            params: {
                searchTerm: searchTerm
            }
        });

        dispatch({ type: "GET_SEARCH_RESULTS", payload: response.data });
    }
}

export const clearSearchObject = () => {
    return {
        type: "CLEAR_SEARCH_OBJECT"
    };
}