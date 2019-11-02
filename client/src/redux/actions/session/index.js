import expressServer from '../../../api';
import alertHandler from "../../../utils/alerts";

export const registerUser = formData => {
    return async dispatch => {
        window.localStorage.clear();
        
        dispatch({ type: "REGISTER_REQUEST"});

        const newUser = { ...formData };

        expressServer.post("/api/register", {
            newUser 
        }).then(response => {
            const alert = alertHandler(response);
            const { authenticatedUser, token } = response.data;

            window.localStorage.setItem("token", token);

            dispatch({ type: "REGISTER_SUCCESS" });
            dispatch({ type: "UPDATE_USER", payload: authenticatedUser });
            dispatch({ type: "LOGIN_SUCCESS"});
            dispatch({ type: "LOG_SUCCESS", payload: alert });
        }).catch(error => {
            const alert = alertHandler(error.response);

            window.localStorage.clear();
            dispatch({ type: "REGISTER_FAILURE" });
            dispatch({ type: "LOG_ERROR", payload: alert });
        });
    };
};

export const authenticateUser = formData => {
    return async dispatch => {
        dispatch({ type: "LOGIN_REQUEST" });

        const user = { ...formData };

        expressServer.post("/api/authenticate", {
            user 
        }).then(response => {
            const { authenticatedUser, token } = response.data;

            window.localStorage.setItem("token", token);

            dispatch({ type: "UPDATE_USER", payload: authenticatedUser });
            dispatch({ type: "LOGIN_SUCCESS" });
        }).catch(error => {
            const alert = alertHandler(error.response);

            window.localStorage.clear();
            dispatch({ type: "LOG_ERROR", payload: alert });
            dispatch({ type: "LOGIN_FAILURE" });
        });
    };
};

export const userLogout = () => {
    return async dispatch => {

        const alert = alertHandler({
            status: 200,
            data : {
                message: "You have been successfully logged out!"
            }
        });

        window.localStorage.clear();

        dispatch({ type: "LOGOUT_REQUEST" });
        dispatch({ type: "CLEAR_USER" });
        dispatch({ type: "LOG_SUCCESS", payload: alert });
    };
};

export const persistSession = token => {
    return async dispatch => {
        expressServer.get("/api/", {
            headers: {
                "Authorization": token
            }
        }).then(response => {
            const { authenticatedUser, token } = response.data;

            window.localStorage.setItem("token", token);
            dispatch({ type: "UPDATE_USER", payload: authenticatedUser });
            dispatch({ type: "LOGIN_SUCCESS"});
        }).catch(error => {
            const alert = alertHandler(error.response);

            window.localStorage.clear();
            dispatch({ type: "LOG_ERROR", payload: alert });
        });
    };
};