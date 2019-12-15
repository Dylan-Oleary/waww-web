import { LOG_ALERT, LOG_ERROR, LOG_SUCCESS } from '../constants';

const defaultAlert = {
    status: null,
    message: "",
    icon: "",
    type: ""
}

export const alertsReducer = (state = defaultAlert , action) => {
    console.log(action)
    switch(action.type){
        case LOG_ALERT :
            return action.payload;
        case LOG_ERROR :
            return action.payload;
        case LOG_SUCCESS :
            return action.payload;
        default :
            return state;
    }
}