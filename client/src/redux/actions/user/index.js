import { navigate } from 'hookrouter';

import expressServer from '../../../api';
import errorHandler from '../../../utils/errorHandler';

export const addToUserList = (token, listType, movie, userID) => {
    return async dispatch => {
        expressServer.post(`/api/users/${userID}/${listType}`, movie, {
            headers: {
                Authorization: token
            }
        }).then(response => {
            window.localStorage.setItem("token", response.data.token);
            
            dispatch({ type: "UPDATE_USER", payload: response.data.user });
        }).catch(error => {
            const alert = errorHandler(error);

            dispatch({ type: "LOG_ERROR", payload: alert });
        })
    }
}

export const removeFromUserList = (token, listType, movie, userID) => {
    return async dispatch => {
        expressServer.delete(`/api/users/${userID}/${listType}/${movie._id}`, {
            headers: {
                Authorization: token
            }
        }).then(response => {
            window.localStorage.setItem("token", response.data.token);

            dispatch({ type: "UPDATE_USER", payload: response.data.user });
        }).catch(error => {
            const alert = errorHandler(error);

            dispatch({ type: "LOG_ERROR", payload: alert });
        });
    };
};

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
            const alert = errorHandler(error);

            dispatch({ type: "LOG_ERROR", payload: alert });
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
            const alert = errorHandler(error);

            dispatch({ type: "LOG_ERROR", payload: alert });
        });
    };
};

export const deleteAccount = (token, userID) => {
    return async dispatch => {
        expressServer.delete(`/api/users/${userID}`, {
            headers: {
                "Authorization": token
            }
        }).then(() => {
            window.localStorage.clear();

            navigate("/register");
            dispatch({ type: "LOG_SUCCESS" });
            dispatch({ type: "CLEAR_USER" });
            dispatch({ type: "LOGOUT_REQUEST" });
            dispatch({ type: "CLOSE_MODAL" });
        }).catch(error => {
            const alert = errorHandler(error);

            dispatch({ type: "LOG_ERROR", payload: alert });
            dispatch({ type: "CLOSE_MODAL" });
        });
    };
};