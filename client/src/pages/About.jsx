import React from 'react';
import { Link } from "react-router-dom";

class About extends React.Component {
    render(){
        return (
            <div id="About">
                ABOUT PAGE
                    <Link to="/">
                    CLICK ME
                    </Link>
            </div>
        )
    }
}

export default About;