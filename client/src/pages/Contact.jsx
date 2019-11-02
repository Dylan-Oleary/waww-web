import React from 'react';
import { Link } from "react-router-dom";

class Contact extends React.Component {
    render(){
        return (
            <div id="Contact">
                Contact PAGE
                    <Link to="/">
                    CLICK ME
                    </Link>
            </div>
        )
    }
}

export default Contact;