export const userReducer = ( user={}, action ) => {
    switch(action.type){
        case "UPDATE_USER" :
            return action.payload;
        case "UPDATE_USER_PROFILE":
            return action.payload;
        case "CLEAR_USER" :
            return {};
        default :
            return user;
    }
}