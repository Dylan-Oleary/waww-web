import React from 'react';
import { A } from 'hookrouter';

class About extends React.Component {
    router = () => {

    }

    render(){
        return (
            <div id="About">
                ABOUT PAGE
                    <A href="/">
                    CLICK ME
                    </A>
            </div>
        )
    }
}

export default About;