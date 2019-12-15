import expressServer from '../../../api';
import alertHandler from "../../../utils/alerts";

export const getSelectedMovie = movieID => {
    return async dispatch => {
        expressServer.get(`/api/movies/${movieID}`).then(response => {
            dispatch({ type: "GET_SELECTED_MOVIE", payload: response.data })
        }).catch(error => {
            const alert = alertHandler(error.respponse);

            dispatch({ type: "LOG_ERROR", payload: alert });
        });
    };
};

export const clearSelectedMovie = () => {
    return { type: "CLEAR_SELECTED_MOVIE" };
};

export const removeMovie = movie => {
    return {
        type: 'REMOVE_MOVIE',
        payload: movie
    };
};

export const addReviewToMovie = (token, formData, movieID) => {
    return async dispatch => {
        expressServer.post(`/api/movies/${movieID}/reviews`, {
            formData
        }, {
            headers: {
                "Authorization": token
            }
        }).then(response => {
            const alert = alertHandler(response);

            window.localStorage.setItem("token", response.data.token);

            return Promise.all([
                expressServer.get(`/api/movies/${movieID}`),
                expressServer.get(`/api/users/${response.data.newReview.userID}`, {
                    headers: {
                        "Authorization": token
                    }
                })
            ]).then(([
                movie,
                userRecord
            ]) => {
                dispatch({ type: "UPDATE_SELECTED_MOVIE", payload: movie.data });
                dispatch({ type: "UPDATE_USER", payload: userRecord.data.user });
                dispatch({ type: "LOG_SUCCESS", payload: alert });
            });
        }).catch(error => {
            const alert = alertHandler(error.response);

            dispatch({ type: "LOG_ERROR", payload: alert });
        });
    };
};

export const editReviewForMovie = (token, formData, movieID) => {
    return async dispatch => {
        expressServer.put(`/api/movies/${movieID}/reviews/${formData._id}`, {
            formData
        }, {
            headers: {
                "Authorization": token
            }
        }).then(response => {
            const alert = alertHandler(response);

            window.localStorage.setItem("token", response.data.token);

            return Promise.all([
                expressServer.get(`/api/movies/${movieID}`),
                expressServer.get(`/api/users/${response.data.updatedReview.userID}`, {
                    headers: {
                        "Authorization": token
                    }
                })
            ]).then(([
                movie,
                userRecord
            ]) => {
                dispatch({ type: "UPDATE_SELECTED_MOVIE", payload: movie.data });
                dispatch({ type: "UPDATE_USER", payload: userRecord.data.user });
                dispatch({ type: "LOG_SUCCESS", payload: alert });
            });
        }).catch(error => {
            const alert = alertHandler(error.response);

            dispatch({ type: "LOG_ERROR", payload: alert });
        });
    }
};

export const deleteReviewForMovie = (token, movieID, reviewID) => {;
    return async dispatch => {
        expressServer.delete(`/api/movies/${movieID}/reviews/${reviewID}`, {
            headers: {
                "Authorization": token
            }
        }).then(response => {
            const alert = alertHandler(response);

            return Promise.all([
                expressServer.get(`/api/movies/${movieID}`),
                expressServer.get(`/api/users/${response.data.deletedReview.userID}`, {
                    headers: {
                        "Authorization": token
                    }
                })
            ]).then(([
                movie,
                userRecord
            ]) => {
                dispatch({ type: "UPDATE_SELECTED_MOVIE", payload: movie.data });
                dispatch({ type: "UPDATE_USER", payload: userRecord.data.user });
                dispatch({ type: "LOG_SUCCESS", payload: alert });
            });
        }).catch(error => {
            const alert = alertHandler(error.response);

            dispatch({ type: "LOG_ERROR", payload: alert });
        });
    };
};

export const getNowPlaying = () => {
    return async dispatch => {
        expressServer.get('/api/movies/now-playing').then( response => {
            dispatch({ type: "GET_NOW_PLAYING", payload: response.data });
        }).catch(error => {
            const alert = alertHandler(error.response);

            dispatch({ type: "LOG_ERROR", payload: alert });
        });
    };
};

export const getPopular = () => {
    return async dispatch => {
        expressServer.get('/api/movies/popular').then(response => {
            dispatch({ type: "GET_POPULAR", payload: response.data });
        }).catch(error => {
            const alert = alertHandler(error.response);

            dispatch({ type: "LOG_ERROR", payload: alert });
        });
    };
};

export const getTopRated = () => {
    return async dispatch => {
        expressServer.get('/api/movies/top-rated').then(response => {
            dispatch({ type: "GET_TOP_RATED", payload: response.data })
        }).catch(error => {
            const alert = alertHandler(error.response);

            dispatch({ type: "LOG_ERROR", payload: alert });
        });
    };
};

export const getUpcoming = () => {
    return async dispatch => {
        expressServer.get('/api/movies/upcoming').then(response => {
            dispatch({ type: "GET_UPCOMING", payload: response.data });
        }).catch(error => {
            const alert = alertHandler(error.response);

            dispatch({ type: "LOG_ERROR", payload: alert });
        });
    };
};

export const getClassics = () => {
    return async dispatch => {
        expressServer.get('/api/movies/classics').then(response => {
            dispatch({ type: "GET_CLASSICS", payload: response.data });
        }).catch(error => {
            const alert = alertHandler(error.response);

            dispatch({ type: "LOG_ERROR", payload: alert });
        });
    };
}

export const getHomePageContent = () => {
    return async dispatch => {
        Promise.all([
            expressServer.get("/api/movies/classics"),
            expressServer.get("/api/movies/upcoming"),
            expressServer.get("/api/movies/top-rated"),
            expressServer.get("/api/movies/popular"),
            expressServer.get("/api/movies/now-playing")
        ]).then(([
            { data: { classics = [] }},
            { data: { upcoming = [] }},
            { data: { topRated = [] }},
            { data: { popular = [] }},
            { data: { nowPlaying = [] }}
        ]) => {
            dispatch({
                type: "GET_HOMEPAGE_CONTENT",
                payload: {
                    classics: classics,
                    upcoming: upcoming,
                    topRated: topRated,
                    popular: popular,
                    nowPlaying: nowPlaying
                }
            });
        }).catch(error => {
            console.error(error);

            dispatch({
                type: "HOMEPAGE_ERROR",
                payload: { hasError: true }
            });
        });
    };
};