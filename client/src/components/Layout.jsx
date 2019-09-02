import React from 'react';
import Nav from './Nav';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div id="Layout">
            <Nav/>
            <div id="LayoutBody">
                {children}
            </div>
            <Footer/>
        </div>
    )
}

export default Layout;