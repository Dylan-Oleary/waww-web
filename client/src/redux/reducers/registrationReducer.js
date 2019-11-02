import { REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE } from '../constants';

const defaultRegistrationState = {
    isRegistering: false
};

export const registrationReducer = ( state = defaultRegistrationState, action ) => {
    switch(action.type){
        case REGISTER_REQUEST :
            return { isRegistering: true };
        case REGISTER_SUCCESS :
            return defaultRegistrationState;
        case REGISTER_FAILURE :
            return defaultRegistrationState;
        default:
            return defaultRegistrationState;
    }
};