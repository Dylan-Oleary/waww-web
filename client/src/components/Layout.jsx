import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';

import Nav from './Nav';
import Footer from './Footer';
import { persistSession } from '../redux/actions/session';

const Layout = ({ children, persistSession, login }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if(window.localStorage.getItem("token") && login.isLoggedIn === false){
            const token = window.localStorage.getItem("token");

            persistSession(token).then(() => {
                setIsLoading(false);
            });
        } else {
            setIsLoading(false);
        }
    }, []);

    return (
        <div id="Layout">
            {isLoading && <div className="ui active loader massive"></div>}
            {!isLoading && <Fragment>
                <Nav/>
                <div id="LayoutBody">
                    {children}
                </div>
                <Footer/>
            </Fragment>}
        </div>
    )
}

const mapStateToProps = ({ login }) => {
    return { login };
};

export default connect(mapStateToProps, { persistSession })(Layout);