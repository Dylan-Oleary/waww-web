import { LOG_ERROR, CLEAR_ALERTS, LOG_SUCCESS, LOG_GENERAL } from '../constants';

const defaultAlertObject = {
    success: {},
    error: {},
    general: {}
}

export const alertsReducer = (state = defaultAlertObject , action) => {
    switch(action.type){
        case LOG_ERROR :
            return {...defaultAlertObject, error: action.payload};
        case CLEAR_ALERTS :
            return defaultAlertObject;
        case LOG_SUCCESS :
            return {...defaultAlertObject, success: action.payload};
        case LOG_GENERAL :
            return {...defaultAlertObject, general: action.payload};
        default:
            return state;
    }
}