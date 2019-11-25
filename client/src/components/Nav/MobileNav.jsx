import React, { useState, Fragment } from 'react';
import { Link, useHistory } from "react-router-dom";
import { Image } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons"

import mobileLogo from "../../public/assets/images/inverted-logo.svg"
import SearchBar from '../SearchBar/';
import OutsideClickDetect from '../OutsideClickDetect';


const MobileNav = ({ genres, isLoggedIn, user, userLogout }) => {
    const navItems = [
        { id: 0, label:"Home", link: "/", children: [], authRequired: false },
        { id: 1, label: "Discover", link: "/discover/", children: genres, authRequired: false },
        { id: 2, label: "My Movies", link: "/users/movies", children: [], authRequired: true },
        { id: 3, label: "Account", link: "/users/account", children: [], authRequired: true },
    ];
    const history = useHistory();
    const [mobileNavIsOpen, setMobileNavIsOpen] = useState(false);
    const [secondaryMenuOpen, setSecondaryMenuOpen] = useState(null);

    const handleLogout = () => {
        userLogout();
        setMobileNavIsOpen(false);
    }

    const handleNavItemClick = item => {
        if(item.children.length === 0){
            setSecondaryMenuOpen(null);
            setMobileNavIsOpen(false);
            history.push(item.link);
        } else {
            if(secondaryMenuOpen !== item.id){
                setSecondaryMenuOpen(item.id)
            } else {
                setSecondaryMenuOpen(null);
            }
        }
    };

    const handleSecondaryNavItemClick = link => {
        history.push(link);
        setSecondaryMenuOpen(null);
        setMobileNavIsOpen(false);
    };

    const toggleNav = () => {
        setSecondaryMenuOpen(null);

        if(mobileNavIsOpen){
            setMobileNavIsOpen(false);
        } else {
            setMobileNavIsOpen(true);
        }
    };

    const renderNavItem = item => {
        if(
            (item.authRequired && isLoggedIn) ||
            !item.authRequired
        ) {
            return (
                <Fragment>
                    <div className={`mobile-slider item-wrapper ${(secondaryMenuOpen === item.id && item.children.length > 0) ? "active" : ""}`}>
                        <Link className="heading nav shadow list red" onClick={() => handleNavItemClick(item)}>{item.label}</Link>
                    </div>
                    {(item.children.length > 0 && secondaryMenuOpen === item.id) && <div className={`flex secondary`}>
                    {item.children.map(child => <Link className="shadow" onClick={() => handleSecondaryNavItemClick(`${item.link}${child.slug}`)}>{child.name.toUpperCase()}</Link>)}
                    </div>}
                </Fragment>
            );
        }
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
                        <Link className="heading nav shadow" to="/login">Login</Link>
                    )}
                </div>
            </div>
            {mobileNavIsOpen && <div className={`mobile-slider wrapper ${mobileNavIsOpen ? "active" : "disabled"}`}>
                <div className="mobile-slider content">
                    <div className="flex column fluid">
                        <SearchBar
                            isMobile
                        />
                        {navItems.map(item => renderNavItem(item))}
                    </div>
                    {isLoggedIn && <Fragment>
                        <div className="mobile-slider item-wrapper">
                            <Link className="heading nav shadow list red" onClick={() => handleLogout()}> Log Out </Link>
                        </div>
                    </Fragment>}
                </div>
            </div>}
        </div>
    );
};

export default MobileNav;