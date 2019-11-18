import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';

import { genres } from "../../constants";
import { userLogout } from '../../redux/actions/session';
import MobileNav from './MobileNav';
import DesktopNav from './DesktopNav';

const Nav = ({ user, isLoggedIn, userLogout }) => {
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        if(windowWidth === 0){
            window.addEventListener('resize', () => setWindowWidth(window.window.innerWidth));
        }

        return () => window.removeEventListener('resize', () => setWindowWidth(window.window.innerWidth));

    }, [windowWidth]);

    return (
        <Fragment>
            {windowWidth < 768 ? (
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