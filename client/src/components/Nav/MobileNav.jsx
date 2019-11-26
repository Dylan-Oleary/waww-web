import React, { useState, Fragment } from 'react';
import { useHistory } from "react-router-dom";
import { Image } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons"

import mobileLogo from "../../public/assets/images/inverted-logo.svg"

import NavLink from "./NavLink";
import SearchBar from '../SearchBar/';

const MobileNav = ({ genres, isLoggedIn, user, userLogout }) => {
    const history = useHistory();
    const [mobileNavIsOpen, setMobileNavIsOpen] = useState(false);

    const logoutButton = () => {
        const handleLogout = () => {
            userLogout();
            setMobileNavIsOpen(false);
        }

        return (
            <span className="pointer shadow heading" onClick={handleLogout}>Log Out</span>
        );
    };

    const toggleNav = () => {
        mobileNavIsOpen ? setMobileNavIsOpen(false) : setMobileNavIsOpen(true);
    };

    return (
        <div id="MobileNav">
            <div className="flex align center nav-wrapper mobile">
                <div className="item heading nav toggle mobile">
                    <button className="transparent border none" type="button" onClick={() => toggleNav(mobileNavIsOpen ? false : true )}>
                        <FontAwesomeIcon icon={mobileNavIsOpen ? faTimes : faBars} />
                    </button>
                </div>
                <div className="item heading nav mobile">
                    <Image src={mobileLogo} />
                </div>
                <div className="item heading nav mobile">
                    {isLoggedIn ? (
                        <Image 
                            src={user.profilePicture.secureURL}
                            className="shadow circle profile"
                            onClick={() => history.push("/users/account")}
                        />
                    ) : (
                        <NavLink
                            path="/login"
                            label="Login"
                            isMobile
                        />
                    )}
                </div>
            </div>
            {mobileNavIsOpen && <div className={`mobile-slider wrapper ${mobileNavIsOpen ? "active" : "disabled"}`}>
                <div className="mobile-slider content">
                    <div className="flex column fluid">
                        <SearchBar
                            isMobile
                        />
                        <NavLink
                            path="/"
                            label="Home"
                            isMobile
                        />
                        <NavLink
                            path="/discover/"
                            label="Discover"
                            children={genres}
                            childClasses={"secondary"}
                            childClick={() => setMobileNavIsOpen(false)}
                            isMobile
                        />
                        {isLoggedIn && <Fragment>
                            <NavLink 
                                path="/users/movies"
                                label="My Movies"
                                isMobile
                            />
                            <NavLink 
                                path="/users/account"
                                label="Account"
                                isMobile
                            />
                            <NavLink
                                button={logoutButton}
                                isMobile
                            />
                        </Fragment>}
                    </div>
                </div>
            </div>}
        </div>
    );
};

export default MobileNav;