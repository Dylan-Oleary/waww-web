import React, { useEffect, useState, useRef, Fragment } from 'react';
import { connect } from 'react-redux';

import { genres } from "../../constants";
import { userLogout } from '../../redux/actions/session';
import MobileNav from './MobileNav';
import DesktopNav from './DesktopNav';

const Nav = ({ user, isLoggedIn, userLogout }) => {
    const windowWidth = useRef(window.window.innerWidth);
    const [isMobile, setIsMobile] = useState(window.window.innerWidth < 768 ? true : false);

    useEffect(() => {
        window.addEventListener('resize', () => setWindowWidth(window.window.innerWidth));

        return () => window.removeEventListener('resize', () => setWindowWidth(window.window.innerWidth));

    }, []);

    const setWindowWidth = width => {
        const previousWidth = windowWidth.current;

        windowWidth.current = width;
        
        if(windowWidth.current < 768 && previousWidth >= 768){
            setIsMobile(true);
        }
        if(windowWidth.current >= 768 && previousWidth < 768){
            setIsMobile(false);
        }
    };

    return (
        <Fragment>
            {isMobile ? (
                <MobileNav
                    genres={genres}
                    isLoggedIn={isLoggedIn}
                    user={user}
                    userLogout={userLogout}
                />
            ) : (
                <DesktopNav
                    genres={genres}
                    isLoggedIn={isLoggedIn}
                    user={user}
                    userLogout={userLogout}
                />
            )}
        </Fragment>
    );
};

const mapStateToProps = ({ login, user }) => {
    return {
        isLoggedIn: login.isLoggedIn,
        user: {
            username: user.username,
            profilePicture: user.profilePicture
        }
    };
};

export default connect(mapStateToProps, { userLogout })(Nav);