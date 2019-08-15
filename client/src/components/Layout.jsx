import React from 'react';
import Nav from './Nav';
import Footer from './Footer';

class Layout extends React.Component {
    render(){
        return (
            <div id="Layout">
                <Nav/>
                <div id="LayoutBody">
                    {this.props.children}
                </div>
                <Footer/>
            </div>
        )
    }
}

export default Layout;