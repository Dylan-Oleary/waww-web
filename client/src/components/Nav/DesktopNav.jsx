import React, { useState, Fragment } from 'react';
import { Link } from "react-router-dom";
import { Grid, Icon, Image, GridColumn, GridRow } from "semantic-ui-react";
import { Transition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons"

import SearchBar from '../SearchBar';
import OutsideClickDetect from '../OutsideClickDetect';

const DesktopNav = ({ isLoggedIn, user, userLogout }) => {
    const [listMenuIsOpen, setListMenu] = useState(false);
    const [accountMenuIsOpen, setAccountMenuIsOpen] = useState(false);

    return (
        <div id="DesktopNav">
            <div className="flex align-center nav-wrapper">
                <Link className="item heading nav shadow" to="/"> Home </Link>
                <Link className="item heading nav shadow" to="/discover/action">Discover</Link>
                {isLoggedIn && <div className="item heading nav shadow">
                    <OutsideClickDetect className="dropdown" state={listMenuIsOpen} setState={setListMenu}>
                        <span>Lists</span>
                        {listMenuIsOpen ? 
                            (
                                <Fragment>
                                    <i onClick={() => setListMenu(false)} className="angle up icon"></i>
                                    <div className="dropdown-items">
                                        <Link className="item" onClick={() => setListMenu(false)} to="/users/watchlist">WatchList</Link>
                                        <Link className="item" onClick={() => setListMenu(false)} to="/users/favourites">Favourites</Link>
                                        <Link className="item" onClick={() => setListMenu(false)} to="/users/viewed">Viewed</Link>
                                    </div>
                                </Fragment>
                            ) : (
                                <i onClick={() => setListMenu(true)} className="angle down icon"></i>
                            )
                        }
                    </OutsideClickDetect>
                </div>}
                <SearchBar />
                {isLoggedIn ?
                    (
                        <div className="item heading nav shadow">
                            <Image 
                                src={user.profilePicture.secureURL}
                                className="shadow circle"
                                avatar
                            />
                            <OutsideClickDetect className="dropdown" state={accountMenuIsOpen} setState={setAccountMenuIsOpen}>
                                <span>{user.username}</span>
                                {accountMenuIsOpen ? 
                                    (
                                        <Fragment>
                                            <i onClick={() => setAccountMenuIsOpen(false)} className="angle up icon"></i>
                                            <div className="dropdown-items flex column">
                                                <Link className="item" onClick={() => setAccountMenuIsOpen(false)} to="/users/account">My Account</Link>
                                                <span onClick={userLogout} className="item"> Log Out </span>
                                            </div>
                                        </Fragment>
                                    ) : (
                                        <i onClick={() => setAccountMenuIsOpen(true)} className="angle down icon"></i>
                                    )
                                }
                            </OutsideClickDetect>
                        </div>
                    ) : (
                        <Fragment>
                            <Link className="item heading nav shadow" to="/register"> Register </Link>
                            <Link className="item heading nav shadow" to="/login"> Login </Link>
                        </Fragment>
                    )
                }
            </div>
        </div>
    );
};

export default DesktopNav;