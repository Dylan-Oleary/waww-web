import expressServer from '../../../api';
import { navigate } from 'hookrouter';

export const registerUser = formValues => {
    return async dispatch => {
        window.localStorage.clear();
        
        dispatch({ type: "REGISTER_REQUEST"});

        const newUser = {...formValues,};

        expressServer.post("/api/users", { newUser })
        .then( response => {
            dispatch({ type: "REGISTER_SUCCESS"});
            dispatch({ type: "LOGIN_REQUEST" });
            navigate("/login");

            const user = response.data;

            expressServer.post("/api/authenticate", { user, formValues })
            .then( response => {
                window.localStorage.setItem('token', response.data.token);
    
                dispatch({ type: "UPDATE_USER", payload: response.data.authenticatedUser});
                dispatch({ type: "LOGIN_SUCCESS" });
                navigate("/");
            })
            .catch( err => {
                dispatch({ type: "LOGIN_FAILURE" });
                dispatch({ type: "LOG_ERROR", payload: err.response.data.alert });
            })
        })
        .catch( err => {
            dispatch({ type: "REGISTER_FAILURE"});
            dispatch({ type: "LOG_ERROR", payload: err.response.data.alert });
        })
    }
}

export const userLogin = (formValues, token) => {
    return async dispatch => {
        dispatch({ type: "LOGIN_REQUEST" });

        const user = formValues === null ? token : {...formValues};

        expressServer.post("/api/authenticate", { user })
        .then( response => {
            window.localStorage.setItem('token', response.data.token);

            dispatch({ type: "UPDATE_USER", payload: response.data.authenticatedUser});
            dispatch({ type: "LOGIN_SUCCESS" });
            dispatch({ type: "LOG_GENERAL" , payload: response.data.alert });
            
            navigate("/");
        })
        .catch( err => {
            dispatch({ type: "LOGIN_FAILURE" });
            dispatch({ type: "LOG_ERROR", payload: err.response.data.alert});
        })
    }
}

export const userLogout = () => {
    return async dispatch => {
        //Clear JWT
        window.localStorage.clear();

        //Log User Out
        dispatch({ type: "LOGOUT_REQUEST" });
        dispatch({ type: "CLEAR_USER" });
        dispatch({ 
            type: "LOG_SUCCESS", 
            payload: {
                alertFor: "userLogout",
                alertMessages: ["Logout Successful!"]
            } 
        });

        navigate("/");
    }
}

export const persistUser = (jwt, currentPath) => {
    return async dispatch => {
        expressServer.post("/api/persist", {jwt, currentPath })
        .then( response => {
            const { authenticatedUser } = response.data;

            dispatch({ type: "LOGIN_SUCCESS"});
            dispatch({ type: "UPDATE_USER", payload: authenticatedUser });

            navigate(currentPath);
        })
        .catch( err => {
            dispatch({ type: "CLEAR_USER" });
            dispatch({ type: "LOG_ERROR", payload: err.response.data.alert });
            window.localStorage.clear();
            navigate("/login");
        })

    }
}