import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_REQUEST} from '../constants';

const defaultLoginState = {
    isAttemptingLogin: false,
    isLoggedIn: false
};

export const loginReducer = (state = defaultLoginState, action) => {
    switch(action.type){
        case LOGIN_REQUEST :
            return { 
                isAttemptingLogin: true, 
                isLoggedIn: false
            };
        case LOGIN_SUCCESS :
            return {
                isAttemptingLogin: false,
                isLoggedIn: true 
            };
        case LOGIN_FAILURE :
            return defaultLoginState;
        case LOGOUT_REQUEST :
            return defaultLoginState;
        default :
            return state;
    }
};