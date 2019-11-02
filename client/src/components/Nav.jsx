import React, { useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
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
                                    <Link className="item" onClick={() => setListMenu(false)} to="/users/watchlist"> WatchList </Link>
                                    <Link className="item" onClick={() => setListMenu(false)} to="/users/favourites"> Favourites </Link>
                                    <Link className="item" onClick={() => setListMenu(false)} to="/users/viewed"> Viewed </Link>
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
                                    <Link className="item" onClick={() => setAccountMenu(false)} to="/users/account">My Account</Link>
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
                    <Link className="item" to="/"> Home </Link>
                    <Link className="item" to="/discover/action">Discover</Link>
                    {
                        isLoggedIn === true ? listMenu() : null
                    }
                    <SearchBar />
                    {
                        isLoggedIn === false ? (
                            [
                                <Link key ={"Register"} className="item" to="/register"> Register </Link>,
                                <Link key={"Login"} className="item" to="/login"> Login </Link>
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