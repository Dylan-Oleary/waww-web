import expressServer from '../../../api';

export const getSelectedGenre = id => {
    return async dispatch => {
        expressServer.get(`/api/genres/${id}`)
        .then( response => {
            const payload = {
                id: response.data.id,
                page: response.data.page,
                movies: response.data.results
            }

            dispatch({ type: "GET_SELECTED_GENRE", payload: payload })
        })
        .catch( err => {
            dispatch({ type: "LOG_ERROR", payload: err.response.data.alert });
        })
    }
}

export const clearSelectedGenre = () => {
    return { type: "CLEAR_SELECTED_GENRE" };
}