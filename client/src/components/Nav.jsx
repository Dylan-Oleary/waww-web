import React, { useState, useEffect, useRef, Fragment } from 'react';
import { connect } from 'react-redux';
import { A, navigate } from 'hookrouter';

import { userLogout } from '../redux/actions/session';
import SearchBar from './SearchBar';
import OutsideClickDetect from './OutsideClickDetect';

const Nav = ({ user, isLoggedIn, userLogout }) => {
    const [listMenuIsOpen, setListMenu] = useState(false);
    const [accountMenuIsOpen, setAccountMenu] = useState(false);

    const listMenu = () => {
        return (
            <div className="ui item">
                <OutsideClickDetect className="dropdown" state={listMenuIsOpen} setState={setListMenu}>
                    <span className="text">My Lists</span>
                    {
                        listMenuIsOpen === true ? (
                            <Fragment>
                                <i onClick={() => setListMenu(false)} className="angle up icon"></i>
                                <div className="dropdown-items">
                                    <A className="item" onClick={() => setListMenu(false)} href="/users/watchlist"> WatchList </A>
                                    <A className="item" onClick={() => setListMenu(false)} href="/users/favourites"> Favourites </A>
                                    <A className="item" onClick={() => setListMenu(false)} href="/users/viewed"> Viewed </A>
                                </div>
                            </Fragment>
                        ) : <i onClick={() => setListMenu(true)} className="angle down icon"></i>
                    }
                </OutsideClickDetect>
            </div>
        )
    }

    const accountMenu = () => {
        return (
            <div className="ui item">
                <img className="ui avatar image" src={user.profilePicture.secureURL} />
                <OutsideClickDetect className="dropdown" state={accountMenuIsOpen} setState={setAccountMenu}>
                    <span className="item">{user.username}</span>
                    {
                        accountMenuIsOpen === true ? (
                            <Fragment>
                                <i onClick={() => setAccountMenu(false)} className="angle up icon"></i>
                                <div className="dropdown-items">
                                    <A className="item" onClick={() => setAccountMenu(false)} href="/users/account">My Account</A>
                                    <span onClick={userLogout} className="item"> Log Out </span>
                                </div>
                            </Fragment>
                        ) : <i onClick={() => setAccountMenu(true)} className="angle down icon"></i>
                    }
                </OutsideClickDetect>
            </div>
        )
    }

    return (
        <div id="Nav" className="ui secondary menu">
            <div className="ui container grid">
                <div className="row">
                    <A className="item" href="/"> Home </A>
                    <span className="item" onClick={() => navigate('/discover/action')}>Discover</span>
                    {
                        isLoggedIn === true ? listMenu() : null
                    }
                    <SearchBar />
                    {
                        isLoggedIn === false ? (
                            [
                                <A key ={"Register"} className="item" href="/register"> Register </A>,
                                <A key={"Login"} className="item" href="/login"> Login </A>
                            ]
                        ) : accountMenu()
                    }
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ login, user }) => {
    return { 
        isLoggedIn: login.isLoggedIn,
        user: {
            username: user.username,
            profilePicture: user.profilePicture
        }
    };
}

export default connect(mapStateToProps, { userLogout })(Nav);