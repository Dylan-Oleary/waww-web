import {
    faCheck as successCheck
} from "@fortawesome/free-solid-svg-icons";

const successHandler = success => {
    let icon;
 
    switch(success.status){
        case 200 : 
            icon = successCheck;;
            break;
        case 201 : 
            icon = successCheck;
            break;
        default : 
            icon = null;
            break;
    }

    const alert = {
        status: success.status,
        message: success.data.message,
        icon: icon,
        type: "success"
    };

    return alert;
}

export default successHandler;
