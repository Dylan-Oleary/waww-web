export const registrationReducer = ( state = {}, action ) => {
    switch(action.type){
        case "REGISTER_REQUEST":
            return { isRegistering: true};
        case "REGISTER_SUCCESS":
            return {};
        case "REGISTER_FAILURE":
            return {};
        default:
            return state;
    }
}