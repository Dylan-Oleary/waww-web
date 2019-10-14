import {
    faUserSecret as invalidCredentials,
    faUserShield as existingCredentials,
    faBomb as databaseError
} from "@fortawesome/free-solid-svg-icons";

const errorHandler = error => {
    let icon;
 
    switch(error.status){
        case 400 :
            icon = databaseError;
            break;
        case 401 :
            icon = invalidCredentials;
            break;
        case 409 :
            icon = existingCredentials;
            break;
        case 500 :
            icon = databaseError;
            break;
        case 502: 
            icon = databaseError;
            break;
        default : 
            icon = null;
            break;
    }

    const alert = {
        status: error.status,
        message: error.data.message,
        icon: icon,
        type: "error"
    };

    return alert;
}

export default errorHandler;
