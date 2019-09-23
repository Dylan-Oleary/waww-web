import { navigate } from 'hookrouter';
import expressServer from '../../../api';

export const getSelectedMovie = movieID => {
    return async dispatch => {
        const response = await expressServer.post("/api/movies", {
            tmdb_id: movieID
        });
        
        dispatch({ type: "GET_SELECTED_MOVIE", payload: response.data })
    }
}

export const getRandomMovie = () => {
    return async dispatch => {
        expressServer.get("/api/movies/random")
        .then( response => {
            const { movie } = response.data;
            navigate(`/movies/${movie.id}`)
        })
        .catch( err => {
            dispatch({ type: "LOG_ERROR", payload: err.response.data.alert });
        })
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

export const addReviewToMovie = (jwt, formData, user, movieID) => {
    return async dispatch => {
        expressServer.post(`/api/movies/${movieID}/reviews`, {
            jwt,
            formData,
            user
        })
        .then(response => {
            window.localStorage.setItem("token", response.data.token);

            dispatch({ type: "UPDATE_USER_PROFILE", payload: response.data.userRecord });
            dispatch({ type: "UPDATE_SELECTED_MOVIE", payload: response.data.movieRecord });
            dispatch({ type: "LOG_SUCCESS", payload: response.data.alert });
        }).catch(err => {
            dispatch({ type: "LOG_ERROR", payload: err.response.data.alert });
        })
    }
};

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