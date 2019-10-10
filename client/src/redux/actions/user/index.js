import expressServer from '../../../api';
import { navigate } from 'hookrouter';

export const updateWatchList = (jwt, movie) => {
    return async dispatch => {
        expressServer.post("/api/users/watchlist", {jwt, movie})
        .then( response => {
            dispatch({ type: "LOG_SUCCESS", payload: response.data.alert });

            expressServer.get("/api/users", {
                params: { jwt }
            })
            .then( response => {
                dispatch({ type: "UPDATE_USER", payload: response.data.authenticatedUser });
            })
            .catch( err => {
                dispatch({ type: "LOG_ERROR", payload: err.response.data.alert });
            })  
        })
        .catch( err => {
            dispatch({ type: "LOG_ERROR", payload: err.response.data.alert });
        })
    }
}

export const updateFavourites = (jwt, movie) => {
    return async dispatch => {
        expressServer.post("/api/users/favourites", {jwt, movie})
        .then( response => {
            dispatch({ type: "LOG_SUCCESS", payload: response.data.alert });

            expressServer.get("/api/users", {
                params: { jwt }
            })
            .then( response => {
                dispatch({ type: "UPDATE_USER", payload: response.data.authenticatedUser });
            })
            .catch( err => {
                dispatch({ type: "LOG_ERROR", payload: err.response.data.alert });
            }) 
        })
        .catch( err => {
            dispatch({ type: "LOG_ERROR", payload: err.response.data.alert });
        })
    }    
}

export const updateViewed = (jwt, movie) => {
    return async dispatch => {
        expressServer.post("/api/users/viewed", {jwt, movie})
        .then( response => {
            dispatch({ type: "LOG_SUCCESS", payload: response.data.alert });

            expressServer.get("/api/users", {
                params: { jwt }
            })
            .then( response => {
                dispatch({ type: "UPDATE_USER", payload: response.data.authenticatedUser });
            })
            .catch( err => {
                dispatch({ type: "LOG_ERROR", payload: err.response.data.alert });
            })
        })
        .catch( err => {
            dispatch({ type: "LOG_ERROR", payload: err.response.data.alert });
        })
    }
}

export const updateUserProfile = (token, userID, formValues) => {
    return async dispatch => {
        expressServer.put(`/api/users/${userID}`, { formValues }, {
            headers: {
                Authorization: token
            }
        }).then(response => {
            window.localStorage.setItem("token", response.data.token);

            dispatch({ type: "LOG_SUCCESS" });
            dispatch({ type: "UPDATE_USER_PROFILE", payload: response.data.user })
        }).catch(error => {
            dispatch({ type: "LOG_ERROR", payload: error.response.data.alert });
        });
    };
};

export const updateProfilePicture = (token, userID, image) => {
    let data = new FormData();

    data.append("file", image);

    return async dispatch => {
        expressServer.put(`/api/users/${userID}`, data, {
            headers: {
                Authorization: token
            }
        }).then(response => {
            window.localStorage.setItem("token", response.data.token);

            dispatch({ type: "LOG_SUCCESS" });
            dispatch({ type: "UPDATE_USER_PROFILE", payload: response.data.user });
            dispatch({ type: "CLOSE_MODAL" });
        }).catch(error => {
            dispatch({ type: "LOG_ERROR", payload: error.response.data.alert });
        });
    };
};

export const deleteAccount = (token, userID) => {
    return async dispatch => {
        expressServer.delete(`/api/users/${userID}`, {
            headers: {
                "Authorization": token
            }
        }).then(response => {
            window.localStorage.clear();

            navigate("/register");
            dispatch({ type: "LOG_SUCCESS" });
            dispatch({ type: "CLEAR_USER" });
            dispatch({ type: "LOGOUT_REQUEST" });
            dispatch({ type: "CLOSE_MODAL" });
        }).catch(error => {
            dispatch({ type: "CLOSE_MODAL" });
        });
    };
};