import expressServer from '../../../api';
import { navigate } from 'hookrouter';

export const getSelectedMovie = movieID => {
    return async dispatch => {
        const response = await expressServer.post("/api/movies", {
            tmdb_id: movieID
        });
        
        dispatch({ type: "GET_SELECTED_MOVIE", payload: response.data })
    }
}

export const clearSelectedMovie = () => {
    return {
        type: "CLEAR_SELECTED_MOVIE"
    };
}

export const removeMovie = movie => {
    return {
        type: 'REMOVE_MOVIE',
        payload: movie
    }
}