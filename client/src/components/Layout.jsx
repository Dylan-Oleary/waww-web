import React, { useEffect, useState, Fragment } from 'react';
import {
    Route,
    Switch,
    useRouteMatch
} from "react-router-dom";
import { connect } from 'react-redux';

import { persistSession } from '../redux/actions/session';
import About from "../pages/About";
import Account from "../pages/Account";
import Contact from "../pages/Contact";
import Discover from "../pages/Discover";
import Footer from './Footer';
import Home from "../pages/Home";
import MovieProfile from '../pages/MovieProfile';
import Nav from './Nav';
import SearchResults from "../pages/SearchResults";
import UserList from "../pages/UserList";

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
                    <Switch>
                        <Route path="/about" component={ About } />
                        <Route path="/contact" component={ Contact } />
                        <Route path="/discover/:genre" component={ Discover } />
                        <Route path="/movies/:movieID" component={ MovieProfile } />
                        <Route path="/search" component={ SearchResults } />
                        <Route path="/users/watchlist" component={ UserList } />
                        <Route path="/users/favourites" component={ UserList } />
                        <Route path="/users/viewed" component={ UserList } />
                        <Route path="/users/account" component={ Account } />
                        <Route path="/" component={ Home } />
                    </Switch>
                </div>
                <Footer/>
            </Fragment>}
        </div>
    )
}

// "/users/account": () => <Layout><Account/></Layout>,

const mapStateToProps = ({ login }) => {
    return { login };
};

export default connect(mapStateToProps, { persistSession })(Layout);