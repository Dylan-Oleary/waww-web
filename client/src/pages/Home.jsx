import React from 'react';
import { A } from 'hookrouter';

class Home extends React.Component {
    router = () => {

    }

    render(){
        return (
            <div id="Home">
                HOME PAGE
                    <A href="/about">
                    CLICK ME
                    </A>
            </div>
        )
    }
}

export default Home;