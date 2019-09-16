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

export const updateUserProfile = (jwt, formValues) => {
    return async dispatch => {
        expressServer.post("/api/users/update", {jwt, formValues})
        .then( response => {
            window.localStorage.setItem('token', response.data.token);

            dispatch({ type: "LOG_SUCCESS", payload: response.data.alert });
            dispatch({ type: "UPDATE_USER_PROFILE", payload: response.data.updatedUser })
        })
        .catch( err => {
            dispatch({ type: "LOG_ERROR", payload: err.response.data.alert });
        })
    }
}

export const updateProfilePicture = (jwt, image) => {
    let data = new FormData();

    data.append('file', image);
    data.append('jwt', jwt);

    return async dispatch => {
        expressServer.post('/api/users/profile-picture', data)
        .then(response => {
            window.localStorage.setItem('token', response.data.token);

            dispatch({ type: "LOG_SUCCESS", payload: response.data.alert });
            dispatch({ type: "UPDATE_USER_PROFILE", payload: response.data.updatedUser })
        })
        .catch( err => {
            console.log("heyeye")
            dispatch({ type: "LOG_ERROR", payload: err.response.data.alert });
        })
    }
}

export const deleteAccount = (jwt) => {
    return async dispatch => {
        expressServer.post("/api/users/delete", {jwt})
        .then( response => {
            window.localStorage.clear();

            navigate("/register");
            dispatch({ type: "LOG_SUCCESS", payload: response.data.alert });
            dispatch({ type: "CLEAR_USER" });
            dispatch({ type: "LOGOUT_REQUEST" });
            dispatch({ type: "CLOSE_MODAL" });
        })
        .catch( err => {
            dispatch({ type: "CLOSE_MODAL" });
            dispatch({ type: "LOG_ERROR", payload: err.response.data.alert });
        })
    }
}