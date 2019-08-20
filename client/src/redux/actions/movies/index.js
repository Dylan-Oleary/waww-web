import expressServer from '../../../api';

export const getSelectedMovie = movieID => {
    return async dispatch => {
        const response = await expressServer.post("/api/movies", {
            tmdb_id: movieID
        });
        
        dispatch({ type: "GET_SELECTED_MOVIE", payload: response.data })
    }
}

export const clearSelectedMovie = () => {
    return { type: "CLEAR_SELECTED_MOVIE" };
}

export const removeMovie = movie => {
    return {
        type: 'REMOVE_MOVIE',
        payload: movie
    }
}

export const getNowPlaying = () => {
    return async dispatch => {
        expressServer.get('/api/movies/now-playing')
        .then( response => {
            dispatch({ type: "GET_NOW_PLAYING", payload: response.data });
        })
        .catch( err => {
            dispatch({ type: "LOG_ERROR", payload: err.response.data.alert });
        })
    }
}

export const getPopular = () => {
    return async dispatch => {
        expressServer.get('/api/movies/popular')
        .then( response => {
            dispatch({ type: "GET_POPULAR", payload: response.data });
        })
        .catch( err => {
            dispatch({ type: "LOG_ERROR", payload: err.response.data.alert });
        })
    }
}

export const getTopRated = () => {
    return async dispatch => {
        expressServer.get('/api/movies/top-rated')
        .then( response => {
            dispatch({ type: "GET_TOP_RATED", payload: response.data })
        })
        .catch( err => {
            dispatch({ type: "LOG_ERROR", payload: err.response.data.alert });
        })
    }
}

export const getUpcoming = () => {
    return async dispatch => {
        expressServer.get('/api/movies/upcoming')
        .then( response => {
            dispatch({ type: "GET_UPCOMING", payload: response.data });
        })
        .catch( err => {
            dispatch({ type: "LOG_ERROR", payload: err.response.data.alert });
        })
    }
}