import React from 'react';
import Layout from '../components/Layout';
import Account from '../pages/Account';
import Home from '../pages/Home';
import About from '../pages/About';
import UserList from '../pages/UserList';
import Login from '../pages/Login';
import MovieProfile from '../pages/MovieProfile';
import Register from '../pages/Register';
import SearchResults from '../pages/SearchResults';

const routes = {
    "/": () => <Layout><Home/></Layout>,
    "/about": () => <Layout><About/></Layout>,
    "/search*": () => <Layout><SearchResults /></Layout>,
    "/users/watchlist": () => <Layout><UserList/></Layout>,
    "/users/viewed": () => <Layout><UserList/></Layout>,
    "/users/favourites": () => <Layout><UserList/></Layout>,
    "/users/account": () => <Layout><Account/></Layout>,
    "/tmdb": () => { 
        window.location.href = 'https://www.themoviedb.org/?language=en-US'; 
        return null;
    },
    "/github": () => { 
        window.location.href = 'https://github.com/Dylan-Oleary'; 
        return null;
    },
    "/tmdb-api": () => { 
        window.location.href = 'https://www.themoviedb.org/documentation/api'; 
        return null;
    },
    "/github-repo": () => { 
        window.location.href = 'https://github.com/Dylan-Oleary/entertainment-vault'; 
        return null;
    },
    "/login": () => <Login/>,
    "/register": () => <Register/>,
    "/movies/:movieID": params => <Layout><MovieProfile params={params} /></Layout>
}

export default routes;