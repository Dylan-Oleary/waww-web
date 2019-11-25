import React, { Fragment } from 'react';
import { Image } from "semantic-ui-react";
import { genres, userNavItems } from "../../constants";

import NavLink from "./NavLink";
import SearchBar from "../SearchBar";

const DesktopNav = ({ isLoggedIn, user, userLogout }) => {
    const logoutButton = ref => {
        const handleClick = () => {
            ref.current.className = "nav-link";
            userLogout();
        };

        return (
            <span className="pointer shadow" onClick={handleClick}>Log Out</span>
        );
    }

    return (
        <div id="DesktopNav">
            <div className="flex align-center nav-wrapper desktop">
                <NavLink 
                    path="/"
                    label="Home"
                />
                <NavLink
                    path="/discover/"
                    label="Discover"
                    children={genres}
                    childClasses={"left w-425"}
                />
                {isLoggedIn && <NavLink
                    path="/users/movies"
                    label="My Movies"
                />}
                <div className="flex">
                    <SearchBar className="desktop" />
                </div>
                {isLoggedIn ?
                    (
                        <Fragment>
                            <Image
                                src={user.profilePicture.secureURL}
                                className="shadow circle"
                                avatar
                            />
                            <NavLink
                                path="/users/"
                                label={user.username}
                                children={userNavItems}
                                childClasses={"right column w-dynamic"}
                                button={logoutButton}
                            />
                        </Fragment>
                    ) : (
                        <Fragment>
                            <NavLink 
                                path="/register"
                                label="Register"
                            />
                            <NavLink 
                                path="/login"
                                label="Login"
                            />
                        </Fragment>
                    )
                }
            </div>
        </div>
    );
};

export default DesktopNav;