import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Toastr = ({ alert }) => {
    return (
        <div id="Toastr">
            <FontAwesomeIcon icon={alert.icon} size="2x" />
            <div className="toast-message-body">
                <span>{alert.message}</span>
            </div>
        </div>
    );
};

export default Toastr;