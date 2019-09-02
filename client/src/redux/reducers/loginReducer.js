import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_REQUEST} from '../constants';

export const loginReducer = (state = {isLoggedIn: false}, action) => {
    switch(action.type){
        case LOGIN_REQUEST :
            return { isLoggingIn: true, isLoggedIn: false};
        case LOGIN_SUCCESS :
            return { isLoggedIn: true };
        case LOGIN_FAILURE :
            return { isLoggedIn: false };
        case LOGOUT_REQUEST :
            return { isLoggedIn: false };
        default :
            return state;
    }
}