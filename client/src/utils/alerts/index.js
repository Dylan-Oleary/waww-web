import errorHandler from "./errorHandler";
import successHandler from "./successHandler";

const alertHandler = alert => {
    const statusCode = String(alert.status);

    if(statusCode.charAt(0) === "4" || statusCode.charAt(0)  === "5"){
        return errorHandler(alert);
    }
    if(statusCode.charAt(0) === "2"){
        return successHandler(alert);
    }
};

export default alertHandler;