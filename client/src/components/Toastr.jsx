import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faUserSecret as invalidCredentials,
    faUserShield as existingCredentials,
    faPlayCircle as addToWatchList,
    faPauseCircle as removeFromWatchList,
    faHeart as addToFavourites,
    faHeartBroken as removeFromFavourites,
    faEye as addToViewed,
    faEyeSlash as removeFromViewed,
    faCheck as success
} from '@fortawesome/free-solid-svg-icons';

const Toastr = ({ messages, type, alertFor }) => {
    const renderIcon = () => {
        if(type === "success"){
            if(alertFor === "removeFromWatchList"){
                return <FontAwesomeIcon icon={removeFromWatchList} size="2x" />
            }
            if(alertFor === "addToWatchList"){
                return <FontAwesomeIcon icon={addToWatchList} size="2x" />
            }
            if(alertFor === "removeFromFavourites"){
                return <FontAwesomeIcon icon={removeFromFavourites} size="2x" />
            }
            if(alertFor === "addToFavourites"){
                return <FontAwesomeIcon icon={addToFavourites} size="2x" />
            }
            if(alertFor === "removeFromViewed"){
                return <FontAwesomeIcon icon={removeFromViewed} size="2x" />
            }
            if(alertFor === "addToViewed"){
                return <FontAwesomeIcon icon={addToViewed} size="2x" />
            }
            if(alertFor === "deleteAccount"){
                return <FontAwesomeIcon icon={success} />
            }
        }

        if(type === "error"){
            if(alertFor === "existingCredentials"){
                return <FontAwesomeIcon icon={existingCredentials} size="2x" />
            }
            if(alertFor === "invalidCredentials"){
                return <FontAwesomeIcon icon={invalidCredentials} size="2x" />
            }
        }
    }
    
    const renderMessages = () => {
        return messages.map( (message, index) => {
            return <span key={index}>{message}</span>
        })
    }

    return (
        <div id='Toastr' className={`toastr-${type}`}>
            {renderIcon()}
            <div className="toast-message-body">
                {renderMessages()}
            </div>
        </div>
    )
}

export default Toastr;