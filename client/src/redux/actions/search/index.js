import expressServer from '../../../api';
import alertHandler from "../../../utils/alerts";

export const getSearchResults = (searchTerm, page) => {
    return async dispatch => {
        expressServer.get("/api/search", {
            params: {
                searchTerm: searchTerm,
                page: page,
            }
        }).then(response => {
            dispatch({ type: "GET_SEARCH_RESULTS", payload: response.data });
        }).catch(error => {
            const alert = alertHandler(error.response);

            dispatch({ type: "LOG_ERROR", payload: alert });
        });
    };
};

export const setSearch = (searchTerm, page) => {
    return {
        type: "SET_SEARCH",
        payload: {
            searchTerm: searchTerm,
            page: page
        }
    };
};

export const clearSearchObject = () => {
    return { type: "CLEAR_SEARCH_OBJECT" };
};