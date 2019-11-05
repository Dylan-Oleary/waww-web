import React from "react";
import { Icon } from "semantic-ui-react";

const ShowPasswordToggle = ({ text, onToggle, isHidingPassword }) => {
    return (
        <div className="flex between">
            <label>
                {text}
            </label>
            <Icon
                className="right floated"
                name={isHidingPassword ? "eye" : "eye slash"} 
                onClick={() => onToggle(isHidingPassword ? false : true)}
            />
        </div>
    );
};

export default ShowPasswordToggle;