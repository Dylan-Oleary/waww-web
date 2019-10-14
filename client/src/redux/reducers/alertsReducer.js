import { LOG_ALERT, LOG_ERROR } from '../constants';

const defaultAlert = {
    status: null,
    message: "",
    icon: "",
    type: ""
}

export const alertsReducer = (state = defaultAlert , action) => {
    switch(action.type){
        case LOG_ALERT :
            return action.payload;
        case LOG_ERROR :
            return action.payload;
        default :
            return state;
    }
}